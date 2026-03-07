# Quick Start Guide

Guia rápido para começar a trabalhar no projeto em 5 minutos.

## 1️⃣ Clone e Instale (1 minuto)

```bash
# Clone
git clone https://github.com/seu-repo/logistica-multi-tenant.git
cd logistica-multi-tenant

# Instale tudo (monorepo)
npm install
```

## 2️⃣ Configurar Ambiente (2 minutos)

```bash
# Backend
cp backend-nest/.env.example backend-nest/.env
# Editar .env se necessário (DATABASE_URL, JWT_SECRET)

# Frontend  
cp frontend/.env.example frontend/.env
```

## 3️⃣ Base de Dados (1 minuto)

```bash
# Subir Postgres com Docker Compose
docker-compose up -d

# Rodar migrações
npm run --workspace=backend-nest prisma:migrate dev

# Seed (dados de teste)
npm run --workspace=backend-nest seed
```

## 4️⃣ Rodara a Aplicação (1 minuto)

**Opção A: Em terminais separados**

```bash
# Terminal 1 - Backend
npm run --workspace=backend-nest start:dev

# Terminal 2 - Frontend
npm run --workspace=frontend dev
```

**Opção B: Concorrente (os dois juntos)**

```bash
npm run start-all
```

## ✅ Validação

- **Frontend**: http://localhost:5173 (Vite) ou http://localhost:3000 (React Scripts)
- **Backend**: http://localhost:3000 (com /api prefix)
- **API Docs**: http://localhost:3000/api/docs (Swagger)
- **Health Check**: http://localhost:3000/api/health

Deverá ver JSON: `{"status":"ok","timestamp":"..."}`

## 📁 Próximas Leituras

| Quando | Leia |
|--------|------|
| Desenvolvendo | [backend-nest/README.md](./backend-nest/README.md) |
| Contribuindo | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Dúvida estrutura | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Testes | [TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md) |
| Deploy | [DEPLOYMENT.md](./docs/DEPLOYMENT.md) |

## 🛠️ Comandos Úteis

```bash
# Lint (checar código)
npm run lint-all

# Format (arrumar código)
npm run format-all

# Testes
npm run test-all

# Build
npm run build-all

# Limpar código e dependências
npm run format-all && npm run lint-all

# Ver status do Prisma
npm run --workspace=backend-nest prisma:studio

# Resetar BD (cuidado!)
npm run --workspace=backend-nest prisma migrate reset
```

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Port 3000 em uso | Mude em `.env` ou kill outro processo |
| DATABASE_URL error | Copiar `.env.example` → `.env` e preencher |
| Migrações falharam | `rm prisma/dev.db` (SQLite) ou resetar BD |
| Imports não encontram módulos | Rodar `npm install` novamente |
| Frontend não carrega API | Verificar `REACT_APP_API_URL` em `.env` |

## 📞 Ajuda

1. Consulte [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
2. Procure na seção Troubleshooting dos READMEs específicos
3. Abra uma issue no GitHub

---

**Tempo total estimado**: 5-10 minutos ⏱️
