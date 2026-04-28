import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address-dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  // Obtener todas las direcciones del usuario
  async findAll(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' }, // la predeterminada primero
        { createdAt: 'desc' },
      ],
    });
  }

  // Crear nueva dirección
  async create(userId: number, dto: CreateAddressDto) {
    // Si la nueva dirección es predeterminada,
    // quitamos el predeterminado de las demás
    if (dto.isDefault) {
      await this.clearDefault(userId);
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
        country: dto.country ?? 'Colombia',
      },
    });
  }

  // Actualizar una dirección existente
  async update(userId: number, addressId: number, dto: Partial<CreateAddressDto>) {
    await this.verifyOwnership(userId, addressId);

    if (dto.isDefault) {
      await this.clearDefault(userId);
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  // Eliminar una dirección
  async remove(userId: number, addressId: number) {
    await this.verifyOwnership(userId, addressId);

    return this.prisma.address.delete({
      where: { id: addressId },
    });
  }

  // Marcar una dirección como predeterminada
  async setDefault(userId: number, addressId: number) {
    await this.verifyOwnership(userId, addressId);
    await this.clearDefault(userId);

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  // Método privado — verifica que la dirección pertenece al usuario
  // Si no, lanza ForbiddenException — el usuario no puede tocar
  // direcciones de otros usuarios aunque conozca el ID
  private async verifyOwnership(userId: number, addressId: number) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar esta dirección');
    }

    return address;
  }

  // Método privado — quita el predeterminado de todas las direcciones
  // del usuario antes de asignar uno nuevo
  private async clearDefault(userId: number) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}