import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard overview with habit stats and streaks' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  getDashboard() {
    return this.dashboardService.getDashboard();
  }
}
