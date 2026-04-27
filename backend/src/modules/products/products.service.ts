import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.product.findMany({
      include: { store: true }
    });
  }
  
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { store: true }
    });
    
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }
  
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto
    });
  }
  
  async update(id: number, updateProductDto: Partial<CreateProductDto>) {
  await this.findOne(id);

  const cleanData = Object.fromEntries(
    Object.entries(updateProductDto).filter(([_, v]) => v !== undefined)
  );

  return this.prisma.product.update({
    where: { id },
    data: cleanData,
  });
}
  
  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.product.delete({
      where: { id }
    });
  }
}