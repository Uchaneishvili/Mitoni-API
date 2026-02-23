# Aesthetic Center Reservation System — API

A robust, enterprise-ready MVP backend for an Aesthetic/Beauty Center Reservation System. This API handles managing staff (specialists), services, and time-based scheduling with built-in conflict prevention logic.

Built as part of a Full-Stack Developer evaluation, this service implements deep validation, relational integrity, and modern backend architecture without exceeding the core requirements (no authentication, no payments, no customer management).

## 🚀 Key Features

- **Staff & Services Management**: Complete CRUD operations for specialists and beauty services.
- **Smart Scheduling**:
  - Dynamic `endTime` calculation based on service duration.
  - Active double-booking and time-slot conflict prevention.
  - Cross-reference mapping checks (ensuring staff can actually perform the booked service).
  - Validation against inactive / soft-deleted resources.
- **Generic Querying Engine**: Built-in, fully standardized support for pagination (`page`, `limit`), sorting (`sort=price:desc`), and full-text searching (`search=massage`).
- **Enterprise Architecture**:
  - Predictable `{ success, data, meta }` response envelopes mapping `HttpResponse` patterns.
  - Granular Error Handling (`AppError`) with Joi validation interception.
  - Layered structure (Routes → Controllers → Services → Prisma).
  - Production-ready infrastructural configurations (Winston Loggers, Graceful Shutdown, Rate Limiting, CORS, Helmet).

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Joi
- **Documentation**: Swagger UI

---

## ⚙️ Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL running locally or via Docker

### 1. Clone & Install
```bash
git clone https://github.com/Uchaneishvili/Mitoni-API
cd mitoni-api
npm install
```

### 2. Environment Configuration
Copy the sample environment file and adjust your variables:
```bash
cp .env.example .env
```

**Key Environment Variables to Configure:**
- `DATABASE_URL`: Your PostgreSQL connection string.
- `PORT` & `API_PREFIX`: The port (default 8000) and base path route (e.g., `/api`).
- `CORS_ORIGIN`: Specify allowed origins (e.g., `http://localhost:5173`).
- `RATE_LIMIT_*`: Modify global rate limits.
- `LOG_LEVEL`: Choose Winston severity level (`info`, `debug`, `error`, etc.).

### 3. Database Setup
Push the schema to your local PostgreSQL instance and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 4. Start the Application
**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

---

## 📚 API Documentation

Once the server is running, the interactive Swagger documentation is available at:  
`http://localhost:8000/api-docs`

This interface allows you to view payload structures, test all `GET/POST/PUT/DELETE` endpoints, and simulate the exact requests the frontend will make.

> **Testing Note:** To test a Reservation `POST` via Swagger, first execute a `GET /services` and `GET /staff` to copy valid, active UUIDs to paste into the Reservation payload. Fake/dummy UUIDs will be safely rejected by the relational integrity middleware.
