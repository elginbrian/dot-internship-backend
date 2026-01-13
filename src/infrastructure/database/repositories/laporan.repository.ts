import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { LaporanFilters, LaporanStatistics, LeaderboardEntry } from '@domain/types/laporan.types';
import {
  Laporan,
  JenisLaporan,
  KategoriKunjungan,
  LaporanStatus,
} from '@domain/entities/laporan.entity';
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
    const queryBuilder = this.repository.createQueryBuilder('laporan');

    if (filters.userId) {
      queryBuilder.andWhere('laporan.userId = :userId', { userId: filters.userId });
    }

    if (filters.cabang) {
      queryBuilder
        .innerJoin('user', 'user', 'user.id = laporan.userId')
        .andWhere('user.cabang = :cabang', { cabang: filters.cabang });
    }

    if (filters.status) {
      queryBuilder.andWhere('laporan.status = :status', { status: filters.status });
    }

    if (filters.jenisLaporan) {
      queryBuilder.andWhere('laporan.jenisLaporan = :jenisLaporan', {
        jenisLaporan: filters.jenisLaporan,
      });
    }

    if (filters.kategori) {
      queryBuilder.andWhere('laporan.kategori = :kategori', { kategori: filters.kategori });
    }

    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('laporan.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    queryBuilder
      .orderBy('laporan.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

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
    await this.repository.update(id, data as unknown as LaporanOrmEntity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Laporan not found');
    }
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getStatistics(cabang?: string): Promise<LaporanStatistics> {
    const queryBuilder = this.repository.createQueryBuilder('laporan');

    if (cabang) {
      queryBuilder
        .innerJoin('user', 'user', 'user.id = laporan.userId')
        .where('user.cabang = :cabang', { cabang });
    }

    const total = await queryBuilder.getCount();

    const pendingQuery = queryBuilder
      .clone()
      .andWhere('laporan.status = :status', { status: 'pending' });
    const pending = await pendingQuery.getCount();

    const approvedQuery = queryBuilder
      .clone()
      .andWhere('laporan.status = :status', { status: 'approved' });
    const approved = await approvedQuery.getCount();

    const rejectedQuery = queryBuilder
      .clone()
      .andWhere('laporan.status = :status', { status: 'rejected' });
    const rejected = await rejectedQuery.getCount();

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }

  async getLeaderboard(limit: number, cabang?: string): Promise<LeaderboardEntry[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('laporan')
      .select('laporan.userId', 'userId')
      .addSelect('COUNT(*)', 'count')
      .addSelect('user.username', 'username')
      .addSelect('user.nip', 'nip')
      .addSelect('user.divisi', 'divisi')
      .addSelect('user.cabang', 'cabang')
      .leftJoin('laporan.user', 'user')
      .where('laporan.status = :status', { status: 'approved' });

    if (cabang) {
      queryBuilder.andWhere('user.cabang = :cabang', { cabang });
    }

    const result = await queryBuilder
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
      jenisLaporan: entity.jenisLaporan as JenisLaporan,
      kategori: entity.kategori as KategoriKunjungan,
      instansi: entity.instansi,
      deskripsi: entity.deskripsi,
      total: entity.total,
      fotoFilename: entity.fotoFilename,
      latitude: entity.latitude ? Number(entity.latitude) : undefined,
      longitude: entity.longitude ? Number(entity.longitude) : undefined,
      timestampFoto: entity.timestampFoto,
      status: entity.status as LaporanStatus,
      remark: entity.remark,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
