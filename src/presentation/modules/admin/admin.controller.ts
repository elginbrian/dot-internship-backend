import { Controller, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get all users (paginated)' })
  async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return await this.manageUsersUseCase.getAll(page, limit);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return await this.manageUsersUseCase.updateUser(id, data);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string) {
    await this.manageUsersUseCase.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
