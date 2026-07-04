import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPlantsFilterDto {
  @IsOptional()
  @Type(() => Number) //ép kiểu string trên url thành number
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @Type(() => Number) //ép kiểu string trên url thành number
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
