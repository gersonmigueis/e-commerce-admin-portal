import { IsString, IsNumber, IsObject } from 'class-validator';

export class CreateProductVariantDto {

  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsNumber()
  stock: number;

}