import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductVariantDto } from './dto/update-product.dto';


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
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
          variants: {
            create: dto.variants?.map(variant => ({
              name: variant.name,
              sku: variant.sku,
              stock: variant.stock,
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
  async updateProduct(productId: number, dto: UpdateProductDto) {
    try {
      const updateData: any = {};
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.category !== undefined) updateData.category = dto.category;
      if (dto.price !== undefined) updateData.price = dto.price;

      if (dto.variants && Array.isArray(dto.variants)) {
        updateData.variants = {
          upsert: dto.variants.map((variant: UpdateProductVariantDto) => ({
            where: variant.id ? { id: variant.id } : { id: 0 },
            update: {
              ...(variant.name !== undefined && { name: variant.name }),
              ...(variant.sku !== undefined && { sku: variant.sku }),
              ...(variant.stock !== undefined && { stock: variant.stock }),
            },
            create: {
              name: variant.name ?? '',
              sku: variant.sku ?? '',
              stock: variant.stock ?? 0,
            },
          })),
        };
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: { variants: true },
      });
      return updatedProduct;
    } catch (error) {
      throw new HttpException('Failed to update product', HttpStatus.BAD_REQUEST);
    }
  }

  async adjustStockLevel(variantId: number, stock: number) {
    try {
      const updatedVariant = await this.prisma.productVariant.update({
        where: { id: variantId },
        data: { stock },
      });
      return updatedVariant;
    } catch (error) {
      throw new HttpException('Failed to adjust stock level', HttpStatus.BAD_REQUEST);
    }
  }

  async archiveProduct(productId: number) {
    try {
      const archivedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: {
          deletedAt: new Date(),
        },
      });
      return archivedProduct;
    } catch (error) {
      throw new HttpException('Failed to archive product', HttpStatus.BAD_REQUEST);
    }
  }
}