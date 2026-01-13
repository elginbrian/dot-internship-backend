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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
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
import { FileStorageService } from '@infrastructure/storage/file-storage.service';
import { ILaporanRepository } from '@domain/repositories/laporan.repository.interface';
import * as fs from 'fs';

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
  @ApiOperation({ summary: 'Create new laporan with photo upload' })
  @ApiConsumes('multipart/form-data')
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
      jenisLaporan: dto.jenisLaporan as any,
      kategori: dto.kategori as any,
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
  @ApiOperation({ summary: 'Get laporan list with filters' })
  async getAll(@Query() filters: LaporanFilterDto, @CurrentUser() user: any) {
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
        status: filters.status as any,
      },
      filters.page || 1,
      filters.limit || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get laporan detail' })
  async getById(@Param('id') id: string) {
    const laporan = await this.laporanRepository.findById(id);
    if (!laporan) {
      throw new Error('Laporan not found');
    }
    return laporan;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update laporan' })
  async update(@Param('id') id: string, @Body() dto: UpdateLaporanDto, @CurrentUser() user: any) {
    const laporan = await this.laporanRepository.findById(id);
    if (!laporan) {
      throw new Error('Laporan not found');
    }

    if (user.role === 'USER' && laporan.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    return await this.updateLaporanUseCase.execute(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete laporan' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
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
  @ApiOperation({ summary: 'Validate laporan (Admin/Supervisor only)' })
  async validate(@Param('id') id: string, @Body() dto: ValidateLaporanDto) {
    return await this.validateLaporanUseCase.execute(id, dto.status as any, dto.remark);
  }

  @Get(':id/photo')
  @ApiOperation({ summary: 'Get laporan photo file' })
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
