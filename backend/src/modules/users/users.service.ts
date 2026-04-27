import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      // Excluir password por seguridad
      select: { id: true, email: true, name: true, role: true, country: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  const { password, ...rest } = updateUserDto;
  const data: any = { ...rest };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  try {
    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, country: true, createdAt: true, updatedAt: true },
    });
    return updated;
  } catch (error) {
    // Verificar si es un error de Prisma y si tiene código
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      throw new NotFoundException('Usuario no encontrado');
    }
    throw error;
  }
}
}