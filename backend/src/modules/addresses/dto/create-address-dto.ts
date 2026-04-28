import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  label: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}