import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url:
    process.env.DATABASE_URL || 'postgresql://laporan_user:laporan_pass@localhost:5432/laporan_db',
  ssl: process.env.DATABASE_SSL === 'true',
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
}));
