import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class SendQuoteDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  price?: number; // si no se envía, se tomará del producto
}