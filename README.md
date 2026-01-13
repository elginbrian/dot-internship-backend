# Sistem Management Laporan Bank

Backend API untuk sistem pelaporan kunjungan nasabah Bank menggunakan NestJS TypeScript dengan Clean Architecture.

## 📋 Features

- ✅ JWT Authentication (Email/Password)
- ✅ CRUD Laporan (Visit Reports) with Photo Upload
- ✅ Role-Based Access Control (USER, ADMIN, SUPERVISOR)
- ✅ Dashboard Statistics & Leaderboard
- ✅ Admin User Management
- ✅ Clean Architecture (4 Layers)
- ✅ PostgreSQL + TypeORM
- ✅ Docker & Docker Compose
- ✅ E2E Testing
- ✅ Swagger API Documentation

## 🏗️ Architecture

```
src/
├── domain/              # Business Rules
├── application/         # Use Cases & DTOs
├── infrastructure/      # Database & External Services
└── presentation/        # Controllers & API
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x LTS
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Installation

```bash
git clone <repository-url>
cd dot-internship-backend
npm install
cp .env.example .env
```

### Run with Docker

```bash
docker-compose up -d
npm run migration:run
```

### Run Locally

```bash
npm run start:dev
```

### Access

- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- pgAdmin: http://localhost:5050

## 📚 API Endpoints

### Authentication (3 endpoints)
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Laporan (7 endpoints)
- `POST /api/v1/laporan` - Create laporan
- `GET /api/v1/laporan` - Get list
- `GET /api/v1/laporan/:id` - Get detail
- `PATCH /api/v1/laporan/:id` - Update
- `DELETE /api/v1/laporan/:id` - Delete
- `POST /api/v1/laporan/:id/validate` - Validate (Admin)
- `GET /api/v1/laporan/:id/photo` - Get photo

### Dashboard (2 endpoints)
- `GET /api/v1/dashboard/stats` - Statistics
- `GET /api/v1/dashboard/leaderboard` - Leaderboard

### Admin (3 endpoints)
- `GET /api/v1/admin/users` - Get users
- `PATCH /api/v1/admin/users/:id` - Update user
- `DELETE /api/v1/admin/users/:id` - Delete user

### Profile (4 endpoints)
- `GET /api/v1/profile` - Get profile
- `PATCH /api/v1/profile` - Update profile
- `PATCH /api/v1/profile/password` - Change password
- `GET /api/v1/profile/laporan` - Get user's laporan

### Health (2 endpoints)
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/db` - Database check

## 🧪 Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## 📦 Tech Stack

- NestJS 10.x
- TypeScript 5.x
- PostgreSQL 16
- TypeORM 0.3.x
- JWT Authentication
- Multer (File Upload)
- Sharp (Image Processing)
- Jest (Testing)
- Swagger/OpenAPI

## 🗂️ Database Schema

### Users
- id, email, username, password_hash, role, nip, divisi, no_hp, cabang, is_active

### Laporan
- id, user_id, jenis_laporan, kategori, instansi, deskripsi, total, foto_filename, latitude, longitude, timestamp_foto, status, remark

## 🔐 Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

## 📝 Environment Variables

See `.env.example` for required variables.

## 📄 License

MIT

## 👤 Developer

Elgin Brian - Internship Challenge Project
