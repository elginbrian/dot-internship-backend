export enum JenisLaporan {
  KUNJUNGAN_NASABAH = 'Kunjungan Nasabah',
  SHARE_BROADCAST = 'Share Broadcast',
}

export enum KategoriKunjungan {
  TNI = 'TNI',
  ASN = 'ASN',
  POLRI = 'POLRI',
  BUMN = 'BUMN',
  PENSIUNAN = 'Pensiunan',
  PRAPURNA = 'Prapurna',
  LAINNYA = 'Lainnya',
}

export enum LaporanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Laporan {
  id?: string;
  userId: string;
  jenisLaporan: JenisLaporan;
  kategori: KategoriKunjungan;
  instansi: string;
  deskripsi: string;
  total: number;
  fotoFilename?: string;
  fotoUrl?: string;
  latitude?: number;
  longitude?: number;
  timestampFoto?: Date;
  status: LaporanStatus;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
