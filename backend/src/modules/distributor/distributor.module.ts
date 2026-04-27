import { Module } from '@nestjs/common';
import { DistributorController } from './distributor.controller';
import { DistributorService } from './distributor.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DistributorController],
  providers: [DistributorService, PrismaService],
})
export class DistributorModule {}