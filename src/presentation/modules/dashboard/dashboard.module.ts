import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { GetStatisticsUseCase } from '@application/use-cases/dashboard/get-statistics.use-case';
import { GetLeaderboardUseCase } from '@application/use-cases/dashboard/get-leaderboard.use-case';
import { LaporanRepository } from '@infrastructure/database/repositories/laporan.repository';
import { LaporanOrmEntity } from '@infrastructure/database/entities/laporan.orm-entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LaporanOrmEntity]), AuthModule],
  controllers: [DashboardController],
  providers: [
    GetStatisticsUseCase,
    GetLeaderboardUseCase,
    {
      provide: 'ILaporanRepository',
      useClass: LaporanRepository,
    },
    LaporanRepository,
  ],
})
export class DashboardModule {}
