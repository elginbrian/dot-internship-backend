import { Injectable } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';

@Injectable()
export class GetLeaderboardUseCase {
  constructor(private readonly laporanRepository: ILaporanRepository) {}

  async execute(limit: number = 10): Promise<any[]> {
    return await this.laporanRepository.getLeaderboard(limit);
  }
}
