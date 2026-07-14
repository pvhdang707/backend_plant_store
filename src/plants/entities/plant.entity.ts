import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('int')
  price!: number;

  @Column({ nullable: true })
  wateringInstruction!: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: false })
  isDeleted!: boolean;

  @ManyToOne(() => Category, (category) => category.plants)
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}