import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' }) // Tạo cột userId trong DB
  user!: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items!: CartItem[];
}