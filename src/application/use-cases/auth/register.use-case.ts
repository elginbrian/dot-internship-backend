import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User, UserRole } from '@domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '@domain/exceptions/domain.exception';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: Omit<User, 'id' | 'passwordHash' | 'isActive' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new UserAlreadyExistsException(data.email);
    }

    const existingNip = await this.userRepository.findByNip(data.nip);
    if (existingNip) {
      throw new UserAlreadyExistsException(data.nip);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user: User = {
      email: data.email,
      username: data.username,
      passwordHash,
      role: data.role || UserRole.USER,
      nip: data.nip,
      divisi: data.divisi,
      noHp: data.noHp,
      cabang: data.cabang,
      isActive: true,
    };

    return await this.userRepository.create(user);
  }
}
