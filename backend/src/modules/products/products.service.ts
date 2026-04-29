import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { store: true },
    });
  }

  // Método unificado para obtener un producto por ID con todas las relaciones necesarias
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        store: {
          include: {
            owner: true, // <-- Incluye los datos del dueño de la tienda
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  // Alias para claridad (opcional, puedes llamar directamente a findOne)
  async getProductById(id: number) {
    return this.findOne(id);
  }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>) {
    await this.findOne(id); // verificar existencia
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
      where: { id },
    });
  }
}