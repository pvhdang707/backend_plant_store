import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartsService } from './carts.service';
import { GetUser } from '../auth/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService){}

    @Get()
    getCart(@GetUser('userId') userId:number){
        return this.cartsService.getCart(userId)
    }

    @Post('add')
    addToCart(
        @GetUser('userId') userId:number,
        @Body() body: {plantId:number ; quantity:number}

    ){
        return this.cartsService.addToCart(userId,body.plantId,body.quantity)
    }
}
