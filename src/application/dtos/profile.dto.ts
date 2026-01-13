import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Cabang, Divisi } from '@domain/entities/user.entity';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'john_doe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  nip?: string;

  @ApiPropertyOptional({
    enum: Divisi,
    example: Divisi.UNSECURED_LOAN,
    description: 'Division: Unsecured Loan',
  })
  @IsOptional()
  @IsEnum(Divisi)
  divisi?: Divisi;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  noHp?: string;

  @ApiPropertyOptional({
    enum: Cabang,
    example: Cabang.MALANG_KAWI,
    description: 'Branch name from 26 available branches',
  })
  @IsOptional()
  @IsEnum(Cabang)
  cabang?: Cabang;
}

export class ChangePasswordDto {
  @ApiPropertyOptional({ example: 'OldPass123!' })
  @IsString()
  oldPassword: string;

  @ApiPropertyOptional({ example: 'NewPass123!' })
  @IsString()
  newPassword: string;
}
