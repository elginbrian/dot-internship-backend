import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaporanController } from './laporan.controller';
import { CreateLaporanUseCase } from '@application/use-cases/laporan/create-laporan.use-case';
import { UpdateLaporanUseCase } from '@application/use-cases/laporan/update-laporan.use-case';
import { ValidateLaporanUseCase } from '@application/use-cases/laporan/validate-laporan.use-case';
import { GetLaporanListUseCase } from '@application/use-cases/laporan/get-laporan-list.use-case';
import { LaporanRepository } from '@infrastructure/database/repositories/laporan.repository';
import { LaporanOrmEntity } from '@infrastructure/database/entities/laporan.orm-entity';
import { FileStorageService } from '@infrastructure/storage/file-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([LaporanOrmEntity])],
  controllers: [LaporanController],
  providers: [
    CreateLaporanUseCase,
    UpdateLaporanUseCase,
    ValidateLaporanUseCase,
    GetLaporanListUseCase,
    FileStorageService,
    {
      provide: 'ILaporanRepository',
      useClass: LaporanRepository,
    },
    LaporanRepository,
  ],
})
export class LaporanModule {}
