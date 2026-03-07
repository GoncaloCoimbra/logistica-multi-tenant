# Documentation Index

Welcome! Below is a complete guide to the documentation available in the project.

## 📚 General Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview, stack, features and quickstart |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contributor guide - how to make PR, code standards |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Code of conduct and coexistence policies |
| [CHANGELOG.md](./CHANGELOG.md) | Change history and versions |
| [ROADMAP.md](./ROADMAP.md) | Development plan by quarters (Q1-Q4 2026) |

## 🏗️ Architecture and Decisions

| Document | Purpose |
|----------|---------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Monorepo structure, backend vs backend-nest decision, technologies |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deploy in Docker, Kubernetes, Helm, backup, rollback |
| [docs/UX_UI.md](./docs/UX_UI.md) | Design system, component patterns, accessibility, themes |

## 📖 Project Guides

### Backend (NestJS)
| File | Content |
|------|---------|
| [backend-nest/README.md](./backend-nest/README.md) | Setup, module structure, API docs, tests |
| [backend-nest/.env.example](./backend-nest/.env.example) | Required environment variables |
| [backend-nest/prisma/schema.prisma](./backend-nest/prisma/schema.prisma) | Data model (Prisma) |

### Frontend (React)
| File | Content |
|------|---------|
| [frontend/README.md](./frontend/README.md) | Setup, structure, React tests, API integration |
| [frontend/.env.example](./frontend/.env.example) | Environment variables |
| [frontend/tailwind.config.js](./frontend/tailwind.config.js) | Tailwind theme customizations |

### Legacy Backend (Express)
| File | Content |
|------|---------|
| [backend/README.md](./backend/README.md) | ⚠️ Deprecated - historical reference only |

## 🔧 Configuração e Ferramentas

## 🔧 Configuration and Tools

### Environment Variables
- Create `.env` from `.env.example` in each subproject
- Essential: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`

### Monorepo (npm workspaces)
```bash
npm install              # Install all packages
npm run lint-all         # Lint in backend-nest and frontend
npm run test-all         # Tests in both
npm run build-all        # Build in both
npm run format-all       # Prettier in both
```

### CI/CD
- Pipeline: [.github/workflows/ci.yml](./.github/workflows/ci.yml)
- Runs automatically: lint, tests, build
- Supports: Node.js 20+

### Git Hooks
- **Husky** + **lint-staged**: Automatic pre-commit hooks
- Configuration: [.husky/](./.husky/) and `lint-staged` in [package.json](./package.json)

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone and install
git clone <repo>
cd logistica-multi-tenant
npm install

# 2. Configure environment
cp backend-nest/.env.example backend-nest/.env
cp frontend/.env.example frontend/.env

# 3. DB and seed
docker-compose up -d
npm run --workspace=backend-nest prisma:migrate dev
npm run --workspace=backend-nest seed

# 4. Run both
npm run start-all
# or in separate terminals:
npm run --workspace=backend-nest start:dev
npm run --workspace=frontend dev
```

### Frontend
- Access: http://localhost:5173 (Vite) or http://localhost:3000 (Create React App)
- API docs: http://localhost:3000/api/docs (Swagger)

## 📋 Checklist for New Developer

- [ ] Clone repo + `npm install`
- [ ] Copy `.env.example` to `.env` (backend-nest and frontend)
- [ ] Run `docker-compose up -d`
- [ ] Run Prisma migrations: `npm run --workspace=backend-nest prisma:migrate dev`
- [ ] Run seed: `npm run --workspace=backend-nest seed`
- [ ] Run backend: `npm run --workspace=backend-nest start:dev`
- [ ] Run frontend: `npm run --workspace=frontend dev`
- [ ] Check: http://localhost:5173 (frontend) and http://localhost:3000/api/docs (Swagger)
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md) for code standards
- [ ] Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for design decisions

## 🐛 Troubleshooting

### "DATABASE_URL not set"
→ Copy `.env.example` to `.env` in `backend-nest/` and fill with valid data

### Port 3000 in use
→ Change `PORT` in `.env` or stop another process: `lsof -i :3000`

### Build fails with TypeScript errors
→ Run `npm run lint-all` to see errors; remove `@ts-nocheck`

### Prisma migrations failed
→ `npm run --workspace=backend-nest prisma:studio` to see DB state

## 📞 Support

- **Issues**: Open on GitHub with clear description
- **Discussions**: Use GitHub Discussions for questions
- **Docs**: Always check this index or the subproject README

## 📅 Important Dates

| Date | Event |
|------|-------|
| Mar 31 2026 | DL Q1: Tests & Documentation |
| Jun 30 2026 | DL Q2: Observability & Security |
| Sep 30 2026 | DL Q3: Performance & Scale |
| Dec 31 2026 | DL Q4: Production Ready |

## 🎯 Next Steps

1. Read [README.md](./README.md) for overview
2. Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for standards
3. Check [Roadmap](./ROADMAP.md) for context
4. Explore subprojects: [backend-nest/README.md](./backend-nest/README.md) and [frontend/README.md](./frontend/README.md)

---

**Last update**: February 2026  
**Maintained by**: Development Team
