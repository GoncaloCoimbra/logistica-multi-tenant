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

## ✅ Melhorias necessárias para chegar a 10/10

Abaixo está uma lista das mudanças que elevam cada categoria à perfeição. Algumas delas já estão parcialmente implementadas; outras requerem trabalho adicional.

### Estrutura de Código (atualmente 8/10)
1. **Depreciar e remover `backend`**. A base activa é `backend-nest`; mantenha o diretório Express apenas por compatibilidade até eliminar. Documentação clara sobre a decisão está acima.
2. Adotar um monorepo com workspaces (já iniciado) e scripts de automação.
3. Eliminar arquivos desnecessários e adicionar `CONTRIBUTING.md` e `CODE_OF_CONDUCT.md`.
4. Garantir que todos os caminhos de importação usem `tsconfig-paths` e não existam `@ts-nocheck`.

### Backend (arquitetura, testes) – 8/10
1. Completar cobertura de testes para 100 % (incluir casos de erro, validações e middlewares).
2. Implementar mocks nos testes e separar unitários de e2e.
3. Criar pipelines de CI (GitHub Actions) que rodem lint, build, tests e prisma migrate.
4. Adicionar documentação de API automática (Swagger) com exemplos válidos.
5. Validar existence de `DATABASE_URL` e mostrar erro amigável se ausente.
6. Consolidar build/serviço Docker (incluindo `backend-nest` na compose) e `k8s` Helm chart com readiness/liveness.

### Frontend – 7/10
1. Escrever testes de componentes e de fluxo com React Testing Library e end‑to‑end com Cypress ou Playwright.
2. Melhorar organização de pastas (separar “pages” e “components” com index.tsx que exporta) e aplicar pattern atomic design.
3. Configurar Storybook para visualizar componentes isolados.
4. Garantir que todas as chamadas Axios manipulem erros e exibam loaders.
5. Adicionar lint/format (ESLint + Prettier) e hooks pre‑commit (`husky`).

### Documentação – 8/10
1. Completar README principal (feito acima) e adicionar guias específicos (`docs/UX`, `docs/DEPLOYMENT.md`).
2. Incluir capturas de ecrã reais, diagramas de arquitetura e instruções de configuração de ambiente (cloud, k8s).
3. Fornecer changelog e roteiro de funcionalidades futuras.
4. Escrever documentação de design de API (OpenAPI/Swagger) e de uso do frontend (páginas explicadas).

### UX/UI – 6/10 (estimado)
1. Realizar testes de usabilidade com utilizadores reais para identificar pontos de fricção.
2. Criar um design system ou utilizar uma biblioteca (Tailwind + componente customizados) com tokens de cor, tipografia e espaçamento.
3. Garantir responsividade em todos os tamanhos de ecrã e implementar dark mode.
4. Auditar e corrigir problemas de acessibilidade (ARIA roles, contraste, navegação por teclado).
5. Documentar fluxo de navegação e estados (loading, error, vazio).

### Estado “produtivo” – 6/10
1. Adicionar monitorização (Prometheus + Grafana, ou Sentry) e logging estruturado no backend.
2. Implementar estratégia de deploy (scripts Terraform/Helm) e instruções para rollback.
3. Incluir política de backups, migrações automatizadas e testes de carga.
4. Habilitar HTTPS, CORS estrito, proteção CSRF e revisão de segurança.
5. Configurar CI/CD que constrói imagens Docker e publica em registry.
6. Automatizar geração de artefatos (bundle analysis, minimização, análises de performance).

---

## 📚 Documentação

Referências principais:

- **Backend**: NestJS + Prisma ORM
- **Frontend**: React moderno com Vite
- **DevOps**: Docker Compose + Kubernetes-ready

---

## 🤝 Contribuindo

1. Abra uma issue antes de começar um trabalho extenso.
2. Crie branches de feature com `feature/descricao` ou `bugfix/descricao`.
3. Execute testes antes de submeter PR.
4. Escreva testes para qualquer funcionalidade nova ou bug corrigido.

---

## 🎯 Próximos Passos

- Completar test suite (unit, integration, e2e)
- Adicionar Swagger docs automático
- Implementar GitHub Actions CI/CD
- Deploy em staging (Kubernetes)
- Documentação de segurança e audits

Boa sorte e bom trabalho! 😊
