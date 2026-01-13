import { Controller, Post, Body, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RegisterDto, LoginDto, AuthResponseDto } from '@application/dtos/auth.dto';
import { UserRole, Cabang, Divisi } from '@domain/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Register a new user account with email, password, and profile information. New users are assigned USER role by default.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@gmail.com' },
        password: { type: 'string', minLength: 8, example: 'SecurePass123!' },
        username: { type: 'string', example: 'John Doe' },
        nip: { type: 'string', example: '12345678' },
        divisi: {
          type: 'string',
          enum: ['Unsecured Loan'],
          example: 'Unsecured Loan',
          description: 'Division: Unsecured Loan (only available division)',
        },
        noHp: { type: 'string', example: '081234567890' },
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
      },
      required: ['email', 'password', 'username', 'nip', 'divisi', 'noHp', 'cabang'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User registered successfully',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@gmail.com',
          username: 'John Doe',
          role: 'USER',
          nip: '12345678',
          divisi: 'Unsecured Loan',
          noHp: '081234567890',
          cabang: 'Malang Kawi',
          isActive: true,
          createdAt: '2024-01-13T07:00:00.000Z',
          updatedAt: '2024-01-13T07:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email already exists',
        error: 'Bad Request',
      },
    },
  })
  async register(@Body() dto: RegisterDto): Promise<any> {
    const user = await this.registerUseCase.execute({
      ...dto,
      divisi: dto.divisi as Divisi,
      cabang: dto.cabang as Cabang,
      password: dto.password,
      role: UserRole.USER,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password. Returns access token, refresh token, and user information.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAYnJpLmNvLmlkIiwic3ViIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6IlVTRVIifQ.abc123',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAYnJpLmNvLmlkIiwic3ViIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6IlVTRVIifQ.xyz789',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@gmail.com',
          username: 'John Doe',
          role: 'USER',
          nip: '12345678',
          divisi: 'Unsecured Loan',
          noHp: '081234567890',
          cabang: 'Malang Kawi',
          isActive: true,
          createdAt: '2024-01-13T07:00:00.000Z',
          updatedAt: '2024-01-13T07:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.loginUseCase.execute(dto.email, dto.password);

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        id: userWithoutPassword.id!,
        createdAt: userWithoutPassword.createdAt!,
        updatedAt: userWithoutPassword.updatedAt!,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate a new access token using a valid refresh token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Valid refresh token from login response',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAYnJpLmNvLmlkIiwic3ViIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6IlVTRVIifQ.newToken123',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { email: payload.email, sub: payload.sub, role: payload.role };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
