import { Laporan, LaporanStatus } from '../entities/laporan.entity';

export interface LaporanFilters {
  userId?: string;
  status?: LaporanStatus;
  jenisLaporan?: string;
  kategori?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ILaporanRepository {
  create(laporan: Laporan): Promise<Laporan>;
  findById(id: string): Promise<Laporan | null>;
  findAll(
    filters: LaporanFilters,
    page: number,
    limit: number,
  ): Promise<{ laporan: Laporan[]; total: number }>;
  findByUserId(userId: string, page: number, limit: number): Promise<{ laporan: Laporan[]; total: number }>;
  update(id: string, data: Partial<Laporan>): Promise<Laporan>;
  delete(id: string): Promise<void>;
  getStatistics(): Promise<any>;
  getLeaderboard(limit: number): Promise<any[]>;
}
