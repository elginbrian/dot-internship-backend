import { Injectable, Inject } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { Laporan, LaporanStatus } from '@domain/entities/laporan.entity';

@Injectable()
export class CreateLaporanUseCase {
  constructor(
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
  ) {}

  async execute(
    data: Omit<Laporan, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Laporan> {
    const laporan: Laporan = {
      ...data,
      status: LaporanStatus.PENDING,
    };

    return await this.laporanRepository.create(laporan);
  }
}
