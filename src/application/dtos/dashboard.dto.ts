import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty()
  totalLaporan: number;

  @ApiProperty()
  pendingLaporan: number;

  @ApiProperty()
  approvedLaporan: number;

  @ApiProperty()
  rejectedLaporan: number;
}

export class LeaderboardItemDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ example: '12345678' })
  nip: string;

  @ApiProperty({
    example: 'Unsecured Loan',
    enum: ['Unsecured Loan'],
    description: 'Division: Unsecured Loan',
  })
  divisi: string;

  @ApiProperty({ example: 'Malang Kawi' })
  cabang: string;

  @ApiProperty()
  count: number;
}
