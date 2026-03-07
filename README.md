# Multi-Tenant Logistics

[![Tests](https://github.com/your-org/logistica-multi-tenant/workflows/Run%20Tests/badge.svg)](https://github.com/your-org/logistica-multi-tenant/actions)
[![Lint & Format](https://github.com/your-org/logistica-multi-tenant/workflows/Lint%20%26%20Format/badge.svg)](https://github.com/your-org/logistica-multi-tenant/actions)
[![Build Docker Images](https://github.com/your-org/logistica-multi-tenant/workflows/Build%20Docker%20Images/badge.svg)](https://github.com/your-org/logistica-multi-tenant/actions)
[![codecov](https://codecov.io/gh/your-org/logistica-multi-tenant/branch/develop/graph/badge.svg)](https://codecov.io/gh/your-org/logistica-multi-tenant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-green)](#requirements)
[![JavaScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](#)

---

This repository contains a complete multi-tenant logistics management platform. The code is divided into two backends (classic Express and NestJS) and a modern React frontend. The goal of this document is to guide new developers, testers, and operators to run, test, and evolve the system.

> **Note:** to reach a score of 10/10 in all categories, it is necessary to complete the list of improvements below.

---

## 📁 Estrutura do repositório

```
/ (root)
  ├─ backend/           # **DEPRECATED** API Express + Prisma (mantido apenas por histórico)
  ├─ backend-nest/      # API NestJS + Prisma (código ativo e recomendado)
  ├─ frontend/          # SPA React + Vite
  ├─ docker-compose.yml # orquestração de containers para desenvolvimento
  ├─ k8s/               # recursos Kubernetes para produção
  └─ docs/              # documentação adicional (screenshots, guias)
```

> **Decision:** the `backend` subproject based on Express no longer receives updates. All new features and fixes must be implemented in `backend-nest`. The `backend` directory can be removed once all relevant code is migrated or proven unnecessary; until then it is just a legacy artifact.

---

## 🚀 Quick Start (development environment)

1. **Clone and install dependencies:**
   ```bash
   git clone <repo> && cd logistica-multi-tenant
   npm install --workspaces # or install separately in each subdirectory
   ```

2. **Copy environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   cp backend-nest/.env.example backend-nest/.env
   cp frontend/.env.example frontend/.env # if exists
   ```
   Fill `DATABASE_URL` pointing to the Postgres that will be started.

3. **Run database and API via Docker Compose:**
   ```bash
   docker-compose up -d
   # wait until the "db" service is healthy
   npm run --workspace=backend prisma migrate dev
   npm run --workspace=backend seed
   ```
   or, if you prefer, use backend-nest:
   ```bash
   npm run --workspace=backend-nest prisma migrate dev
   npm run --workspace=backend-nest seed
   ```

4. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   open http://localhost:5173

5. **Tests:**
   ```bash
   npm run --workspace=backend test          # unit
   npm run --workspace=backend test:e2e     # integration
   npm run --workspace=frontend test        # jest/react-testing-library
   ```

---

## ✅ Improvements needed to reach 10/10

Below is a list of changes that elevate each category to perfection. Some of them are already partially implemented; others require additional work.

### Code Structure (currently 8/10)
1. **Deprecate and remove `backend`**. The active base is `backend-nest`; keep the Express directory only for compatibility until elimination. Clear documentation about the decision is above.
2. Adopt a monorepo with workspaces (already started) and automation scripts.
3. Eliminate unnecessary files and add `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.
4. Ensure that all import paths use `tsconfig-paths` and there are no `@ts-nocheck`.

### Backend (architecture, tests) – 8/10
1. Complete test coverage for 100% (include error cases, validations and middlewares).
2. Implement mocks in tests and separate unit tests from e2e.
3. Create CI pipelines (GitHub Actions) that run lint, build, tests and prisma migrate.
4. Add automatic API documentation (Swagger) with valid examples.
5. Validate existence of `DATABASE_URL` and show friendly error if absent.
6. Consolidate Docker build/service (including `backend-nest` in compose) and `k8s` Helm chart with readiness/liveness.

### Frontend – 7/10
1. Write component tests and flow tests with React Testing Library and end-to-end with Cypress or Playwright.
2. Improve folder organization (separate "pages" and "components" with index.tsx that exports) and apply atomic design pattern.
3. Configure Storybook to visualize isolated components.
4. Ensure that all Axios calls handle errors and display loaders.
5. Add lint/format (ESLint + Prettier) and pre-commit hooks (`husky`).

### Documentation – 8/10
1. Complete main README (done above) and add specific guides (`docs/UX`, `docs/DEPLOYMENT.md`).
2. Include real screenshots, architecture diagrams and environment configuration instructions (cloud, k8s).
3. Provide changelog and roadmap of future features.
4. Write API design documentation (OpenAPI/Swagger) and frontend usage (explained pages).

### UX/UI – 6/10 (estimated)
1. Conduct usability tests with real users to identify friction points.
2. Create a design system or use a library (Tailwind + custom components) with color, typography and spacing tokens.
3. Ensure responsiveness on all screen sizes and implement dark mode.
4. Audit and fix accessibility issues (ARIA roles, contrast, keyboard navigation).
5. Document navigation flow and states (loading, error, empty).

### Production State – 6/10
1. Add monitoring (Prometheus + Grafana, or Sentry) and structured logging in the backend.
2. Implement deployment strategy (Terraform/Helm scripts) and rollback instructions.
3. Include backup policy, automated migrations and load tests.
4. Enable HTTPS, strict CORS, CSRF protection and security review.
5. Configure CI/CD that builds Docker images and publishes to registry.
6. Automate artifact generation (bundle analysis, minimization, performance analyses).

---

## 📚 Documentação

Main references:

- **Backend**: NestJS + Prisma ORM
- **Frontend**: Modern React with Vite
- **DevOps**: Docker Compose + Kubernetes-ready

---

## 🤝 Contributing

1. Open an issue before starting extensive work.
2. Create feature branches with `feature/description` or `bugfix/description`.
3. Run tests before submitting PR.
4. Write tests for any new functionality or fixed bug.

---

## 🎯 Next Steps

- Complete test suite (unit, integration, e2e)
- Add automatic Swagger docs
- Implement GitHub Actions CI/CD
- Deploy to staging (Kubernetes)
- Security documentation and audits

Good luck and good work! 😊
