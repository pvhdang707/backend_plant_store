import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Plant } from '../../plants/entities/plant.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  quantity!: number;

  @Column('int')
  price!: number; // Chốt chặn bảo vệ giá tiền của đơn hàng lịch sử

  @ManyToOne(() => Order, (order) => order.items)
  order!: Order;

  @ManyToOne(() => Plant)
  plant!: Plant;
}