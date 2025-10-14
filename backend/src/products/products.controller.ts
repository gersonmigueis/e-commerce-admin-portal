import { Controller, Get, Post, Put, Patch, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listProducts() {
    return this.productsService.listProducts();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProduct(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productsService.updateProduct(Number(id), updateDto);
  }

  @Patch('variant/:variantId/stock')
  async adjustStockLevel(@Param('variantId') variantId: string, @Body('stock') stock: number) {
    return this.productsService.adjustStockLevel(Number(variantId), stock);
  }

  @Patch(':id/archive')
  async archiveProduct(@Param('id') id: string) {
    return this.productsService.archiveProduct(Number(id));
  }
}