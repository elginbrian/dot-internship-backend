import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LaporanOrmEntity } from './laporan.orm-entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
}

export enum Cabang {
  MALANG_KAWI = 'Malang Kawi',
  MADIUN = 'Madiun',
  KEDIRI = 'Kediri',
  MALANG_MARTADINATA = 'Malang Martadinata',
  LUMAJANG = 'Lumajang',
  MAGETAN = 'Magetan',
  NGANJUK = 'Nganjuk',
  BLITAR = 'Blitar',
  BANYUWANGI = 'Banyuwangi',
  BONDOWOSO = 'Bondowoso',
  JEMBER = 'Jember',
  PASURUAN = 'Pasuruan',
  PROBOLINGGO = 'Probolinggo',
  NGAWI = 'Ngawi',
  PONOROGO = 'Ponorogo',
  TULUNGAGUNG = 'Tulungagung',
  SITUBONDO = 'Situbondo',
  PACITAN = 'Pacitan',
  TRENGGALEK = 'Trenggalek',
  KCP_UNIVERSITAS_JEMBER = 'KCP Universitas Jember',
  PARE = 'Pare',
  KEPANJEN = 'Kepanjen',
  BATU = 'Batu',
  KCP_CARUBAN = 'KCP Caruban',
  KCP_UNIVERSITAS_BRAWIJAYA = 'KCP Universitas Brawijaya',
}

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ unique: true })
  nip: string;

  @Column()
  divisi: string;

  @Column({ name: 'no_hp' })
  noHp: string;

  @Column({ type: 'enum', enum: Cabang })
  cabang: Cabang;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => LaporanOrmEntity, (laporan) => laporan.user)
  laporan: LaporanOrmEntity[];
}
