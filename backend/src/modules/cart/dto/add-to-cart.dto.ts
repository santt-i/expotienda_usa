import { IsNumber, IsPositive, IsInt } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;
}