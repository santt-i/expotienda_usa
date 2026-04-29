import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  contextType?: string; // 'product', 'order', 'store'

  @IsOptional()
  @IsInt()
  contextId?: number;
}