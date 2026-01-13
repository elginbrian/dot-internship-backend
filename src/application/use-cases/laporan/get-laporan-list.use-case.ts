import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { LaporanFilters } from '@domain/types/laporan.types';
import { Laporan } from '@domain/entities/laporan.entity';

@Injectable()
export class GetLaporanListUseCase {
  constructor(
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    filters: LaporanFilters,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ laporan: any[]; total: number; page: number; totalPages: number }> {
    const result = await this.laporanRepository.findAll(filters, page, limit);
    const baseUrl = this.configService.get<string>('app.baseUrl') || 'http://localhost:3000';

    const laporanWithUrls = result.laporan.map((lap) => {
      const { fotoFilename, ...laporanWithoutFilename } = lap;
      return {
        ...laporanWithoutFilename,
        fotoUrl: fotoFilename ? `${baseUrl}/uploads/${fotoFilename}` : null,
      };
    });

    return {
      laporan: laporanWithUrls,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
