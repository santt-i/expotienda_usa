import { Controller, Get, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(@Query('limit') limit = 50, @Query('offset') offset = 0) {
    return this.adminService.getUsers(+limit, +offset);
  }

  @Put('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.adminService.updateUserRole(+id, role);
  }

  @Get('stores')
  getStores(@Query('limit') limit = 50, @Query('offset') offset = 0) {
    return this.adminService.getStores(+limit, +offset);
  }

  @Delete('stores/:id')
  deleteStore(@Param('id') id: string) {
    return this.adminService.deleteStore(+id);
  }
}