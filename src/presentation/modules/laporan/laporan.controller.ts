import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateLaporanUseCase } from '@application/use-cases/laporan/create-laporan.use-case';
import { UpdateLaporanUseCase } from '@application/use-cases/laporan/update-laporan.use-case';
import { ValidateLaporanUseCase } from '@application/use-cases/laporan/validate-laporan.use-case';
import { GetLaporanListUseCase } from '@application/use-cases/laporan/get-laporan-list.use-case';
import {
  CreateLaporanDto,
  UpdateLaporanDto,
  ValidateLaporanDto,
  LaporanFilterDto,
} from '@application/dtos/laporan.dto';
import { JenisLaporan, KategoriKunjungan, LaporanStatus } from '@domain/entities/laporan.entity';
import { FileStorageService } from '@infrastructure/storage/file-storage.service';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import { CurrentUserPayload } from '../auth/guards/jwt.types';

@ApiTags('Laporan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('laporan')
export class LaporanController {
  constructor(
    private readonly createLaporanUseCase: CreateLaporanUseCase,
    private readonly updateLaporanUseCase: UpdateLaporanUseCase,
    private readonly validateLaporanUseCase: ValidateLaporanUseCase,
    private readonly getLaporanListUseCase: GetLaporanListUseCase,
    private readonly fileStorageService: FileStorageService,
    @Inject('ILaporanRepository') private readonly laporanRepository: ILaporanRepository,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new laporan',
    description:
      'Create a new laporan report with optional photo upload. Photo will be compressed and saved automatically.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jenisLaporan: {
          type: 'string',
          enum: ['Kunjungan Nasabah', 'Share Broadcast'],
          example: 'Kunjungan Nasabah',
          description:
            'Type of report: Kunjungan Nasabah (customer visit) or Share Broadcast (broadcast sharing)',
        },
        kategori: {
          type: 'string',
          enum: ['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'],
          example: 'TNI',
          description:
            'Category: TNI (military), ASN (civil servant), POLRI (police), BUMN (state-owned enterprise), Pensiunan (retiree), Prapurna (pre-retirement), Lainnya (other)',
        },
        instansi: { type: 'string', example: 'PT. ABC Company' },
        deskripsi: {
          type: 'string',
          example: 'Kunjungan ke instansi untuk sosialisasi produk',
        },
        total: { type: 'number', example: 150 },
        latitude: { type: 'number', example: -6.2088 },
        longitude: { type: 'number', example: 106.8456 },
        foto: { type: 'string', format: 'binary' },
      },
      required: ['jenisLaporan', 'kategori', 'instansi', 'deskripsi', 'total'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Laporan created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        jenisLaporan: 'Kunjungan Nasabah',
        kategori: 'TNI',
        instansi: 'PT. ABC Company',
        deskripsi: 'Kunjungan ke instansi untuk sosialisasi produk BRI',
        total: 150,
        fotoFilename: 'laporan_20240113_123456.jpg',
        latitude: -6.2088,
        longitude: 106.8456,
        timestampFoto: '2024-01-13T12:34:56.000Z',
        status: 'pending',
        remark: null,
        createdAt: '2024-01-13T07:00:00.000Z',
        updatedAt: '2024-01-13T07:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['jenisLaporan must be one of: Kunjungan Nasabah, Share Broadcast'],
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
  @UseInterceptors(FileInterceptor('foto'))
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLaporanDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let fotoFilename: string | undefined;

    if (file) {
      fotoFilename = await this.fileStorageService.saveFile(file);
    }

    const laporan = await this.createLaporanUseCase.execute({
      userId,
      jenisLaporan: dto.jenisLaporan as JenisLaporan,
      kategori: dto.kategori as KategoriKunjungan,
      instansi: dto.instansi,
      deskripsi: dto.deskripsi,
      total: dto.total,
      fotoFilename,
      latitude: dto.latitude,
      longitude: dto.longitude,
      timestampFoto: file ? new Date() : undefined,
    });

    return laporan;
  }

  @Get()
  @ApiOperation({
    summary: 'Get laporan list',
    description:
      'Get paginated list of laporan with optional filters. Regular users see only their own laporan, admins see all from their cabang, supervisors see all.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of laporan retrieved successfully',
    schema: {
      example: {
        laporan: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            userId: '550e8400-e29b-41d4-a716-446655440001',
            jenisLaporan: 'Kunjungan Nasabah',
            kategori: 'TNI',
            instansi: 'PT. ABC Company',
            deskripsi: 'Kunjungan ke instansi untuk sosialisasi produk',
            total: 150,
            fotoFilename: 'laporan_20240113_123456.jpg',
            status: 'pending',
            createdAt: '2024-01-13T07:00:00.000Z',
            updatedAt: '2024-01-13T07:00:00.000Z',
          },
        ],
        total: 25,
        page: 1,
        totalPages: 3,
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
  async getAll(@Query() filters: LaporanFilterDto, @CurrentUser() user: CurrentUserPayload) {
    if (user.role === 'SUPERVISOR') {
      // Supervisor can see all
    } else if (user.role === 'ADMIN') {
      // Admin can only see from their cabang
      // TODO: Need to fetch user's cabang from user entity
      filters.userId = filters.userId;
    } else {
      // Regular user can only see their own
      filters.userId = user.id;
    }

    return await this.getLaporanListUseCase.execute(
      {
        ...filters,
        status: filters.status as LaporanStatus | undefined,
      },
      filters.page || 1,
      filters.limit || 10,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get laporan by ID',
    description:
      'Get detailed information of a specific laporan by ID. Users can only access their own laporan unless they are admin/supervisor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan retrieved successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        jenisLaporan: 'Kunjungan Nasabah',
        kategori: 'TNI',
        instansi: 'PT. ABC Company',
        deskripsi: 'Kunjungan ke instansi untuk sosialisasi produk BRI',
        total: 150,
        fotoFilename: 'laporan_20240113_123456.jpg',
        latitude: -6.2088,
        longitude: 106.8456,
        timestampFoto: '2024-01-13T07:00:00.000Z',
        status: 'approved',
        remark: 'Laporan lengkap dan valid',
        createdAt: '2024-01-13T07:00:00.000Z',
        updatedAt: '2024-01-13T08:30:00.000Z',
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
    description: "Forbidden - Cannot access other user's laporan",
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
    description: 'Laporan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Laporan not found',
        error: 'Not Found',
      },
    },
  })
  async getById(@Param('id') id: string) {
    const laporan = await this.laporanRepository.findById(id);
    if (!laporan) {
      throw new Error('Laporan not found');
    }
    return laporan;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update laporan',
    description:
      'Update existing laporan. Users can only update their own laporan. Admin and supervisor can update any laporan.',
  })
  @ApiBody({
    description: 'Update laporan data',
    schema: {
      type: 'object',
      properties: {
        jenisLaporan: {
          type: 'string',
          enum: ['Kunjungan Nasabah', 'Kunjungan Non Nasabah'],
          example: 'Kunjungan Nasabah',
          description:
            'Type of report: Kunjungan Nasabah (customer visit) or Kunjungan Non Nasabah (non-customer visit)',
        },
        kategori: {
          type: 'string',
          enum: ['TNI', 'POLRI', 'PNS', 'ASN', 'Pensiunan', 'Swasta', 'Prapurna'],
          example: 'PNS',
          description:
            'Category: TNI (military), POLRI (police), PNS (civil servant), ASN (state apparatus), Pensiunan (retiree), Swasta (private), Prapurna (pre-retirement)',
        },
        instansi: { type: 'string', example: 'Dinas Pendidikan Kota Jakarta' },
        deskripsi: { type: 'string', example: 'Follow up kunjungan sebelumnya' },
        total: { type: 'number', example: 200 },
        latitude: { type: 'number', example: -6.2088 },
        longitude: { type: 'number', example: 106.8456 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan updated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        jenisLaporan: 'Kunjungan Nasabah',
        kategori: 'PNS',
        instansi: 'Dinas Pendidikan Kota Jakarta',
        deskripsi: 'Follow up kunjungan sebelumnya',
        total: 200,
        status: 'pending',
        updatedAt: '2024-01-13T14:05:30.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['total must be a positive number'],
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
    description: "Forbidden - Cannot update other user's laporan",
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
    description: 'Laporan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Laporan not found',
        error: 'Not Found',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLaporanDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const laporan = await this.laporanRepository.findById(id);
    if (!laporan) {
      throw new Error('Laporan not found');
    }

    if (user.role === 'USER' && laporan.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    const updateData = {
      ...dto,
      jenisLaporan: dto.jenisLaporan ? (dto.jenisLaporan as JenisLaporan) : undefined,
      kategori: dto.kategori ? (dto.kategori as KategoriKunjungan) : undefined,
    };

    return await this.updateLaporanUseCase.execute(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete laporan',
    description:
      'Delete laporan by ID. Users can only delete their own laporan. Admin and supervisor can delete any laporan.',
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan deleted successfully',
    schema: {
      example: {
        message: 'Laporan deleted successfully',
        id: '550e8400-e29b-41d4-a716-446655440000',
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
    description: "Forbidden - Cannot delete other user's laporan",
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
    description: 'Laporan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Laporan not found',
        error: 'Not Found',
      },
    },
  })
  async delete(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    const laporan = await this.laporanRepository.findById(id);
    if (!laporan) {
      throw new Error('Laporan not found');
    }

    if (user.role === 'USER' && laporan.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    if (laporan.fotoFilename) {
      await this.fileStorageService.deleteFile(laporan.fotoFilename);
    }

    await this.laporanRepository.delete(id);
    return { message: 'Laporan deleted successfully' };
  }

  @Post(':id/validate')
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({
    summary: 'Validate laporan (Admin/Supervisor only)',
    description:
      'Approve or reject laporan submission. Only accessible by admin and supervisor roles. Sets status and optional remark.',
  })
  @ApiBody({
    description: 'Validation decision with optional remark',
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: ['approved', 'rejected'],
          example: 'approved',
          description:
            'Validation status: approved (laporan is valid and accepted) or rejected (laporan is invalid or declined)',
        },
        remark: {
          type: 'string',
          example: 'Data valid dan lengkap, disetujui',
          description: 'Optional remark or feedback for the validation decision',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Laporan validated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'approved',
        remark: 'Data valid dan lengkap, disetujui',
        updatedAt: '2024-01-13T15:20:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value',
    schema: {
      example: {
        statusCode: 400,
        message: ['status must be one of: approved, rejected'],
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
    description: 'Forbidden - Requires admin or supervisor role',
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
    description: 'Laporan not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Laporan not found',
        error: 'Not Found',
      },
    },
  })
  async validate(@Param('id') id: string, @Body() dto: ValidateLaporanDto) {
    return await this.validateLaporanUseCase.execute(id, dto.status as LaporanStatus, dto.remark);
  }

  @Get(':id/photo')
  @ApiOperation({
    summary: 'Get laporan photo file',
    description:
      'Download the photo file associated with a laporan. Returns the actual image file.',
  })
  @ApiResponse({
    status: 200,
    description: 'Photo file retrieved successfully',
    content: {
      'image/jpeg': {},
      'image/png': {},
      'image/jpg': {},
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Photo not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Photo not found',
        error: 'Not Found',
      },
    },
  })
  async getPhoto(@Param('id') id: string, @Res() res: Response) {
    const laporan = await this.laporanRepository.findById(id);
    if (!laporan || !laporan.fotoFilename) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Photo not found' });
    }

    const filePath = this.fileStorageService.getFilePath(laporan.fotoFilename);
    const exists = await this.fileStorageService.fileExists(laporan.fotoFilename);

    if (!exists) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Photo file not found' });
    }

    return res.sendFile(filePath, { root: '.' });
  }
}
