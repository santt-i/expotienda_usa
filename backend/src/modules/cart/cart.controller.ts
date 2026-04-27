import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  addItem(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItem(req.user.userId, addToCartDto);
  }

  @Put('item/:itemId')
  updateItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.userId, +itemId, updateCartItemDto.quantity);
  }

  @Delete('item/:itemId')
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.userId, +itemId);
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Post('checkout')
  checkout(@Request() req) {
    return this.cartService.checkout(req.user.userId);
  }
}