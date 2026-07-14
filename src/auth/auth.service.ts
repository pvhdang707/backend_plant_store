import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Cart } from '../carts/entities/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) throw new BadRequestException('Email đã được sử dụng');

    // mã hóa mật khẩu (SaltRounds =10)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // lưu vào db
    const user = await this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    const savedUser = await this.userRepository.save(user)

    // tạo giỏ hàng cho user vừa đăng kí
    const cart = this.cartRepository.create({user: savedUser})
    await this.cartRepository.save(cart)

    const { password, ...userWithoutPassword } = savedUser;

    return { message: 'Đăng kí thành công', user: userWithoutPassword };
  }

  async login(loginDto: LoginDto) {
    // tìm user theo email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user)
      throw new UnauthorizedException('Tài khoản không tồn tại');

    // so sánh mật khẩu gốc Fe gửi lên và mật khẩu đã mã hóa trong db
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Mật khẩu không chính xác');

    // nếu đúng tạo jwt token chứa id và email của user
    const payload = { sub: user.id, email: user.email, role:user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      accessToken: accessToken, //trả token về cho fe
    };
  }
}
