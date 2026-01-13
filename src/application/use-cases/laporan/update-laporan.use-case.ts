import { Injectable, Inject } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { Laporan } from '@domain/entities/laporan.entity';
import { LaporanNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class UpdateLaporanUseCase {
  constructor(
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
  ) {}

  async execute(id: string, data: Partial<Laporan>): Promise<Laporan> {
    const existing = await this.laporanRepository.findById(id);

    if (!existing) {
      throw new LaporanNotFoundException(id);
    }

    return await this.laporanRepository.update(id, data);
  }
}
