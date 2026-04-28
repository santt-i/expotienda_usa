import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import cloudinary from '../../common/cloudinary/cloudinary.config';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}
  
  // Generar la firma que necesita cloudinary para subir
  generateSignature(timestamp: number) {
    const folder = 'expotienda/products';

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!,
    );
    // retornar al front lo que necesita para mostrar la imagen.
    return {
      signature,
      timestamp,
      folder,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    };
  }
  //metodo para agregar imagen a un producto
  async addImageToProduct(productId: number, imageUrl: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Producto ${productId} no encontrado`);
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: [...product.images, imageUrl],
      },
    });
  }
  // quitar imagen del producto
  async removeImageFromProduct(productId: number, imageUrl: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Producto ${productId} no encontrado`);
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: product.images.filter(img => img !== imageUrl),
      },
    });
  }
}