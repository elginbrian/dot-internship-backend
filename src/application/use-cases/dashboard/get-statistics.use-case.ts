import { Injectable, Inject } from '@nestjs/common';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(currentUserId: string, currentUserRole: string): Promise<any> {
    let cabangFilter: string | undefined;

    if (currentUserRole === 'ADMIN') {
      const adminUser = await this.userRepository.findById(currentUserId);
      if (!adminUser) {
        throw new Error('Admin user not found');
      }
      cabangFilter = adminUser.cabang;
    }

    return await this.laporanRepository.getStatistics(cabangFilter);
  }
}
