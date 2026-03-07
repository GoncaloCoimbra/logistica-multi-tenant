# Multi-Tenant Logistics Management System

Complete platform for logistics management with multi-tenant isolation.

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd logistica-multi-tenant
   ```

2. **Start the services:**
   ```bash
   docker-compose up -d
   ```

3. **Open in browser:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

Done! In 5 minutes you have the system running.

## 📊 Priorities by Impact

| Priority | Action | Impact |
|----------|--------|--------|
| 🔴 Critical | Multi-tenant isolation test | Security |
| 🔴 Critical | Prisma middleware with mandatory companyId | Security |
| 🔴 Critical | Remove backend/ Express | Confusion + risk |
| 🟠 High | 100% state machine tests | Reliability |
| 🟠 High | React Query in frontend | Code quality |
| 🟠 High | Clean root files | Professional impression |
| 🟡 Medium | Automatic Swagger | Developer experience |
| 🟡 Medium | Refresh token rotation | Security |
| 🟡 Medium | Error boundaries in frontend | UX |
| 🟢 Low | Storybook | UI Documentation |
| 🟢 Low | Dark mode | UX |

## 🛠️ Technologies

- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** React, TypeScript, Tailwind CSS
- **DevOps:** Docker, Docker Compose

## 📚 Documentation

See `docs/` for detailed documentation.