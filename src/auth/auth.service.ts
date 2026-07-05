import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, //dịch vụ tạo token của nestjs
  ) {}

  async register(registerDto: RegisterDto) {
    // kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) throw new BadRequestException('Email da duoc su dung');

    // mã hóa mật khẩu (SaltRounds =10)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // lưu vào db
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      },
    });

    return { message: 'Dang ki thanh cong', userId: user.id };
  }

  async login(loginDto: LoginDto) {
    // tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user)
      throw new UnauthorizedException('Email hoac mat khau khong dung');

    // so sánh mật khẩu gốc Fe gửi lên và mật khẩu đã mã hóa trong db
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Email hoac mat khau khong dung');

    // nếu đúng tạo jwt token chứa id và email của user
    const payload = { sub: user.id, email: user.mail };
    const accessToken = this.jwtService.sign(payload,{
        secret: process.env.JWT_SECRET, //lấy từ .env
        expiresIn: '1d' // hạn token trong 1 ngày
    })

    return {
        message: 'Dang nhap thanh cong',
        accessToken:accessToken , //trả token về cho fe
    }
  }
}
