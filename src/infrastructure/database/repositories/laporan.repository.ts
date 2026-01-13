import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import {
  ILaporanRepository,
  LaporanFilters,
} from '@domain/repositories/laporan.repository.interface';
import { Laporan } from '@domain/entities/laporan.entity';
import { LaporanOrmEntity } from '../entities/laporan.orm-entity';

@Injectable()
export class LaporanRepository implements ILaporanRepository {
  constructor(
    @InjectRepository(LaporanOrmEntity)
    private readonly repository: Repository<LaporanOrmEntity>,
  ) {}

  async create(laporan: Laporan): Promise<Laporan> {
    const entity = this.repository.create(laporan);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Laporan | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(
    filters: LaporanFilters,
    page: number,
    limit: number,
  ): Promise<{ laporan: Laporan[]; total: number }> {
    const where: FindOptionsWhere<LaporanOrmEntity> = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status as any;
    if (filters.jenisLaporan) where.jenisLaporan = filters.jenisLaporan as any;
    if (filters.kategori) where.kategori = filters.kategori as any;

    if (filters.startDate && filters.endDate) {
      where.createdAt = Between(filters.startDate, filters.endDate) as any;
    }

    const [entities, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      laporan: entities.map((e) => this.toDomain(e)),
      total,
    };
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ laporan: Laporan[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      laporan: entities.map((e) => this.toDomain(e)),
      total,
    };
  }

  async update(id: string, data: Partial<Laporan>): Promise<Laporan> {
    await this.repository.update(id, data as any);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Laporan not found');
    }
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getStatistics(): Promise<any> {
    const total = await this.repository.count();
    const pending = await this.repository.count({ where: { status: 'pending' as any } });
    const approved = await this.repository.count({ where: { status: 'approved' as any } });
    const rejected = await this.repository.count({ where: { status: 'rejected' as any } });

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }

  async getLeaderboard(limit: number): Promise<any[]> {
    const result = await this.repository
      .createQueryBuilder('laporan')
      .select('laporan.userId', 'userId')
      .addSelect('COUNT(*)', 'count')
      .addSelect('user.username', 'username')
      .addSelect('user.nip', 'nip')
      .addSelect('user.divisi', 'divisi')
      .addSelect('user.cabang', 'cabang')
      .leftJoin('laporan.user', 'user')
      .where('laporan.status = :status', { status: 'approved' })
      .groupBy('laporan.userId')
      .addGroupBy('user.username')
      .addGroupBy('user.nip')
      .addGroupBy('user.divisi')
      .addGroupBy('user.cabang')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }

  private toDomain(entity: LaporanOrmEntity): Laporan {
    return {
      id: entity.id,
      userId: entity.userId,
      jenisLaporan: entity.jenisLaporan as any,
      kategori: entity.kategori as any,
      instansi: entity.instansi,
      deskripsi: entity.deskripsi,
      total: entity.total,
      fotoFilename: entity.fotoFilename,
      latitude: entity.latitude ? Number(entity.latitude) : undefined,
      longitude: entity.longitude ? Number(entity.longitude) : undefined,
      timestampFoto: entity.timestampFoto,
      status: entity.status as any,
      remark: entity.remark,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
