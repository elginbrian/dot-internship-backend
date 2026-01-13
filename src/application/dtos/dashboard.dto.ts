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

  @ApiProperty()
  nip: string;

  @ApiProperty()
  divisi: string;

  @ApiProperty()
  cabang: string;

  @ApiProperty()
  count: number;
}
