import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ default: 'USER' })
  role!: string;

  // 1 User chỉ có 1 Giỏ hàng
  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart;

  // 1 User có thể có nhiều Đơn hàng
  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @CreateDateColumn()
  createdAt!: Date;
}