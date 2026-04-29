import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsPositive, 
  Min,
  IsOptional
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  priceCOP: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @IsPositive()
  storeId: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}