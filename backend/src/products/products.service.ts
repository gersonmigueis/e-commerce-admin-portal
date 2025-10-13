import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts() {
    return this.prisma.product.findMany({
      where: { isArchived: false },
      include: { variants: true },
    });
  }

  async createProduct(dto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          category: dto.category,
          price: dto.price,
          isArchived: dto.isArchived ?? false,
          variants: {
            create: dto.variants?.map(variant => ({
              name: variant.name,
              sku: variant.sku,
              stock: variant.stock,
              isArchived: variant.isArchived ?? false,
            })) || [],
          },
        },
        include: { variants: true },
      });
      return product;
    } catch (error) {
      throw new HttpException('Failed to create product', HttpStatus.BAD_REQUEST);
    }
  }
}