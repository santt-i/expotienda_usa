import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('sales-overview')
  @Roles('ADMIN', 'DISTRIBUIDOR')
  async getSalesOverview(@Request() req, @Query('storeId') storeId?: string) {
    return this.analyticsService.getSalesOverview(
      req.user.userId,
      req.user.role,
      storeId ? parseInt(storeId) : undefined,
    );
  }
}