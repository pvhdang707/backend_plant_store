import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Cart]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions:{expiresIn:'1d'}
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
