export class RegisterDto {
  email: string;
  password: string;
  name: string;
  country: string;
  role?: 'ADMIN' | 'DISTRIBUIDOR' | 'CLIENTE';
}