import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

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

@Entity('laporan')
export class LaporanOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'jenis_laporan', type: 'enum', enum: JenisLaporan })
  jenisLaporan: JenisLaporan;

  @Column({ type: 'enum', enum: KategoriKunjungan })
  kategori: KategoriKunjungan;

  @Column()
  instansi: string;

  @Column('text')
  deskripsi: string;

  @Column({ type: 'int' })
  total: number;

  @Column({ name: 'foto_filename', nullable: true })
  fotoFilename: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ name: 'timestamp_foto', type: 'timestamp', nullable: true })
  timestampFoto: Date;

  @Column({ type: 'enum', enum: LaporanStatus, default: LaporanStatus.PENDING })
  status: LaporanStatus;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserOrmEntity, (user) => user.laporan)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
