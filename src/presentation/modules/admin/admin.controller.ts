import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ManageUsersUseCase } from '@application/use-cases/admin/manage-users.use-case';
import { UpdateUserDto } from '@application/dtos/admin.dto';

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
            divisi: 'Unsecured Loan',
            noHp: '081234567890',
            cabang: 'Malang Kawi',
            isActive: true,
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires admin role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
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
        username: { type: 'string', example: 'new_username' },
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN', 'SUPERVISOR'],
          example: 'ADMIN',
          description:
            'User role: USER (regular user), ADMIN (branch admin), SUPERVISOR (can see all data)',
        },
        nip: { type: 'string', example: '987654321' },
        divisi: {
          type: 'string',
          enum: ['Unsecured Loan'],
          example: 'Unsecured Loan',
          description: 'Division: Unsecured Loan (only available division)',
        },
        noHp: { type: 'string', example: '081298765432' },
        cabang: {
          type: 'string',
          example: 'Malang Kawi',
          enum: [
            'Malang Kawi',
            'Madiun',
            'Kediri',
            'Malang Martadinata',
            'Lumajang',
            'Magetan',
            'Nganjuk',
            'Blitar',
            'Banyuwangi',
            'Bondowoso',
            'Jember',
            'Pasuruan',
            'Probolinggo',
            'Ngawi',
            'Ponorogo',
            'Tulungagung',
            'Situbondo',
            'Pacitan',
            'Trenggalek',
            'KCP Universitas Jember',
            'Pare',
            'Kepanjen',
            'Batu',
            'KCP Caruban',
            'KCP Universitas Brawijaya',
          ],
          description: 'Branch location (cabang) - select from available branches',
        },
        isActive: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'user@example.com',
        username: 'new_username',
        role: 'ADMIN',
        nip: '987654321',
        divisi: 'Unsecured Loan',
        noHp: '081298765432',
        cabang: 'Surabaya',
        isActive: true,
        updatedAt: '2024-01-13T16:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be a valid email address'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires admin role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires admin role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  async deleteUser(@Param('id') id: string) {
    await this.manageUsersUseCase.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
