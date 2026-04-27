import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.store.findMany({
      include: { owner: true, products: true }
    });
  }

  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { owner: true, products: true }
    });
    
    if (!store) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }
    return store;
  }

  async create(createStoreDto: CreateStoreDto, ownerId: number) {
    // Verificar si el usuario ya tiene una tienda
    const existingStore = await this.prisma.store.findUnique({
      where: { ownerId }
    });

    if (existingStore) {
      throw new ForbiddenException('Ya tienes una tienda creada');
    }

    return this.prisma.store.create({
      data: {
        name: createStoreDto.name,
        ownerId: ownerId
      }
    });
  }

  async update(id: number, updateStoreDto: Partial<CreateStoreDto>, userId: number, userRole: string) {
    const store = await this.findOne(id);
    
    // Solo el dueño o un admin pueden editar
    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para editar esta tienda');
    }

    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const store = await this.findOne(id);
    
    // Solo el dueño o un admin pueden eliminar
    if (store.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para eliminar esta tienda');
    }

    return this.prisma.store.delete({
      where: { id }
    });
  }
}