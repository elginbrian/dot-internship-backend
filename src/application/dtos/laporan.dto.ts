import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLaporanDto {
  @ApiProperty({ enum: ['Kunjungan Nasabah', 'Share Broadcast'] })
  @IsEnum(['Kunjungan Nasabah', 'Share Broadcast'])
  @IsNotEmpty()
  jenisLaporan: string;

  @ApiProperty({ enum: ['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'] })
  @IsEnum(['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'])
  @IsNotEmpty()
  kategori: string;

  @ApiProperty({ example: 'PT. ABC Company' })
  @IsString()
  @IsNotEmpty()
  instansi: string;

  @ApiProperty({ example: 'Kunjungan ke instansi untuk sosialisasi produk BRI' })
  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  total: number;

  @ApiPropertyOptional({ example: -6.2088 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ example: 106.8456 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;
}

export class UpdateLaporanDto {
  @ApiPropertyOptional({ enum: ['Kunjungan Nasabah', 'Share Broadcast'] })
  @IsOptional()
  @IsEnum(['Kunjungan Nasabah', 'Share Broadcast'])
  jenisLaporan?: string;

  @ApiPropertyOptional({
    enum: ['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'],
  })
  @IsOptional()
  @IsEnum(['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'])
  kategori?: string;

  @ApiPropertyOptional({ example: 'PT. ABC Company' })
  @IsOptional()
  @IsString()
  instansi?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total?: number;
}

export class ValidateLaporanDto {
  @ApiProperty({ enum: ['approved', 'rejected'] })
  @IsEnum(['approved', 'rejected'])
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 'Laporan disetujui' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class LaporanResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId: string;

  @ApiProperty({ example: 'Kunjungan Nasabah' })
  jenisLaporan: string;

  @ApiProperty({ example: 'TNI' })
  kategori: string;

  @ApiProperty({ example: 'PT. ABC Company' })
  instansi: string;

  @ApiProperty({ example: 'Kunjungan ke instansi untuk sosialisasi produk BRI' })
  deskripsi: string;

  @ApiProperty({ example: 150 })
  total: number;

  @ApiPropertyOptional({ example: 'laporan_20240113_123456.jpg' })
  fotoFilename?: string;

  @ApiPropertyOptional({ example: -6.2088 })
  latitude?: number;

  @ApiPropertyOptional({ example: 106.8456 })
  longitude?: number;

  @ApiPropertyOptional({ example: '2024-01-13T12:34:56.000Z' })
  timestampFoto?: Date;

  @ApiProperty({ example: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @ApiPropertyOptional({ example: 'Laporan sudah disetujui' })
  remark?: string;

  @ApiProperty({ example: '2024-01-13T07:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-13T07:00:00.000Z' })
  updatedAt: Date;
}

export class LaporanFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cabang?: string;

  @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected'] })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({ enum: ['Kunjungan Nasabah', 'Share Broadcast'] })
  @IsOptional()
  @IsEnum(['Kunjungan Nasabah', 'Share Broadcast'])
  jenisLaporan?: string;

  @ApiPropertyOptional({
    enum: ['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'],
  })
  @IsOptional()
  @IsEnum(['TNI', 'ASN', 'POLRI', 'BUMN', 'Pensiunan', 'Prapurna', 'Lainnya'])
  kategori?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
