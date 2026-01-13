import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ManageUsersUseCase } from '@application/use-cases/admin/manage-users.use-case';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly manageUsersUseCase: ManageUsersUseCase) {}

  @Get('users')
  @ApiOperation({
    summary: 'Get all users (paginated)',
    description:
      'Get paginated list of all users in the system. Only accessible by admin role. Returns user details with pagination metadata.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      example: {
        users: [
          {
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
        ],
        total: 50,
        page: 1,
        totalPages: 5,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return await this.manageUsersUseCase.getAll(page, limit);
  }

  @Patch('users/:id')
  @ApiOperation({
    summary: 'Update user',
    description:
      'Update user information. Only accessible by admin role. Can update any user field including role.',
  })
  @ApiBody({
    description: 'User update data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'newemail@example.com' },
        username: { type: 'string', example: 'new_username' },
        role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPERVISOR'], example: 'ADMIN' },
        nip: { type: 'string', example: '987654321' },
        namaLengkap: { type: 'string', example: 'Jane Smith' },
        jabatan: { type: 'string', example: 'Branch Manager' },
        cabang: { type: 'string', example: 'Surabaya' },
        noTelepon: { type: 'string', example: '081298765432' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'newemail@example.com',
        username: 'new_username',
        role: 'ADMIN',
        nip: '987654321',
        namaLengkap: 'Jane Smith',
        jabatan: 'Branch Manager',
        cabang: 'Surabaya',
        noTelepon: '081298765432',
        updatedAt: '2024-01-13T16:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return await this.manageUsersUseCase.updateUser(id, data);
  }

  @Delete('users/:id')
  @ApiOperation({
    summary: 'Delete user',
    description:
      'Delete user from the system. Only accessible by admin role. This will also delete all laporan associated with the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully',
        id: '550e8400-e29b-41d4-a716-446655440001',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    await this.manageUsersUseCase.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
