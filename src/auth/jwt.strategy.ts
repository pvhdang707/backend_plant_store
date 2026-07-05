import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lấy token từ Header của Request (Authorization: Bearer <token>)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Từ chối nếu token đã hết hạn
      secretOrKey: process.env.JWT_SECRET !,
    });
  }

  // Nếu token hợp lệ
  async validate(payload: any) {
    // payload { sub: id, email }
    // Dữ liệu trả về gắn vào biến req.user
    return { userId: payload.sub, email: payload.email };
  }
}