import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail(
    {},
    { message: 'Vui lòng nhập đúng định dạng email (ví dụ: user@gmail.com)' },
  )
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu quá yếu, phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsString({ message: 'Tên phải là một chuỗi ký tự' })
  @IsOptional() // Tên có thể không bắt buộc nhập lúc đăng ký
  name?: string;
}
