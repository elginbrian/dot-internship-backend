# Bank Report Management System

Backend API for bank customer visit reporting system built with NestJS TypeScript using Clean Architecture.

## 📋 Features

- ✅ JWT Authentication (Email/Password)
- ✅ CRUD Reports (Visit Reports) with Photo Upload
- ✅ Role-Based Access Control (USER, ADMIN, SUPERVISOR)
- ✅ Dashboard Statistics & Leaderboard
- ✅ Admin User Management
- ✅ Clean Architecture (4 Layers)
- ✅ PostgreSQL + TypeORM
- ✅ Docker & Docker Compose
- ✅ E2E Testing
- ✅ Swagger API Documentation

## 🏗️ Architecture

This project implements **Clean Architecture** (also known as Hexagonal Architecture or Onion Architecture) with 4 distinct layers:

```
src/
├── domain/              # Business Rules & Entities
├── application/         # Use Cases & DTOs
├── infrastructure/      # Database & External Services
└── presentation/        # Controllers & API
```

### Why Clean Architecture?

**1. Separation of Concerns**

- Each layer has a single, well-defined responsibility
- Business logic is isolated from technical implementation details
- Makes the codebase easier to understand and maintain

**2. Independence from Frameworks**

- Business rules don't depend on NestJS, TypeORM, or any external library
- Framework is just a delivery mechanism, not the core of the application
- Easy to migrate to different frameworks if needed

**3. Testability**

- Business logic can be tested without database, web server, or external dependencies
- Use cases can be tested in isolation using mock repositories
- Clear boundaries make unit testing straightforward

**4. Maintainability & Scalability**

- Changes in UI/API don't affect business logic
- Database changes are isolated in infrastructure layer
- New features can be added without breaking existing code

**5. Team Collaboration**

- Clear structure makes it easy for team members to know where to add new code
- Reduces merge conflicts as different layers can be worked on independently
- Enforces consistent coding patterns across the project

**6. Flexibility**

- Easy to swap database (PostgreSQL → MongoDB)
- Easy to add new interfaces (REST API → GraphQL → gRPC)
- Easy to change external services without touching business logic

### Layer Dependencies

```
Presentation → Application → Domain
Infrastructure → Application → Domain
```

- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Orchestrates domain objects, defines use cases
- **Infrastructure Layer**: Implements technical details (database, file storage)
- **Presentation Layer**: Handles HTTP requests/responses, authentication

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

### Reports (7 endpoints)

- `POST /api/v1/laporan` - Create report
- `GET /api/v1/laporan` - Get report list
- `GET /api/v1/laporan/:id` - Get report detail
- `PATCH /api/v1/laporan/:id` - Update report
- `DELETE /api/v1/laporan/:id` - Delete report
- `POST /api/v1/laporan/:id/validate` - Validate report (Admin only)
- `GET /api/v1/laporan/:id/photo` - Get report photo

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
- `GET /api/v1/profile/laporan` - Get user's reports

### Health (2 endpoints)

- `GET /api/v1/health` - Health check
- `GET /api/v1/health/db` - Database check

## 🧪 Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## � Deployment

### Docker Deployment (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy:**

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### CI/CD with GitHub Actions

The project includes automated deployment to VPS. Configure GitHub Secrets:

**Required Secrets:**

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `VPS_HOST` - VPS IP address or domain
- `VPS_USERNAME` - SSH username
- `VPS_SSH_PRIVATE_KEY` - SSH private key
- `VPS_APP_PATH` - Application path on VPS
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `NODE_ENV` - Environment (production)
- `APP_PORT` - Application port (3000)
- `ENABLE_SWAGGER` - Enable/disable Swagger (false in production)
- `CORS_ORIGINS` - Allowed CORS origins

Push to `main` or `master` branch to trigger automatic deployment.

## �📦 Tech Stack

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

- id, email, username, password_hash, role, nip, division, phone_number, branch, is_active

### Reports

- id, user_id, report_type, category, institution, description, total, photo_filename, latitude, longitude, photo_timestamp, status, remark

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

Elgin Brian Wahyu Bramadhika
