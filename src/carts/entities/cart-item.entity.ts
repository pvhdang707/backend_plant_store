import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Plant } from '../../plants/entities/plant.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 1 })
  quantity!: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart!: Cart;

  @ManyToOne(() => Plant) // Liên kết với Cây cảnh
  plant!: Plant;
}