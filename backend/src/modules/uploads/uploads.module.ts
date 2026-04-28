import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  // agregar imágenes programáticamente en el futuro
  exports: [UploadsService],
})
export class UploadsModule {}