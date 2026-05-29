# 🛒 ShopHub — E-Commerce Platform

**Lab Course 2 | UBT | 2025–2026**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Frontend | React 18 + Vite |
| SQL Database | MySQL |
| NoSQL Database | MongoDB |
| Real-Time | Socket.IO |
| Payments | Stripe |
| Auth | JWT (Access + Refresh Tokens) |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit |

## Features

- ✅ JWT Authentication with Refresh Tokens
- ✅ Role-Based Access Control (Admin, Manager, User)
- ✅ 29 Database Tables (10 mandatory + 19 domain)
- ✅ Real-Time Notifications (Socket.IO)
- ✅ Live Chat (Socket.IO)
- ✅ Advanced Search with Filters (Feature 1)
- ✅ Stripe Payment Integration (Feature 2)
- ✅ Data Export (CSV, Excel, JSON) (Feature 3)
- ✅ Audit Logs for all critical actions
- ✅ Swagger API Documentation
- ✅ Code Splitting & Lazy Loading

## Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- MongoDB >= 6.0
- Stripe account (for payments)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/shophub.git
cd shophub
```

### 2. Setup Database

```bash
mysql -u root -p < backend/database/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Running the Application

| Service | URL |
|---------|-----|
| Backend API | http://localhost:5000 |
| Frontend | http://localhost:5173 |
| API Docs (Swagger) | http://localhost:5000/api/docs |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/products | List products (with filters) |
| GET | /api/products/:id | Product detail |
| POST | /api/products | Create product (Admin) |
| GET | /api/cart | Get cart |
| POST | /api/cart | Add to cart |
| POST | /api/orders | Create order |
| GET | /api/orders/my | My orders |
| POST | /api/payments/intent | Create payment intent |
| GET | /api/export/products | Export products (CSV/Excel/JSON) |

Full documentation at: http://localhost:5000/api/docs

## Project Structure

```
shophub/
├── backend/
│   ├── database/
│   │   └── schema.sql         # All 29 tables
│   ├── src/
│   │   ├── config/            # DB + Swagger config
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Database layer
│   │   ├── middleware/        # Auth, validation, errors
│   │   ├── routes/            # API routes
│   │   ├── socket/            # Socket.IO handlers
│   │   └── models/            # Sequelize + Mongoose models
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages (lazy loaded)
│   │   ├── store/             # Redux store + slices
│   │   ├── services/          # API + Socket services
│   │   └── hooks/             # Custom hooks
│   └── vite.config.js
└── README.md
```

## Team

| Name | Role |
|------|------|
| Student 1 | Backend + Auth |
| Student 2 | Frontend + State |
| Student 3 | Database + API |
| Student 4 | Payments + Export |

## License

MIT
