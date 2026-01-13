import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class ManageUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    return await this.userRepository.findAll(page, limit);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
