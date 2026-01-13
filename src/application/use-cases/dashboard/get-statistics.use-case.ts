import { Injectable } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';

@Injectable()
export class GetStatisticsUseCase {
  constructor(private readonly laporanRepository: ILaporanRepository) {}

  async execute(): Promise<any> {
    return await this.laporanRepository.getStatistics();
  }
}
