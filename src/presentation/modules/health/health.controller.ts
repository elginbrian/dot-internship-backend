import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Basic health check',
    description:
      'Check if the API service is up and running. Returns current status and timestamp.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-13T10:30:00.000Z',
      },
    },
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db')
  @HealthCheck()
  @ApiOperation({
    summary: 'Database health check',
    description:
      'Check database connectivity and health status. Returns detailed health information including database ping status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Database is healthy',
    schema: {
      example: {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Database is unhealthy',
    schema: {
      example: {
        status: 'error',
        info: {},
        error: {
          database: {
            status: 'down',
            message: 'Connection failed',
          },
        },
        details: {
          database: {
            status: 'down',
            message: 'Connection failed',
          },
        },
      },
    },
  })
  checkDatabase() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
