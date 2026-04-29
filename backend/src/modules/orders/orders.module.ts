import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module'; // ← importar

@Module({
  imports: [NotificationsModule], // ← agregar
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}