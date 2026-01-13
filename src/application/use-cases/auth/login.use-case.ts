import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UserNotFoundException,
  InvalidCredentialsException,
} from '@domain/exceptions/domain.exception';

@Injectable()
export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException(email);
    }

    if (!user.isActive) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
