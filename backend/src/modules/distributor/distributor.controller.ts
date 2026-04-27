import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DistributorService } from './distributor.service';

@Controller('distributor')
@UseGuards(AuthGuard('jwt'))
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  @Get('metrics')
  async getMetrics(@Request() req) {
    return this.distributorService.getMetrics(req.user.userId);
  }

  @Get('products')
  async getMyProducts(@Request() req) {
    return this.distributorService.getMyProducts(req.user.userId);
  }

  @Get('orders')
  async getMyStoreOrders(@Request() req) {
    return this.distributorService.getMyStoreOrders(req.user.userId);
  }

  @Get('store')
  async getMyStore(@Request() req) {
    return this.distributorService.getStoreByUserId(req.user.userId);
  }
}