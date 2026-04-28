import {
  Controller, Post, Delete,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';

// Todos los endpoints de uploads requieren autenticación
@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // POST /uploads/signature
  @Post('signature')
  generateSignature(@Body('timestamp') timestamp: number) {
    return this.uploadsService.generateSignature(timestamp);
  }

  // POST /uploads/product/:id
  @Post('product/:id')
  addImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.uploadsService.addImageToProduct(+id, imageUrl);
  }

  // DELETE /uploads/product/:id
  @Delete('product/:id')
  removeImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.uploadsService.removeImageFromProduct(+id, imageUrl);
  }
}