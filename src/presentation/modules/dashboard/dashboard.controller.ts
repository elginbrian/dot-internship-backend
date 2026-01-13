import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { GetStatisticsUseCase } from '@application/use-cases/dashboard/get-statistics.use-case';
import { GetLeaderboardUseCase } from '@application/use-cases/dashboard/get-leaderboard.use-case';
import { CurrentUserPayload } from '../auth/guards/jwt.types';

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
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description:
      'Get aggregated statistics including total laporan, approved/rejected/pending counts, total by jenis laporan and kategori.',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        totalLaporan: 150,
        totalApproved: 95,
        totalRejected: 20,
        totalPending: 35,
        byJenisLaporan: {
          'Kunjungan Nasabah': 100,
          'Kunjungan Non Nasabah': 50,
        },
        byKategori: {
          TNI: 30,
          POLRI: 25,
          PNS: 40,
          ASN: 20,
          Pensiunan: 15,
          Swasta: 15,
          Prapurna: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async getStats(@CurrentUser() user: CurrentUserPayload) {
    return await this.getStatisticsUseCase.execute(user.id, user.role);
  }

  @Get('leaderboard')
  @ApiOperation({
    summary: 'Get user leaderboard',
    description:
      'Get top users ranked by total number of approved laporan. Returns user info with their laporan count.',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    schema: {
      example: [
        {
          userId: '550e8400-e29b-41d4-a716-446655440001',
          username: 'john_doe',
          email: 'john@example.com',
          role: 'USER',
          totalLaporan: 45,
          approvedLaporan: 42,
          rank: 1,
        },
        {
          userId: '550e8400-e29b-41d4-a716-446655440002',
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'USER',
          totalLaporan: 38,
          approvedLaporan: 35,
          rank: 2,
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async getLeaderboard(
    @Query('limit') limit: number = 10,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return await this.getLeaderboardUseCase.execute(limit, user.id, user.role);
  }
}
