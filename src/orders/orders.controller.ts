import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { GetUser } from '../auth/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(
    @GetUser('userId') userId: number,
    @Body('shippingAddress') shippingAddress: string,
  ) {
    return this.ordersService.checkout(userId, shippingAddress);
  }
}