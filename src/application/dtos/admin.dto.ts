import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, Cabang, Divisi } from '@domain/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'john_doe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
    description: 'User role: USER, ADMIN, or SUPERVISOR',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
