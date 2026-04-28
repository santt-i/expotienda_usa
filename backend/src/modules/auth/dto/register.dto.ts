import { IsEmail, IsString, MinLength, IsOptional, IsIn, Matches, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[a-z])/, { message: 'La contraseña debe contener al menos una minúscula' })
  @Matches(/(?=.*[A-Z])/, { message: 'La contraseña debe contener al menos una mayúscula' })
  @Matches(/(?=.*\d)/, { message: 'La contraseña debe contener al menos un número' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El país es requerido' })
  country: string;

  @IsOptional()
  @IsIn(['ADMIN', 'DISTRIBUIDOR', 'CLIENTE'], { message: 'Rol inválido' })
  role?: string;

  @IsOptional()
  @IsString()
  city?: string;
}