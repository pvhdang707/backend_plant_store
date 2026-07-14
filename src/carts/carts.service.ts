import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Plant } from '../plants/entities/plant.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Plant) private readonly plantRepo: Repository<Plant>,
  ) {}

  async getCart(userId: number){
    return this.cartRepo.findOne({
        where:{user:{id: userId}},
        // Ở TypeORM, dùng relations để kéo data liên kết
        relations:['items','items.plant']
    })
  }

  async addToCart(userId: number, plantId: number, quantity: number =1){
    //lấy giỏ hàng của user
    const cart = await this.cartRepo.findOne({
        where:{ user:{id:userId}}
    })
    if (!cart) throw new NotFoundException('Không tìm thấy giỏ hàng')

    // kiểm tra cây cảnh có tồn tại và đủ hàng không
    const plant = await this.plantRepo.findOne({where: {id: plantId, isDeleted :false}})
    if (!plant) throw new NotFoundException('Cây cảnh không tồn tại')
    if (plant.stock < quantity){
        throw new BadRequestException(`Chỉ còn ${plant.stock} cây trong kho`)
    }

    // kiểm tra xem san rphaamr có tỏng giỏ hàng chưa
    let cartItem = await this.cartItemRepo.findOne({
        where:{cart:{id: cart.id},plant:{id:plantId}}
    })
    if(cartItem){
        // nếu có thì cộng dồn số lượng
        if (plant.stock<cartItem.quantity + quantity){
            throw new BadRequestException('Số lượng vượt quá tồn kho cho phép')
        }
        cartItem.quantity += quantity
        await this.cartItemRepo.save(cartItem)
    } else{
        //chưa có thì tạo sản phẩm trong giỏ
        cartItem = this.cartItemRepo.create({
            cart:cart,
            plant:plant,
            quantity:quantity
        })

        await this.cartItemRepo.save(cartItem)
    }
    
    //trả về giỏ hàng mới nhất
    return this.getCart(userId)
  }
}
