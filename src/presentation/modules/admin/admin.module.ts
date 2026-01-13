import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { ManageUsersUseCase } from '@application/use-cases/admin/manage-users.use-case';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { UserOrmEntity } from '@infrastructure/database/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [AdminController],
  providers: [
    ManageUsersUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserRepository,
  ],
})
export class AdminModule {}
