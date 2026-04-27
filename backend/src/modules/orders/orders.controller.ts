import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {

    constructor(private readonly ordersService: OrdersService){}

    @Post()
    create(@Request() req, @Body() createOrderDto: CreateOrderDto){
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get('my')
    findMyOrders(@Request() req){
        return this.ordersService.findMyOrders(req.user.userId);
    }

    @Get('store/:storeId')
    findStoreOrders(@Param('storeId') storeId: string, @Request() req){
        return this.ordersService.findStoreOrders(+storeId, req.user.userId, req.user.role);
    }

     @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.ordersService.findOne(+id, req.user.userId, req.user.role);
    }

     @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req) {
        return this.ordersService.updateStatus(+id, updateOrderDto, req.user.userId, req.user.role);
    }

     @Put(':id/cancel')
    cancelOrder(@Param('id') id: string, @Request() req) {
        return this.ordersService.cancelOrder(+id, req.user.userId, req.user.role);
    }
    }

