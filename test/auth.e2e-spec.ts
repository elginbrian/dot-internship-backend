import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('/api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@bri.co.id',
        password: 'SecurePass123!',
        username: 'Test User',
        nip: '12345678',
        divisi: 'IT Department',
        noHp: '081234567890',
        cabang: 'JAKARTA_PUSAT',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(registerDto.email);
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should fail to register with duplicate email', async () => {
      const registerDto = {
        email: 'test@bri.co.id',
        password: 'SecurePass123!',
        username: 'Test User 2',
        nip: '87654321',
        divisi: 'HR Department',
        noHp: '081234567891',
        cabang: 'JAKARTA_BARAT',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail to register with invalid email', async () => {
      const registerDto = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        username: 'Test User 3',
        nip: '11111111',
        divisi: 'IT Department',
        noHp: '081234567892',
        cabang: 'JAKARTA_PUSAT',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully and receive JWT tokens', async () => {
      const loginDto = {
        email: 'test@bri.co.id',
        password: 'SecurePass123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginDto.email);
      expect(response.body.user).not.toHaveProperty('passwordHash');

      accessToken = response.body.accessToken;
    });

    it('should fail to login with incorrect password', async () => {
      const loginDto = {
        email: 'test@bri.co.id',
        password: 'WrongPassword123!',
      };

      await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginDto).expect(400);
    });

    it('should fail to login with non-existent email', async () => {
      const loginDto = {
        email: 'nonexistent@bri.co.id',
        password: 'SecurePass123!',
      };

      await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginDto).expect(400);
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data.email).toBe('test@bri.co.id');
    });

    it('should reject access without JWT token', async () => {
      await request(app.getHttpServer()).get('/api/v1/profile').expect(401);
    });

    it('should reject access with invalid JWT token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);
    });

    it('should reject access with malformed Authorization header', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token successfully', async () => {
      const loginResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
        email: 'test@bri.co.id',
        password: 'SecurePass123!',
      });

      const refreshToken = loginResponse.body.refreshToken;

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should fail to refresh with invalid token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' })
        .expect(500);
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return health status without authentication', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
  });
});
