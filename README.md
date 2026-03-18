# 📦 Multi-Tenant Logistics Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-green)](#requirements)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](#)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](#)

> **Enterprise-grade logistics platform** serving multiple companies with complete data isolation, real-time inventory control, and production-ready architecture.

---

## 🎮 **Try the Demo Now** 

[![Try Demo](https://img.shields.io/badge/🎮%20TRY%20DEMO%20NOW-34D399?style=for-the-badge&labelColor=1F2937)](./DEMO_GUIDE.md)

**No signup needed!** One-click access to a fully populated demo with 12 products, 10 suppliers, and real workflows. Perfect for interviews and portfolio reviews.

**[See DEMO_GUIDE.md](./DEMO_GUIDE.md)** for step-by-step instructions.

---

**🎯 Perfect for:** Supply chain teams | Warehouse management | Multi-company logistics operations | Portfolio projects

**⭐ Key Strengths:** TypeScript everywhere | Multi-tenant security | Professional UI | DevOps-ready

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

## 🎥 Demo

A short demo video showcasing the application in action:

[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

*Replace `YOUR_VIDEO_ID` with the actual YouTube video ID. If no video is available, you can link to a live demo or remove this section.*

---

## ⚡ Quick Start (5 minutes)

Want to see it in action? Follow the **[DEMO.md](./DEMO.md)** guide for step-by-step instructions.

**Fastest way to run locally:**

```bash
# 1. Clone and install
git clone https://github.com/GoncaloCoimbra/logistica-multi-tenant.git
cd logistica-multi-tenant && npm install

# 2. Setup environment
cd backend-nest && cp .env.example .env

# 3. Start everything
npm run start-all

# 4. Open browser
http://localhost:3001  # Frontend
http://localhost:3000/api/docs  # API Docs
```

**🔐 Login with:**
- Email: `admin@logistica.com`
- Or signup at the login page

**🌱 Populate demo data:**
```bash
cd backend-nest
npm run seed:demo
```

More details in [DEMO.md](./DEMO.md)

---

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

### Frontend Layer
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 18.2+ | UI component library & state management |
| **Language** | TypeScript | 5.0+ | Type-safe development |
| **Styling** | TailwindCSS | 3.4+ | Utility-first CSS for responsive design |
| **Routing** | React Router | 6.x | Client-side SPA navigation |
| **HTTP Client** | Axios | 1.6+ | REST API integration with interceptors |
| **Charts** | Recharts | 2.5+ | Business analytics & inventory visualization |
| **Forms** | React Hook Form | 7.x | Performant form state management |
| **Build Tool** | Vite | 4.x+ | Next-gen fast dev server & build |
| **Notifications** | Hot Toast | Latest | Non-intrusive toast notifications |

### Backend Layer  
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript server runtime |
| **Framework** | NestJS 10+ | 10.0+ | Enterprise Node.js framework with DI |
| **Language** | TypeScript | 5.0+ | Type-safe server development |
| **ORM** | Prisma | 5.0+ | Type-safe database client & migrations |
| **Validation** | Zod | 3.22+ | Runtime schema validation with TypeScript |
| **Auth** | JWT + RT | — | Stateless auth with refresh tokens |
| **API Docs** | Swagger/OpenAPI | 7.0+ | Auto-generated interactive API documentation |
| **Logging** | Winston | 3.x | Structured application logging |
| **Testing** | Jest | 29.x | Unit & integration test framework |

### Data Layer
| Service | Technology | Version | Purpose |
|---------|-----------|---------|---------|
| **Database** | PostgreSQL | 15 | Enterprise relational database |
| **Migrations** | Prisma Migrate | 5.0+ | Type-safe schema versioning |
| **ORM Adapter** | Prisma Client | 5.0+ | Auto-generated query builder |

### DevOps & Infrastructure
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Application container images |
| **Composition** | Docker Compose | Multi-container local dev environment |
| **Orchestration** | Kubernetes 1.26+ | Production-grade container orchestration |
| **Reverse Proxy** | Nginx | Load balancing & reverse proxy routing |
| **CI/CD** | GitHub Actions | Automated testing & deployment pipelines |
| **Package Manager** | npm 9+ | Monorepo workspaces management |

### Security Frameworks
- **JWT Authentication** with refresh token rotation
- **Multi-tenant Isolation** via Guards & Row-Level Filter
- **Role-Based Access Control (RBAC)** — Admin, Operator, Super Admin
- **SQL Injection Prevention** via Prisma ORM
- **Password Hashing** — bcrypt with salt rounds

---

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    Client Layer                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   React 18 SPA (http://localhost:3001)                   │  │
│  │   • Dashboard (Recharts analytics)                        │  │
│  │   • Product Management (CRUD)                             │  │
│  │   • User Management & RBAC                                │  │
│  │   • Multi-tenant aware (companyId in context)             │  │
│  └──────────┬───────────────────────────────────────────────┘  │
│             │ HTTP REST + JSON                                 │
└─────────────┼────────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│                    API Gateway Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  NestJS Application (http://localhost:3000)              │   │
│  │  • Swagger OpenAPI Documentation (/api/docs)             │   │
│  │  • Global Exception Filters                              │   │
│  │  • Request/Response Logging                              │   │
│  └──────────┬───────────────────────────────────────────────┘   │
└─────────────┼───────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│                  Security & Auth Layer                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  1. JwtAuthGuard          → Validates JWT tokens           │  │
│  │  2. TenantGuard          → Injects current companyId       │  │
│  │  3. RolesGuard @Roles()  → Validates user permissions      │  │
│  │  4. Request Logging      → Tracks all operations           │  │
│  └────────────┬─────────────────────────────────────────────┘   │
└───────────────┼──────────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────────┐
│               Business Logic Layer (Modules)                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│  │  Products    │ │  Users       │ │  Companies   │              │
│  │  • CRUD      │ │  • Auth      │ │  • Settings  │              │
│  │  • Movement  │ │  • Roles     │ │  • License   │              │
│  │  • Analytics │ │  • Audit Log │ │  • Branding  │              │
│  └──────────────┘ └──────────────┘ └──────────────┘              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│  │  Transport   │ │  Suppliers   │ │  Notification│              │
│  │  • Routes    │ │  • Registry  │ │  • Queue     │              │
│  │  • Vehicles  │ │  • Contacts  │ │  • Alerts    │              │
│  │  • Tracking  │ │  • History   │ │  • Email     │              │
│  └──────────────┘ └──────────────┘ └──────────────┘              │
└───────────┬──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│           Data Access Layer (Prisma ORM)                          │
│  • Type-safe database queries                                     │
│  • Automatic migration management                                │
│  • Connection pooling                                             │
│  • Query optimization                                             │
└───────────┬──────────────────────────────────────────────────────┘
            │ SQL
┌───────────▼──────────────────────────────────────────────────────┐
│         PostgreSQL 15 Database                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            Company Isolation (Row-Level)                    │ │
│  │ ┌──────────────────┐  ┌──────────────────┐                 │ │
│  │ │  Company A Data  │  │  Company B Data  │  ...            │ │
│  │ │ • Users (Tenant) │  │ • Users (Tenant) │                 │ │
│  │ │ • Products       │  │ • Products       │                 │ │
│  │ │ • Transports     │  │ • Transports     │                 │ │
│  │ │ • Suppliers      │  │ • Suppliers      │                 │ │
│  │ └──────────────────┘  └──────────────────┘                 │ │
│  │    [Fully Isolated & Secure]                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  • Shared Tables: Users, Companies, Audit Logs                  │
│  • Tenant Filters: WHERE company_id = $1 on all queries         │
└────────────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Isolation Strategy

| Layer | Isolation Method | Implementation |
|-------|------------------|-----------------|
| **Frontend** | Context & State | User company stored in AuthContext |
| **API Gateway** | Route Guards | TenantGuard extracts companyId from JWT |
| **Database** | Row-Level Security | WHERE company_id = $userId filters in every query |
| **Audit** | Automatic Logging | AuditLog tracks user & company for each operation |

### Product State Machine

```
     ┌─ [Received]
     │      │
     ├─────〉[UnderReview] ─────┐
     │      │                   │
     │     Rejected             │ Approved
     │      │                   │
     │      └─〉[UnderReturn]    └─〉[InStorage]
     │           │                   │      
     │           └─ Received        │
     │                              │  Preparation
     │                              ├──────────────┐
     │                              │              │
     │                        [InPreparation]      │
     │                              │              │
     │                              └──〉[InShipment]
     │                                      │
     │                                   Delivered
     │                                      │
     │                                    [END]
     │
     └─ Cancelled ──〉[InStorage] (can be resumed)
     └─ Disposed ──〉[END]
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** ([download](https://nodejs.org/))
- **PostgreSQL 15** ([download](https://www.postgresql.org/)) or Docker
- **Git** ([download](https://git-scm.com/))

### Installation & Setup

**Step 1: Clone & Install**
```bash
git clone https://github.com/GoncaloCoimbra/logistica-multi-tenant.git
cd logistica-multi-tenant
npm install
```

**Step 2: Configure Environment**
```bash
cd backend-nest
cp .env.example .env  # Or create .env manually
```

**Step 3: Database Setup**

**Option A: With Docker (Recommended)**
```bash
docker-compose up -d  # Starts PostgreSQL
npx prisma migrate deploy
npx prisma generate
```

**Option B: Manual PostgreSQL**
```bash
createdb logistica  # Create database
npx prisma migrate deploy
npx prisma generate
```

**Step 4: Start Application**
```bash
# From root directory
npm run start-all
```

Open:
- 🖥️ **Frontend:** http://localhost:3001
- 🔧 **API Docs:** http://localhost:3000/api/docs
- 📊 **Database Studio:** `npm run prisma:studio` in backend-nest

### Quick Demo Data

```bash
cd backend-nest
npm run seed:demo  # Populates 10+ suppliers & 12 products
```

---

**👉 For detailed demo walkthrough, see [DEMO.md](./DEMO.md)**

---
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

### Directory Layout

```
logistica-multi-tenant/
│
├── 📂 backend/                      # DEPRECATED — Express (legacy)
│                                    # ⚠️ Do not add new features here
│
├── 📂 backend-nest/                 # ⭐ Active NestJS API & Database
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema with models
│   │   ├── migrations/              # Automatic migration history
│   │   └── seed.ts                  # Initial seeding script
│   │
│   ├── src/
│   │   ├── auth/                    # Authentication (JWT, Guards)
│   │   ├── companies/               # Company management & settings
│   │   ├── common/                  # Common filters, DTOs, exceptions
│   │   ├── controllers/             # API endpoint handlers
│   │   ├── database/                # Database connection, transactions
│   │   ├── modules/                 # Feature modules (Products, Users, etc)
│   │   ├── products/                # Product CRUD & state machine
│   │   ├── services/                # Business logic (UserService, etc)
│   │   ├── transports/              # Logistics & vehicle tracking
│   │   ├── users/                   # User management & roles
│   │   ├── vehicles/                # Fleet management
│   │   ├── suppliers/               # Supplier registry
│   │   ├── notifications/           # Alert system
│   │   ├── types/                   # TypeScript interfaces & enums
│   │   │
│   │   ├── app.controller.ts        # Root API controller
│   │   ├── app.module.ts            # Root DI module
│   │   ├── app.service.ts           # Root service
│   │   └── main.ts                  # NestJS bootstrap
│   │
│   ├── test/
│   │   ├── app.e2e-spec.ts          # End-to-end tests
│   │   ├── auth.e2e-spec.ts         # Auth flow tests
│   │   └── jest-e2e.json            # E2E test config
│   │
│   ├── seed-demo-data.ts            # Demo seeding (12 products, 10 suppliers)
│   ├── Dockerfile                   # Container image definition
│   ├── package.json                 # Dependencies & scripts
│   ├── nest-cli.json                # NestJS CLI config
│   ├── tsconfig.json                # TypeScript base config
│   ├── tsconfig.build.json          # Build config
│   └── eslint.config.mjs            # ESLint rules
│
├── 📂 frontend/                     # ⭐ React 18 SPA (UI Layer)
│   ├── src/
│   │   ├── api/                     # API client & Axios config
│   │   ├── components/              # Reusable UI components
│   │   │   ├── UserManagementTable
│   │   │   ├── ProductCard
│   │   │   └── ...
│   │   │
│   │   ├── contexts/                # React Context (Auth, Tenant)
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth              # Authentication state
│   │   │   ├── useProducts          # Product data fetching
│   │   │   └── ...
│   │   │
│   │   ├── layouts/                 # Page layouts (Sidebar, Header)
│   │   ├── pages/                   # Route pages
│   │   │   ├── Dashboard
│   │   │   ├── ProductList
│   │   │   ├── UserManagement
│   │   │   ├── Login
│   │   │   └── ...
│   │   │
│   │   ├── lib/                     # Utility functions, constants
│   │   ├── App.tsx                  # Main App component
│   │   └── index.tsx                # React DOM render
│   │
│   ├── Dockerfile                   # Nginx container for production
│   ├── package.json                 # Dependencies & scripts
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript config
│   └── vite.config.ts               # Vite build config
│
├── 📂 k8s/                          # Kubernetes manifests (production)
│   ├── namespace.yaml               # K8s namespace
│   ├── configmap.yaml               # Environment & config
│   ├── secrets.yaml                 # Encrypted secrets
│   ├── postgres.yaml                # PostgreSQL StatefulSet
│   ├── backend.yaml                 # NestJS API Deployment
│   ├── frontend.yaml                # React SPA Deployment
│   ├── ingress.yaml                 # Nginx Ingress routing
│   └── hpa.yaml                     # Horizontal Pod Autoscaler
│
├── 📂 docs/                         # Documentation
│   ├── ARCHITECTURE.md              # System design deep-dive
│   ├── DEPLOYMENT.md                # Production deployment guide
│   ├── SECURITY.md                  # Security best practices
│   ├── API.md                       # Full API reference
│   ├── TESTING.md                   # Testing strategy
│   └── ROADMAP.md                   # Feature roadmap
│
├── docker-compose.yml               # Local dev environment setup
├── package.json                     # Root monorepo config
├── .gitignore
├── .env.example                     # Environment template
├── DEMO.md                          # Demo guide & walkthroughs
├── README.md                        # This file
└── LICENSE                          # MIT License
```

### Key Directories Explained

**`backend-nest/src/`** — Core API Logic
- **auth/** : JWT token generation, refresh logic, login/register endpoints
- **modules/** : Feature-specific business logic organized by domain
- **common/** : Shared Guards (TenantGuard, RolesGuard), Filters, DTOs, Exceptions
- **database/** : Prisma interactions, transactions, connection management

**`frontend/src/`** — React Application Structure
- **api/** : Axios instance with interceptors, error handling, API calls
- **contexts/** : AuthContext (user, company), TenantContext
- **hooks/** : useAuth(), useProducts(), useAsync() custom React hooks
- **pages/** : Full-page components (routed via React Router)
- **components/** : Reusable UI components (tables, forms, cards, modals)

---

## 💻 Development Guide

### Code Example Walkthrough

#### Example 1: Creating a Product (Backend)

**Service Layer** (`backend-nest/src/products/products.service.ts`):
```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateProductDto, companyId: string) {
    // Validate supplier exists in this company
    const supplier = await this.prisma.supplier.findFirst({
      where: { id: input.supplierId, companyId }
    });
    if (!supplier) throw new BadRequestException('Supplier not found');

    // Create product with initial state
    return this.prisma.product.create({
      data: {
        code: input.code,
        description: input.description,
        quantity: input.quantity,
        companyId,
        supplierId: input.supplierId,
        state: 'RECEIVED',  // Initial state
        location: input.location || 'Warehouse A'
      }
    });
  }

  // Multi-tenant isolation: only fetch products for this company
  async findByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      include: { supplier: true }
    });
  }
}
```

**Controller Layer** (`backend-nest/src/controllers/products.controller.ts`):
```typescript
@Controller('api/products')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Post()
  @Roles('ADMIN', 'OPERATOR')
  async create(
    @Body() input: CreateProductDto,
    @Req() req: any  // Contains companyId injected by TenantGuard
  ) {
    const product = await this.service.create(input, req.user.companyId);
    this.logger.log(`Product created: ${product.code}`, 'ProductsController');
    return product;
  }

  @Get()
  async list(@Req() req: any) {
    const products = await this.service.findByCompany(req.user.companyId);
    return { data: products, count: products.length };
  }
}
```

#### Example 2: Listing Products (Frontend)

**Hook** (`frontend/src/hooks/useProducts.ts`):
```typescript
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/products');
      setProducts(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
```

**Component** (`frontend/src/pages/ProductList.tsx`):
```tsx
export const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { user } = useAuth();

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <Alert type="error">{error}</Alert>;

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <button>Novo Produto</button>
      <table>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{p.state}</td>
              <td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Before You Code

1. **Read Requirements** — Understand scope and edge cases
2. **Plan Schema** — Draw database relationships, include `companyId` for isolation
3. **Draw States** — All valid transitions and permissions
4. **Sketch UI** — Filters, tables, forms, error states
5. **Test Plan** — Happy path, error cases, edge cases

### Essential Commands

```bash
# Database
npx prisma studio           # Open Prisma GUI
npx prisma migrate dev      # Create a new migration
npx prisma db seed          # Run seed script

# Testing
npm test                    # Run unit/integration tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Code coverage report

# Code Quality
npm run lint               # ESLint
npm run format             # Prettier
npm run build              # Production build

# Demo
npm run seed:demo          # Populate demo data
npm run start-all          # Both servers + hot-reload
```

### Best Practices Checklist

- ✅ Always validate with Zod before processing
- ✅ Always filter by `companyId` in multi-tenant queries
- ✅ Use Prisma transactions for complex operations
- ✅ Log important operations (created, updated, deleted)
- ✅ Write tests for critical business logic
- ✅ Never hardcode secrets — use environment variables
- ✅ Handle errors gracefully and return meaningful messages
- ✅ Implement proper pagination for large datasets
- ✅ Use proper HTTP status codes (201 for create, 204 for delete, etc)
- ✅ Add JSDoc comments to public functions

---

## 🧪 Testing Strategy

### Unit Tests (Backend)

Test individual services, guards, and utilities in isolation with mocked dependencies:

```bash
# Run unit tests
npm test

# With coverage
npm run test:cov
```

Example (`backend-nest/src/products/products.service.spec.ts`):
```typescript
describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(() => {
    const module = Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: { product: { create: jest.fn() } } }
      ]
    }).compile();
    service = module.get(ProductsService);
    prisma = module.get(PrismaService);
  });

  it('should create a product', async () => {
    jest.spyOn(prisma.product, 'create').mockResolvedValue({
      id: '1', code: 'TEST-001', state: 'RECEIVED', companyId: 'co1'
    });

    const result = await service.create({ code: 'TEST-001' }, 'co1');
    expect(result.state).toBe('RECEIVED');
    expect(prisma.product.create).toHaveBeenCalled();
  });
});
```

### E2E Tests (Full Flow)

Test complete API flows with real database and HTTP requests:

```bash
npm run test:e2e
```

Example (`backend-nest/test/products.e2e-spec.ts`):
```typescript
describe('Products E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('should create and list products', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ code: 'TEST-001', quantity: 10 });

    expect(res.status).toBe(201);
    expect(res.body.code).toBe('TEST-001');
  });
});
```

### Frontend Tests

Test React components with React Testing Library:

```bash
npm test
```

### Coverage Goals

- Unit Tests: >80% critical logic (services, calculations, validations)
- E2E Tests: Happy path flows + error scenarios
- Overall: >70% for production readiness

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

## 🚨 Troubleshooting

### Database Issues

**Problem: "Database connection refused"**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# If not running, start it
docker-compose up -d

# Verify DATABASE_URL in .env is correct:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logistica
```

**Problem: "Prisma migrations pending"**
```
Error: The database schema is not in sync with the Prisma schema.
```
**Solution:**
```bash
cd backend-nest
npx prisma migrate deploy  # Apply pending migrations
npx prisma generate       # Regenerate Prisma client
```

**Problem: "No database named 'logistica'"**
```bash
# Manual PostgreSQL (without Docker)
createdb logistica

# Then run migrations
npx prisma migrate deploy
```

---

### Backend Issues

**Problem: "Port 3000 already in use"**
```bash
# Find & kill process using port 3000
lsof -i :3000        # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Then kill the process
kill -9 <PID>        # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Problem: "Cannot find module '@nestjs/core'"**
```bash
cd backend-nest
npm install
npm run build
```

**Problem: "Swagger docs not loading at /api/docs"**
- Ensure backend is running: `npm run start`
- Check firewall allows localhost:3000
- Try clearing browser cache (Ctrl+Shift+Delete)

---

### Frontend Issues

**Problem: "Frontend stuck on 'Loading...' at 3001"**
```bash
# Check if backend is running
curl http://localhost:3000/api/docs

# Check browser console for CORS errors
# If CORS error, verify CORS_ORIGIN in backend .env

# Try hard refresh or clear cache
Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

**Problem: "Cannot find module 'react'"**
```bash
cd frontend
npm install
npm run dev
```

**Problem: "Vite dev server port 3001 already in use"**
```bash
# Kill process
lsof -i :3001
kill -9 <PID>

# Or specify different port in vite.config.ts:
export default {
  server: {
    port: 3002  // Change to available port
  }
}
```

---

### Authentication Issues

**Problem: "401 Unauthorized — Invalid token"**
- Token expired? Login again
- Browser local storage cleared? Login again
- Check JWT_SECRET matches between frontend & backend

**Problem: "Cannot login — server error"**
```bash
# Check backend logs for details
npm run dev  # See console output

# Verify user exists in database
npx prisma studio  # Browse Users table
```

**Problem: "No login credentials after seed"**
```bash
# Run the seed script again
cd backend-nest
npm run seed
# Or for demo data:
npm run seed:demo

# Check the output for created credentials
# Look for "Created user: admin@logistica.com"
```

---

### Performance Issues

**Problem: "API calls very slow"**
1. Check database connection: `npx prisma studio`
2. Look for N+1 query problems in logs
3. Ensure indexes exist: `npx prisma db execute -- "CREATE INDEX idx_products_company ON products(company_id);"`

**Problem: "Frontend freezes after clicking buttons"**
- Open DevTools Network tab & check for hanging requests
- Look for errors in browser console
- Check if backend API is responding: `curl http://localhost:3000/api/products`

---

### Docker Issues

**Problem: "docker-compose up fails with error"**
```bash
# Remove old containers and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build

# Check logs
docker-compose logs postgres
docker-compose logs backend-nest
```

---

### Git & Deployment Issues

**Problem: "Cannot push to GitHub"**
```bash
# Check remote URL is correct
git remote -v

# Fix if wrong
git remote set-url origin https://github.com/YOUR-USERNAME/logistica-multi-tenant.git

# Push
git push origin main
```

**Problem: "Kubernetes pods failing to start"**
```bash
# Check pod logs
kubectl logs -n logistica pod/backend-nest-xxx

# Check events
kubectl describe pod -n logistica backend-nest-xxx

# Ensure secrets created
kubectl create secret generic app-secrets -n logistica \
  --from-literal=database-url=postgresql://...
```

---

### Getting Help

1. **Check Existing Issues** → [GitHub Issues](https://github.com/GoncaloCoimbra/logistica-multi-tenant/issues)
2. **Search Error Message** → Copy exact error into Google/Stack Overflow
3. **Check Logs** → `npm run dev` shows detailed error messages
4. **Reset Everything** → `docker-compose down && rm -rf node_modules && npm install`

---

## 🔗 Useful Resources

### Documentation
- [DEMO.md](./DEMO.md) — Complete demo walkthrough
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Detailed system design
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Production deployment guide

### Official Documentation  
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Community
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [Prisma Community](https://www.prisma.io/community)
- [React Community](https://react.dev/community)

---

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
