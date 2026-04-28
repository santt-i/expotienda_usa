import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address-dto';

@Controller('addresses')
@UseGuards(AuthGuard('jwt'))
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  // GET /addresses — ver todas mis direcciones
  @Get()
  findAll(@Request() req) {
    return this.addressesService.findAll(req.user.userId);
  }

  // POST /addresses — crear nueva dirección
  @Post()
  create(@Request() req, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(req.user.userId, dto);
  }

  // PUT /addresses/:id — editar una dirección
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: Partial<CreateAddressDto>,
  ) {
    return this.addressesService.update(req.user.userId, +id, dto);
  }

  // DELETE /addresses/:id — eliminar una dirección
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.addressesService.remove(req.user.userId, +id);
  }

  // PATCH /addresses/:id/default — marcar como predeterminada
  @Patch(':id/default')
  setDefault(@Request() req, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.userId, +id);
  }
}