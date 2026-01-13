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

  @ApiProperty({ example: 'IT Department' })
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
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  nip: string;

  @ApiProperty()
  divisi: string;

  @ApiProperty()
  noHp: string;

  @ApiProperty()
  cabang: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserResponseDto;
}
