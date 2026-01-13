import { User, Cabang } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByNip(nip: string): Promise<User | null>;
  findAll(page: number, limit: number): Promise<{ users: User[]; total: number }>;
  findByCabang(
    cabang: Cabang,
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
