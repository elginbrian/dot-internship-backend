import { LaporanStatus } from '../entities/laporan.entity';

export interface LaporanFilters {
  userId?: string;
  cabang?: string;
  status?: LaporanStatus;
  jenisLaporan?: string;
  kategori?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface LaporanStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface LeaderboardEntry {
  userId: string;
  count: number;
  username: string;
  nip: string;
  divisi: string;
  cabang: string;
}
