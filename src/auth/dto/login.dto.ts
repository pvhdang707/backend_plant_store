import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Vui lòng nhập đúng định dạng email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
  password!: string;
}