import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantsModule } from './plants/plants.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from './carts/carts.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng biến môi trường ở mọi nơi
      envFilePath: '.env', // Chỉ định rõ tên file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: {rejectUnauthorized: false},
        autoLoadEntities:true,
        synchronize: true
      }),

    }),
    PlantsModule,
    AuthModule,
    CartsModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService],
})
export class AppModule {}
