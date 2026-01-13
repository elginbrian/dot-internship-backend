import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './infrastructure/config/app.config';
import databaseConfig from './infrastructure/config/database.config';
import jwtConfig from './infrastructure/config/jwt.config';
import storageConfig from './infrastructure/config/storage.config';
import { AuthModule } from './presentation/modules/auth/auth.module';
import { LaporanModule } from './presentation/modules/laporan/laporan.module';
import { DashboardModule } from './presentation/modules/dashboard/dashboard.module';
import { AdminModule } from './presentation/modules/admin/admin.module';
import { ProfileModule } from './presentation/modules/profile/profile.module';
import { HealthModule } from './presentation/modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, storageConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get<string>('app.nodeEnv') === 'development',
        ssl: configService.get<boolean>('database.ssl') ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LaporanModule,
    DashboardModule,
    AdminModule,
    ProfileModule,
    HealthModule,
  ],
})
export class AppModule {}
