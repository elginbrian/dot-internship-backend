import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetStatisticsUseCase } from '@application/use-cases/dashboard/get-statistics.use-case';
import { GetLeaderboardUseCase } from '@application/use-cases/dashboard/get-leaderboard.use-case';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return await this.getStatisticsUseCase.execute();
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get user leaderboard' })
  async getLeaderboard(@Query('limit') limit: number = 10) {
    return await this.getLeaderboardUseCase.execute(limit);
  }
}
