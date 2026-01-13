import { Controller, Get, Patch, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
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
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Get profile information of the currently authenticated user. Returns all user fields except password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'user@example.com',
        username: 'john_doe',
        role: 'USER',
        nip: '123456789',
        namaLengkap: 'John Doe',
        jabatan: 'Account Officer',
        cabang: 'Jakarta',
        noTelepon: '081234567890',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch()
  @ApiOperation({
    summary: 'Update profile',
    description:
      'Update profile information of the currently authenticated user. Cannot update role or password through this endpoint.',
  })
  @ApiBody({
    description: 'Profile update data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'newemail@example.com' },
        username: { type: 'string', example: 'new_username' },
        nip: { type: 'string', example: '987654321' },
        namaLengkap: { type: 'string', example: 'John Smith' },
        jabatan: { type: 'string', example: 'Senior Account Officer' },
        cabang: { type: 'string', example: 'Bandung' },
        noTelepon: { type: 'string', example: '081298765432' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'newemail@example.com',
        username: 'new_username',
        role: 'USER',
        nip: '987654321',
        namaLengkap: 'John Smith',
        jabatan: 'Senior Account Officer',
        cabang: 'Bandung',
        noTelepon: '081298765432',
        updatedAt: '2024-01-13T16:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() data: any) {
    const updated = await this.userRepository.update(userId, data);
    const { passwordHash, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  @Patch('password')
  @ApiOperation({
    summary: 'Change password',
    description:
      'Change password for the currently authenticated user. Requires current password for verification.',
  })
  @ApiBody({
    description: 'Password change request',
    schema: {
      type: 'object',
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: {
          type: 'string',
          example: 'OldPassword123!',
          description: 'Current password for verification',
        },
        newPassword: {
          type: 'string',
          example: 'NewPassword456!',
          description: 'New password (min 8 characters)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      example: {
        message: 'Password changed successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid password format' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({
    summary: "Get user's laporan history",
    description: 'Get all laporan submitted by the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan history retrieved successfully',
    schema: {
      example: {
        laporan: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            jenisLaporan: 'Kunjungan Nasabah',
            kategori: 'TNI',
            instansi: 'PT. ABC Company',
            deskripsi: 'Kunjungan ke instansi untuk sosialisasi produk BRI',
            total: 150,
            fotoFilename: 'laporan_20240113_123456.jpg',
            status: 'approved',
            remark: 'Laporan lengkap dan valid',
            createdAt: '2024-01-13T07:00:00.000Z',
            updatedAt: '2024-01-13T08:30:00.000Z',
          },
        ],
        total: 10,
        page: 1,
        totalPages: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserLaporan(@CurrentUser('id') userId: string) {
    return await this.laporanRepository.findByUserId(userId, 1, 100);
  }
}
