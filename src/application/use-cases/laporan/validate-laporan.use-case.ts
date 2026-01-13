import { Injectable, Inject } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { Laporan, LaporanStatus } from '@domain/entities/laporan.entity';
import { LaporanNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class ValidateLaporanUseCase {
  constructor(
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
  ) {}

  async execute(id: string, status: LaporanStatus, remark?: string): Promise<Laporan> {
    const existing = await this.laporanRepository.findById(id);

    if (!existing) {
      throw new LaporanNotFoundException(id);
    }

    return await this.laporanRepository.update(id, { status, remark });
  }
}
