import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class ManageUsersUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async getAll(
    page: number = 1,
    limit: number = 10,
    currentUserId: string,
    currentUserRole: string,
  ): Promise<{ users: User[]; total: number }> {
    if (currentUserRole === 'SUPERVISOR') {
      return await this.userRepository.findAll(page, limit);
    }

    if (currentUserRole === 'ADMIN') {
      const currentUser = await this.userRepository.findById(currentUserId);
      if (!currentUser) {
        throw new Error('Current user not found');
      }
      return await this.userRepository.findByCabang(currentUser.cabang, page, limit);
    }

    return { users: [], total: 0 };
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
