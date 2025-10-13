
import { Module } from '@nestjs/common';
import { ProductsService } from './products/products.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [require('./products/products.controller').ProductsController],
  providers: [ProductsService, PrismaService],
})
export class AppModule {}
