import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  stock: number;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}