import { Injectable, Inject } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
  ) {}

  async execute(): Promise<any> {
    return await this.laporanRepository.getStatistics();
  }
}
