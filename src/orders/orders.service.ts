import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { Plant } from '../plants/entities/plant.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {} // Tiêm DataSource của TypeORM

  async checkout(userId: number, shippingAddress: string) {
    // Khởi tạo một phiên giao dịch (Transaction)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Đọc Giỏ hàng (BẮT BUỘC dùng queryRunner.manager để nó nằm trong Transaction)
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.plant'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Giỏ hàng của bạn đang trống');
      }

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // 2. Lặp qua từng món hàng: Tính tiền và Trừ kho
      for (const item of cart.items) {
        if (item.plant.stock < item.quantity) {
          throw new BadRequestException(`Cây ${item.plant.name} chỉ còn ${item.plant.stock} chậu`);
        }
        
        // Tính tổng tiền
        totalAmount += item.plant.price * item.quantity;

        // TRỪ TỒN KHO
        item.plant.stock -= item.quantity;
        await queryRunner.manager.save(Plant, item.plant);

        // Chốt giá tiền vào OrderItem
        const orderItem = queryRunner.manager.create(OrderItem, {
          plant: item.plant,
          quantity: item.quantity,
          price: item.plant.price, // CHỐT CHẶN: Giá tại thời điểm mua
        });
        orderItems.push(orderItem);
      }

      // 3. Tạo Đơn hàng mới
      const order = queryRunner.manager.create(Order, {
        user: { id: userId },
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        items: orderItems,
      });
      await queryRunner.manager.save(Order, order);

      // 4. Xóa rỗng Giỏ hàng (Xóa các CartItem cũ)
      await queryRunner.manager.remove(CartItem, cart.items);

      // 5. NẾU MỌI THỨ ỔN THỎA -> GHI NHẬN VÀO DATABASE
      await queryRunner.commitTransaction();
      
      return { message: 'Đặt hàng thành công!', orderId: order.id };

    } catch (error) {
      // NẾU CÓ BẤT KỲ LỖI NÀO (dù là rớt mạng) -> HOÀN TÁC TOÀN BỘ
      await queryRunner.rollbackTransaction();
      
      // Giữ nguyên mã lỗi HTTP nếu là lỗi do ta tự ném ra (VD: BadRequest)
      if (error instanceof BadRequestException) throw error;
      
      throw new InternalServerErrorException('Lỗi hệ thống khi thanh toán');
    } finally {
      // 6. GIẢI PHÓNG KẾT NỐI (Rất quan trọng để không bị sập server do tràn RAM)
      await queryRunner.release();
    }
  }
}