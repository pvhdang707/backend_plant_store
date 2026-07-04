/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsInt
} from 'class-validator';
export class CreatePlantDto {
  @IsString({ message: 'tên cây phải là string' })
  @IsNotEmpty({ message: 'tên cây không được trống ' })
  name: string;

  @IsNumber({}, { message: 'giá tiền phải là số' })
  @Min(0, { message: 'giá tiền không thể âm' })
  price: number;

  @IsString()
  @IsOptional()
  wateringInstruction?: string;

  @IsInt({message: "ID danh mục phải là số nguyên"})
  @IsOptional()
  categoryId?:number;
}
