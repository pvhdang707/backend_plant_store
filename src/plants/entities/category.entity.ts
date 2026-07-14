import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plant } from './plant.entity';

@Entity('categories') // Tên bảng trong DB
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Plant, (plant) => plant.category)
  plants!: Plant[];
}