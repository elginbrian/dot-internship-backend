import { Injectable } from '@nestjs/common';
import { ILaporanRepository, LaporanFilters } from '@domain/repositories/laporan.repository.interface';
import { Laporan } from '@domain/entities/laporan.entity';

@Injectable()
export class GetLaporanListUseCase {
  constructor(private readonly laporanRepository: ILaporanRepository) {}

  async execute(
    filters: LaporanFilters,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ laporan: Laporan[]; total: number; page: number; totalPages: number }> {
    const result = await this.laporanRepository.findAll(filters, page, limit);

    return {
      ...result,
      page,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
