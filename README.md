# Multi-Tenant Logistics Management System

[![Tests](https://github.com/your-org/logistica-multi-tenant/workflows/Run%20Tests/badge.svg)](https://github.com/your-org/logistica-multi-tenant/actions)
[![Lint & Format](https://github.com/your-org/logistica-multi-tenant/workflows/Lint%20%26%20Format/badge.svg)](https://github.com/your-org/logistica-multi-tenant/actions)
[![Build Docker Images](https://github.com/your-org/logistica-multi-tenant/workflows/Build%20Docker%20Images/badge.svg)](https://github.com/your-org/logistica-multi-tenant/actions)
[![codecov](https://codecov.io/gh/your-org/logistica-multi-tenant/branch/develop/graph/badge.svg)](https://codecov.io/gh/your-org/logistica-multi-tenant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-green)](#requirements)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](#)

> A complete logistics management platform built to serve multiple companies with full data isolation, real-time inventory control, and a robust state machine.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Product States](#product-states)
- [Permissions](#permissions)
- [Development Guide](#development-guide)
- [Roadmap](#roadmap)
- [Improvements Needed](#improvements-needed-to-reach-1010)
- [Contributing](#contributing)

---

## 🎯 About the Project

This platform manages the full lifecycle of warehouse products — from receipt to final delivery. The system is built with a **multi-tenant** architecture, ensuring each company operates in a fully isolated and secure environment.

### Screenshots

<details>
<summary>View screenshots</summary>

**Real-Time Metrics Dashboard**
- Inventory summary by state
- Distribution charts
- Top 5 suppliers

**Product List with Advanced Filters**
- Search by code, description, or supplier
- Filter by state, location, and date
- Sorting and pagination

**Supplier & Vehicle Management**
- Full CRUD
- Integration with products and transports

**Operations History**
- Complete audit trail
- Filters by action, entity, and user
- Full change log

</details>

---

## ✨ Features

### Authentication & Security
- Multi-tenant system with full data isolation
- Three roles: **Super Admin**, **Administrator**, and **Operator**
- JWT authentication with refresh tokens
- SQL injection protection via Prisma ORM

### Inventory Management
- **Full CRUD** for products
- State machine for lifecycle control
- Complete movement history
- Full traceability per product
- Advanced filters (state, location, supplier, date)

### Analytics Dashboard
- Inventory summary by state
- Distribution charts (donut and bar)
- Movement statistics (last 30 days)
- Top 5 suppliers
- Real-time performance metrics

### 🚚 Transport Management
- Fleet vehicle registration
- Transport creation and tracking
- Integration with products and states
- Statuses: In Transit, Delivered, Cancelled

### 👥 Supplier Management
- Full supplier CRUD
- Product linking
- Supply history

### 📜 Audit & History
- Automatic logging of all operations
- Filters by: date, action, entity, user
- Complete change tracking
- Immutable logs with timestamps

### 🔔 Notification System
- Alerts for products stuck in analysis
- Real-time notifications
- Notification history

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | 18+ | JavaScript runtime |
| **TypeScript** | ^5.0 | Typed JavaScript superset |
| **NestJS** | latest | Active backend framework |
| **Express.js** | ^4.18 | *(legacy — see note below)* |
| **Prisma** | ^5.0 | Modern ORM for Node.js |
| **PostgreSQL** | 15 | Relational database |
| **JWT** | — | Stateless authentication |
| **Zod** | ^3.22 | TypeScript schema validation |

> **Note:** The `backend` directory (Express) is **deprecated** and kept only for historical reference. All new features and fixes must be implemented in `backend-nest`. The `backend` directory can be removed once all relevant code is migrated.

### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| **React** | 18 | UI library |
| **TypeScript** | ^5.0 | Static typing |
| **React Router** | v6 | SPA routing |
| **Tailwind CSS** | ^3.4 | Utility-first CSS framework |
| **Recharts** | ^2.5 | Charts for React |
| **Axios** | ^1.6 | HTTP client |
| **React Hot Toast** | — | Toast notifications |

### DevOps
- **Docker** & **Docker Compose**
- **PostgreSQL 15** (containerised)
- **Kubernetes** (production-ready manifests in `k8s/`)

---

## 🏗️ Architecture

### Multi-Tenant Pattern

```
┌─────────────────────────────────────────┐
│          Frontend (React SPA)           │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│       Backend (NestJS + TypeScript)     │
│  ┌────────────────────────────────┐     │
│  │  Auth Middleware (JWT)         │     │
│  └────────────┬───────────────────┘     │
│  ┌────────────▼───────────────────┐     │
│  │  Multi-Tenant Middleware       │     │
│  │  (companyId isolation)         │     │
│  └────────────┬───────────────────┘     │
│  ┌────────────▼───────────────────┐     │
│  │  Controllers & Services        │     │
│  └────────────┬───────────────────┘     │
└───────────────┼─────────────────────────┘
                │ Prisma ORM
┌───────────────▼─────────────────────────┐
│         PostgreSQL Database             │
│  ┌──────────────────────────────────┐   │
│  │ Company 1 Data (isolated)        │   │
│  ├──────────────────────────────────┤   │
│  │ Company 2 Data (isolated)        │   │
│  ├──────────────────────────────────┤   │
│  │ Company N Data (isolated)        │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### State Machine

```mermaid
stateDiagram-v2
    [*] --> Received
    Received --> UnderReview
    UnderReview --> Approved
    UnderReview --> Rejected
    Rejected --> UnderReturn
    Approved --> InStorage
    InStorage --> InPreparation
    InStorage --> InShipment
    InPreparation --> InShipment
    InPreparation --> Cancelled
    InShipment --> Delivered
    UnderReturn --> Received
    UnderReturn --> Disposed
    Cancelled --> InStorage
    Delivered --> [*]
    Disposed --> [*]
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Docker** & **Docker Compose** (optional, but recommended)
- **PostgreSQL 15** (if not using Docker)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/logistica-multi-tenant.git
cd logistica-multi-tenant
```

2. **Install dependencies**

```bash
# Install all workspaces at once
npm install --workspaces

# Or individually
cd backend-nest && npm install
cd frontend && npm install
```

### Configuration

1. **Environment Variables**

Copy the example files and fill in the values:
```bash
cp backend-nest/.env.example backend-nest/.env
cp frontend/.env.example frontend/.env
```

Create `backend-nest/.env`:
```env
# Environment
NODE_ENV=development

# Server
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logistica

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-random-characters
JWT_EXPIRES_IN=7d

# CORS (optional)
CORS_ORIGIN=http://localhost:3000
```

2. **Database with Docker (Recommended)**

```bash
# Start PostgreSQL
docker-compose up -d

# Run migrations
cd backend-nest
npx prisma migrate dev
npx prisma generate
```

**Without Docker:**
```bash
createdb logistica
cd backend-nest
npx prisma migrate dev
npx prisma generate
```

3. **Seed the Database (Optional)**

```bash
cd backend-nest
npm run seed
```

This creates:
- 1 Super Admin
- 1 Example company
- 1 Administrator
- 1 Operator
- Some test products

### Running the Application

**Development mode:**

```bash
# Terminal 1 — Backend
cd backend-nest
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

**Production mode:**
```bash
# Backend
cd backend-nest
npm run build && npm start

# Frontend
cd frontend
npm run build
# Serve the build/ folder with nginx or similar
```

### Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (run `npx prisma studio`)

---

## 📁 Project Structure

```
logistica-multi-tenant/
├── backend/              # DEPRECATED — Express legacy (do not use for new features)
├── backend-nest/         # Active NestJS API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── server.ts
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── App.tsx
│       └── index.tsx
├── k8s/                  # Kubernetes manifests
├── docker-compose.yml
└── README.md
```

---

## 📖 Usage

### Basic Operation Flow

#### 1. Register a Company
1. Go to **http://localhost:5173/register**
2. Fill in company name, tax ID, email, phone, address, and administrator credentials
3. Log in with the newly created credentials

#### 2. Login
- **URL**: http://localhost:5173/login
- Test credentials (after seed):
  - **Admin**: `admin@example.com` / `admin123`
  - **Operator**: `operator@example.com` / `operator123`

#### 3. Add a Product
1. Go to **Products** → **New Product**
2. Fill in: unique code, description, quantity, unit, supplier, location (optional)
3. Product is automatically created in the **Received** state

#### 4. Manage States
1. Click a product in the list
2. Click **Change State**
3. Select the next permitted state (transitions are validated automatically)
4. Add notes if required and confirm

**Example flow:**
```
Received → Under Review → Approved → In Storage → In Preparation → In Shipment → Delivered
```

#### 5. View History
- Click a product to see all its movements
- Or go to **History** for a full system-wide operations log
- Filter by date, action, entity, or user

#### 6. Dashboard
- View inventory summary by state
- Analyse distribution with charts
- Monitor recent movements
- Identify products idle the longest

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register company & admin | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Current user data | ✅ |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products | ✅ |
| GET | `/api/products/:id` | Product details | ✅ |
| POST | `/api/products` | Create product | ✅ |
| PUT | `/api/products/:id` | Update product | ✅ |
| DELETE | `/api/products/:id` | Delete product | ✅ Admin |
| POST | `/api/products/:id/transition` | Change state | ✅ |
| GET | `/api/products/:id/history` | Movement history | ✅ |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | General statistics | ✅ |
| GET | `/api/dashboard/by-status` | Distribution by state | ✅ |

### Suppliers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/suppliers` | List suppliers | ✅ |
| POST | `/api/suppliers` | Create supplier | ✅ |
| PUT | `/api/suppliers/:id` | Update supplier | ✅ |
| DELETE | `/api/suppliers/:id` | Delete supplier | ✅ Admin |

### Vehicles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/vehicles` | List vehicles | ✅ |
| POST | `/api/vehicles` | Create vehicle | ✅ |
| PUT | `/api/vehicles/:id` | Update vehicle | ✅ |
| DELETE | `/api/vehicles/:id` | Delete vehicle | ✅ Admin |

### Transports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/transports` | List transports | ✅ |
| POST | `/api/transports` | Create transport | ✅ |
| PUT | `/api/transports/:id` | Update transport | ✅ |
| DELETE | `/api/transports/:id` | Delete transport | ✅ Admin |

### Audit Log

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auditlog` | List audit logs | ✅ |

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | List notifications | ✅ |
| PUT | `/api/notifications/:id/read` | Mark as read | ✅ |
| PUT | `/api/notifications/read-all` | Mark all as read | ✅ |

---

## 🔄 Product States

| State | Description | Allowed Next States |
|-------|-------------|---------------------|
| **Received** | Product just arrived at the warehouse | Under Review |
| **Under Review** | Product being inspected | Approved, Rejected |
| **Approved** | Product cleared for storage | In Storage |
| **Rejected** | Non-conforming product | Under Return |
| **In Storage** | Product stored in the warehouse | In Preparation, In Shipment |
| **In Preparation** | Product being prepared for dispatch | In Shipment, Cancelled |
| **In Shipment** | Product in transit | Delivered |
| **Delivered** | Product delivered to customer *(final)* | — |
| **Under Return** | Product being returned | Received, Disposed |
| **Cancelled** | Preparation cancelled | In Storage |
| **Disposed** | Product discarded *(final)* | — |

**Rules:**
- Only valid transitions are permitted (validated on the backend)
- Some states require mandatory notes
- Transition history is **immutable** and always recorded
- Permissions are checked before each transition

---

## 🔐 Permissions

### Super Admin
- Manage all companies
- Create global users
- Access aggregated dashboards
- System-wide configuration

### Administrator *(per company)*
- Full access within their company
- Approve or reject products
- Change any state
- Manage company users
- Delete products, suppliers, vehicles

### Operator *(per company)*
- Manage inventory and movements
- **Cannot** approve or reject products
- **Cannot** delete records
- Limited access to certain state transitions

---

## 💻 Development Guide

### Before You Code

1. **Read the requirements document three times** — scope, rules, then implementation notes.
2. **Plan the database schema** — tables, fields, relationships, and always include `companyId` for multi-tenant tables.
3. **Draw the state diagram** — all states, allowed transitions, and who can perform each.
4. **Sketch the screens** — rough layout of filters, tables, and forms per page.

### Useful Commands

```bash
# Run tests
cd backend-nest && npm test
cd backend-nest && npm run test:e2e
cd frontend && npm test

# Generate a Prisma migration
cd backend-nest
npx prisma migrate dev --name migration_name

# Open Prisma Studio
cd backend-nest && npx prisma studio
```

### Best Practices

- ✅ Always validate input with Zod
- ✅ Always filter by `companyId` in multi-tenant queries
- ✅ Log important operations to the audit log
- ✅ Use Prisma transactions for complex operations
- ✅ Write tests for critical business logic
- ✅ Use environment variables for secrets — never hardcode them

---

## 🗺️ Roadmap

### Phase 1 — Done ✅
- [x] Multi-tenant system
- [x] JWT authentication
- [x] Product CRUD
- [x] State machine
- [x] Basic dashboard
- [x] Operations history

### Phase 2 — Done ✅
- [x] Supplier management
- [x] Vehicle management
- [x] Transport management
- [x] Notification system
- [x] Advanced dashboard
- [x] Super Admin

### Phase 3 — In Progress 🚧
- [ ] Advanced PDF reports
- [ ] Data export (Excel, CSV)
- [ ] Carrier API integration
- [ ] Configurable alert system
- [ ] Mobile app (React Native)

### Phase 4 — Planned 📋
- [ ] Cross-company integration
- [ ] Transport marketplace
- [ ] BI and predictive analytics
- [ ] ERP integration
- [ ] Public API for third parties

---

## ✅ Improvements Needed to Reach 10/10

### Code Structure (currently 8/10)
1. Remove the deprecated `backend` (Express) directory after full migration to `backend-nest`.
2. Finalize monorepo workspace automation scripts.
3. Remove unnecessary files; add `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.
4. Ensure all import paths use `tsconfig-paths` with no `@ts-nocheck`.

### Backend (currently 8/10)
1. Achieve 100% test coverage — include error cases, validations, and middleware.
2. Separate unit tests from e2e tests; implement proper mocking.
3. Add GitHub Actions CI pipelines (lint → build → test → prisma migrate).
4. Add auto-generated Swagger/OpenAPI docs with working examples.
5. Validate `DATABASE_URL` on startup and show a friendly error if missing.
6. Add `backend-nest` to Docker Compose and complete Helm chart with readiness/liveness probes.

### Frontend (currently 7/10)
1. Write component tests with React Testing Library and e2e tests with Cypress or Playwright.
2. Improve folder structure — separate `pages/` and `components/` with barrel `index.tsx` exports; apply atomic design.
3. Set up Storybook for isolated component development.
4. Ensure all Axios calls handle errors and display loading states.
5. Add ESLint + Prettier and pre-commit hooks with Husky.

### Documentation (currently 8/10)
1. Add `docs/DEPLOYMENT.md` and `docs/UX.md` guides.
2. Include real screenshots, architecture diagrams, and cloud/k8s setup instructions.
3. Provide a changelog and feature roadmap.
4. Write full OpenAPI/Swagger docs and a frontend usage guide per page.

### UX/UI (currently 6/10)
1. Conduct usability testing with real users.
2. Create a design system with color, typography, and spacing tokens (Tailwind + custom components).
3. Ensure full responsiveness and implement dark mode.
4. Audit and fix accessibility (ARIA roles, contrast ratios, keyboard navigation).
5. Document navigation flows and UI states (loading, error, empty).

### Production Readiness (currently 6/10)
1. Add monitoring (Prometheus + Grafana or Sentry) and structured backend logging.
2. Add Terraform/Helm deployment scripts and rollback instructions.
3. Include backup policy, automated migrations, and load tests.
4. Enable HTTPS, strict CORS, CSRF protection, and a security review.
5. Set up CI/CD that builds and pushes Docker images to a registry.
6. Automate artifact analysis (bundle size, minification, performance audits).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create a branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits small and focused
- Open an issue before starting extensive work

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you found a bug or have a suggestion:

1. Check existing [Issues](https://github.com/your-org/logistica-multi-tenant/issues)
2. Create a new issue if needed

---

**Developed with ❤️ for the Commit PT community**
