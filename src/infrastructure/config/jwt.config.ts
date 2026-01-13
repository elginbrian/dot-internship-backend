import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dev-secret-key',
  expiration: process.env.JWT_EXPIRATION || '30m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
