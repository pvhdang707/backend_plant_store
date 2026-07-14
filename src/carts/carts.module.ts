import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Plant } from '../plants/entities/plant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem,Cart,Plant])],
  providers: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}
