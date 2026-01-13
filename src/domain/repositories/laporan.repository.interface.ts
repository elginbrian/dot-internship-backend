import { Laporan } from '../entities/laporan.entity';
import { LaporanFilters, LaporanStatistics, LeaderboardEntry } from '../types/laporan.types';

export interface ILaporanRepository {
  create(laporan: Laporan): Promise<Laporan>;
  findById(id: string): Promise<Laporan | null>;
  findAll(
    filters: LaporanFilters,
    page: number,
    limit: number,
  ): Promise<{ laporan: Laporan[]; total: number }>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ laporan: Laporan[]; total: number }>;
  update(id: string, data: Partial<Laporan>): Promise<Laporan>;
  delete(id: string): Promise<void>;
  getStatistics(cabang?: string): Promise<LaporanStatistics>;
  getLeaderboard(limit: number, cabang?: string): Promise<LeaderboardEntry[]>;
}
