import api from './axiosConfig';

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  folder: string;
  cloud_name: string;
  api_key: string;
}

export const uploadsService = {

  // Pedir la firma al backend
  async getSignature(): Promise<CloudinarySignature> {
    const timestamp = Math.round(Date.now() / 1000);
    const response = await api.post('/uploads/signature', { timestamp });
    return response.data;
  },

  // Subir la imagen directo a Cloudinary
  async uploadToCloudinary(
    imageUri: string,
    signature: CloudinarySignature,
  ): Promise<string> {

    const formData = new FormData();

    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product.jpg',
    } as any);

    // Agregar los datos de autenticación que nos dio el backend
    formData.append('signature', signature.signature);
    formData.append('timestamp', signature.timestamp.toString());
    formData.append('folder', signature.folder);
    formData.append('api_key', signature.api_key);

    // Subimos directo a Cloudinary — sin pasar por nuestro backend
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloud_name}/image/upload`,
      { method: 'POST', body: formData },
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();

    // secure_url es la URL HTTPS de la imagen ya subida
    // Esta es la URL que guardamos en la base de datos
    return data.secure_url;
  },

  // PASO C: Guardar la URL en el producto
  async saveImageToProduct(productId: number, imageUrl: string): Promise<void> {
    await api.post(`/uploads/product/${productId}`, { imageUrl });
  },

  // Función completa que hace los 3 pasos en orden
  async uploadProductImage(
    productId: number,
    imageUri: string,
  ): Promise<string> {
    // Paso 1 — pedir firma al backend
    const signature = await this.getSignature();
    // Paso 2 — subir a Cloudinary con esa firma
    const imageUrl = await this.uploadToCloudinary(imageUri, signature);
    // Paso 3 — guardar URL en el producto
    await this.saveImageToProduct(productId, imageUrl);
    // Devolvemos la URL para que el componente la muestre inmediatamente
    return imageUrl;
  },
};