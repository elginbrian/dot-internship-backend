import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import * as bcrypt from 'bcrypt';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly laporanRepository: ILaporanRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch()
  @ApiOperation({ summary: 'Update profile' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() data: any) {
    const updated = await this.userRepository.update(userId, data);
    const { passwordHash, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, { passwordHash: newHash });

    return { message: 'Password changed successfully' };
  }

  @Get('laporan')
  @ApiOperation({ summary: "Get user's laporan history" })
  async getUserLaporan(@CurrentUser('id') userId: string) {
    return await this.laporanRepository.findByUserId(userId, 1, 100);
  }
}
