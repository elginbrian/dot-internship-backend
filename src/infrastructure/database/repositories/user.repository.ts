import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User, UserRole, Cabang, Divisi } from '@domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const entity = this.repository.create(user);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNip(nip: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { nip } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users: entities.map((e) => this.toDomain(e)),
      total,
    };
  }

  async findByCabang(
    cabang: Cabang,
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      where: { cabang },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users: entities.map((e) => this.toDomain(e)),
      total,
    };
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data as unknown as UserOrmEntity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('User not found');
    }
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: UserOrmEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      passwordHash: entity.passwordHash,
      role: entity.role as UserRole,
      nip: entity.nip,
      divisi: entity.divisi as Divisi,
      noHp: entity.noHp,
      cabang: entity.cabang as Cabang,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
