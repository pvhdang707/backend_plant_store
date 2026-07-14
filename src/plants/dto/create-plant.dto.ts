import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(0) // Giá tiền không được âm
  price!: number;

  @IsInt()
  @Min(0) // Tồn kho không được âm
  stock!: number;

  @IsInt()
  categoryId!: number;

  @IsOptional()
  @IsString()
  wateringInstruction?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}