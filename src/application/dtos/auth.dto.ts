import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@bri.co.id' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  nip: string;

  @ApiProperty({
    example: 'Unsecured Loan',
    enum: ['Unsecured Loan'],
    description: 'Division: Unsecured Loan (only available division)',
  })
  @IsString()
  @IsNotEmpty()
  divisi: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @IsNotEmpty()
  noHp: string;

  @ApiProperty({
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
  })
  @IsString()
  @IsNotEmpty()
  cabang: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@bri.co.id' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'user@gmail.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  username: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN', 'SUPERVISOR'] })
  role: string;

  @ApiProperty({ example: '12345678' })
  nip: string;

  @ApiProperty({
    example: 'Unsecured Loan',
    enum: ['Unsecured Loan'],
    description: 'Division: Unsecured Loan (only available division)',
  })
  divisi: string;

  @ApiProperty({ example: '081234567890' })
  noHp: string;

  @ApiProperty({ example: 'Malang Kawi' })
  cabang: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-13T07:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-13T07:00:00.000Z' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
