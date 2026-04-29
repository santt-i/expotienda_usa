// src/modules/chat/chat.controller.ts
import { Controller, Get, Put, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.userId);
  }

  @Get('messages/:userId')
  async getMessages(@Request() req, @Param('userId') userId: string) {
    return this.chatService.getMessages(req.user.userId, parseInt(userId));
  }

  @Put('messages/:id/accept-quote')
  async acceptQuote(@Param('id') id: string, @Request() req) {
    return this.chatService.acceptQuote(+id, req.user.userId);
  }
}