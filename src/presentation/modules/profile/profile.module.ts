import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { LaporanRepository } from '@infrastructure/database/repositories/laporan.repository';
import { UserOrmEntity } from '@infrastructure/database/entities/user.orm-entity';
import { LaporanOrmEntity } from '@infrastructure/database/entities/laporan.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, LaporanOrmEntity])],
  controllers: [ProfileController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'ILaporanRepository',
      useClass: LaporanRepository,
    },
    UserRepository,
    LaporanRepository,
  ],
})
export class ProfileModule {}
