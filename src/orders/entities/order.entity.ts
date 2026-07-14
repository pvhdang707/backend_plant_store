import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  totalAmount!: number;

  @Column({ default: 'PENDING' })
  status!: string;

  @Column()
  shippingAddress!: string;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;
}