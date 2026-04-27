import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))  // SOLO usuarios autenticados
  create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    // req.user tiene la info del token (userId, email, role)
    return this.storesService.create(createStoreDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateStoreDto: Partial<CreateStoreDto>, @Request() req) {
    return this.storesService.update(+id, updateStoreDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req: any) {
      return this.storesService.remove(+id, req.user.userId, req.user.role);
  }
}