<<<<<<< HEAD
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
=======
#  Sistema de Gestão Logística Multi-Tenant

> Plataforma completa de gestão logística desenvolvida para servir múltiplas empresas com isolamento total de dados, controlo de inventário em tempo real e máquina de estados robusta.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)

---

## 📋 Índice

- [Sobre o Projecto](#sobre-o-projecto)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Começar](#começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
- [Estrutura do Projecto](#estrutura-do-projecto)
- [Utilização](#utilização)
- [API Endpoints](#api-endpoints)
- [Estados dos Produtos](#estados-dos-produtos)
- [Permissões](#permissões)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)
- [Roteiro de Desenvolvimento](#roteiro-de-desenvolvimento)
- [Contribuir](#contribuir)


---

## 🎯 Sobre o Projeto

Esta plataforma permite gerir todo o ciclo de vida de produtos num armazém, desde a receção até à entrega final. O sistema foi desenvolvido com arquitetura **multi-tenant**, garantindo que cada empresa opera de forma totalmente isolada e segura.

###  Capturas de Ecrã

<details>
<summary>Ver screenshots</summary>

**Dashboard com Métricas em Tempo Real**
- Resumo do inventário por estado
- Gráficos de distribuição
- Top 5 fornecedores

**Lista de Produtos com Filtros Avançados**
- Pesquisa por código, descrição ou fornecedor
- Filtro por estado, localização e data
- Ordenação e paginação

**Gestão de Fornecedores e Veículos**
- CRUD completo
- Integração com produtos e transportes

**Histórico de Operações**
- Auditoria completa
- Filtros por ação, entidade e utilizador
- Registo de todas as alterações

</details>

---

## ✨ Funcionalidades

###  Autenticação e Segurança
- Sistema multi-tenant com isolamento total de dados
- Três perfis: **Super Admin**, **Administrador** e **Operador**
- Autenticação JWT com refresh tokens
- Proteção contra SQL injection via Prisma ORM

###  Gestão de Inventário
- **CRUD completo** de produtos
- Máquina de estados para controlo do ciclo de vida
- Histórico completo de movimentações
- Rastreabilidade total de cada produto
- Filtros avançados (estado, localização, fornecedor, data)

###  Dashboard Analítico
- Resumo do inventário por estado
- Gráficos de distribuição (donut e barras)
- Estatísticas de movimentações (últimos 30 dias)
- Top 5 fornecedores
- Métricas de desempenho em tempo real

### 🚚 Gestão de Transportes
- Registo de veículos da frota
- Criação e acompanhamento de transportes
- Integração com produtos e estados
- Status: Em Trânsito, Entregue, Cancelado

### 👥 Gestão de Fornecedores
- CRUD completo de fornecedores
- Vinculação com produtos
- Histórico de fornecimentos

### 📜 Auditoria e Histórico
- Registo automático de todas as operações
- Filtros por: data, ação, entidade, utilizador
- Rastreamento completo de alterações
- Logs imutáveis com timestamps

### 🔔 Sistema de Notificações
- Alertas de produtos parados em análise
- Notificações em tempo real
- Histórico de notificações

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | ^5.0 | Superset tipado de JavaScript |
| **Express.js** | ^4.18 | Framework web minimalista |
| **Prisma** | ^5.0 | ORM moderno para Node.js |
| **PostgreSQL** | 15 | Base de dados relacional |
| **JWT** | - | Autenticação stateless |
| **Zod** | ^3.22 | Validação de schemas TypeScript |

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18 | Biblioteca UI |
| **TypeScript** | ^5.0 | Tipagem estática |
| **React Router** | v6 | Roteamento SPA |
| **Tailwind CSS** | ^3.4 | Framework CSS utility-first |
| **Recharts** | ^2.5 | Gráficos para React |
| **Axios** | ^1.6 | Cliente HTTP |
| **React Hot Toast** | - | Notificações toast |

### DevOps
- **Docker** & **Docker Compose**
- **PostgreSQL 15** (containerizado)

---

## 🏗️ Arquitetura

### Padrão Multi-Tenant

```
┌─────────────────────────────────────────┐
│          Frontend (React SPA)           │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│       Backend (Express + TypeScript)    │
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

### Máquina de Estados

```mermaid
stateDiagram-v2
    [*] --> Recebido
    Recebido --> EmAnalise
    EmAnalise --> Aprovado
    EmAnalise --> Rejeitado
    Rejeitado --> EmDevolucao
    Aprovado --> EmArmazenamento
    EmArmazenamento --> EmPreparacao
    EmArmazenamento --> EmExpedicao
    EmPreparacao --> EmExpedicao
    EmPreparacao --> Cancelado
    EmExpedicao --> Entregue
    EmDevolucao --> Recebido
    EmDevolucao --> Eliminado
    Cancelado --> EmArmazenamento
    Entregue --> [*]
    Eliminado --> [*]
```

---

## 🚀 Começar

### Pré-requisitos

Certifica-te de ter instalado:
- **Node.js** 18 ou superior
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (opcional, mas recomendado)
- **PostgreSQL 15** (se não usar Docker)

### Instalação

1. **Clona o repositório**
```bash
git clone https://github.com/teu-usuario/logistica-multi-tenant.git
cd logistica-multi-tenant
```

2. **Instala as dependências**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### Configuração

1. **Variáveis de Ambiente**

Cria um ficheiro `.env` na pasta `backend/`:

```env
# Ambiente
NODE_ENV=development

# Servidor
PORT=3000

# Base de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logistica

# JWT
JWT_SECRET=sua-chave-secreta-super-segura-minimo-32-caracteres-aleatorios
JWT_EXPIRES_IN=7d

# CORS (opcional)
CORS_ORIGIN=http://localhost:3000
```

2. **Base de Dados com Docker (Recomendado)**

```bash
# Inicia o PostgreSQL
docker-compose up -d

# Executa as migrações
cd backend
npx prisma migrate dev
npx prisma generate
```

**Ou sem Docker:**

```bash
# Cria a base de dados manualmente no PostgreSQL
createdb logistica

# Executa as migrações
cd backend
npx prisma migrate dev
npx prisma generate
```

3. **Seed da Base de Dados (Opcional)**

```bash
cd backend
npm run seed
```

Isto cria:
- 1 Super Admin
- 1 Empresa exemplo
- 1 Administrador
- 1 Operador
- Alguns produtos de teste

### Executar a Aplicação

**Modo Desenvolvimento:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

**Modo Produção:**

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve a pasta build/ com nginx ou outro servidor
```

### Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (execute `npx prisma studio`)

---

## 📁 Estrutura do Projeto

```
logistica-multi-tenant/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Schema da BD
│   │   ├── migrations/            # Migrações
│   │   └── seed.ts                # Dados iniciais
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # Configuração Prisma
│   │   │   └── env.ts             # Variáveis de ambiente
│   │   ├── controllers/           # Controladores de rotas
│   │   │   ├── auth.controller.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── suppliers.controller.ts
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── transports.controller.ts
│   │   │   ├── auditlog.controller.ts
│   │   │   └── notifications.controller.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── roleCheck.middleware.ts
│   │   │   └── superAdmin.middleware.ts
│   │   ├── routes/               # Definição de rotas
│   │   ├── services/             # Lógica de negócio
│   │   │   └── product-state.service.ts
│   │   ├── types/                # Tipos TypeScript
│   │   │   ├── express.d.ts
│   │   │   └── product-states.ts
│   │   ├── utils/                # Utilitários
│   │   └── server.ts             # Entry point
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts            # Cliente Axios
│   │   ├── components/           # Componentes React
│   │   │   ├── CompanyModal.tsx
│   │   │   ├── EditGlobalUserModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NotificationPanel.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── ProductHistoryModal.tsx
│   │   │   ├── StateTransition.tsx
│   │   │   └── UserFormModal.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # Contexto de autenticação
│   │   ├── pages/                # Páginas/Rotas
│   │   │   ├── AuditLog.tsx
│   │   │   ├── CompanyManagement.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardAdvanced.tsx
│   │   │   ├── GlobalUserManagement.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NewProduct.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   ├── SupplierList.tsx
│   │   │   ├── TransportList.tsx
│   │   │   └── VehicleList.tsx
│   │   ├── App.tsx               # Componente raiz
│   │   ├── index.tsx             # Entry point
│   │   └── index.css             # Estilos globais
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docker/
│   └── postgres/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 📖 Utilização

### 🎬 Fluxo Básico de Operação

#### 1. Registo da Empresa

1. Acede a **http://localhost:3000/register**
2. Preenche:
   - Nome da empresa
   - NIF
   - Email, telefone, morada
   - Dados do utilizador administrador
3. Após registo, faz login com as credenciais criadas

#### 2. Login

- **URL**: http://localhost:3000/login
- Credenciais de teste (após seed):
  - **Admin**: `admin@exemplo.pt` / `admin123`
  - **Operador**: `operador@exemplo.pt` / `operador123`

#### 3. Adicionar Produto

1. Vai a **Produtos** → **Novo Produto**
2. Preenche os dados obrigatórios:
   - Código único
   - Descrição
   - Quantidade e unidade
   - Fornecedor
   - Localização (opcional)
   - Observações (opcional)
3. O produto é criado automaticamente no estado **Recebido**

#### 4. Gerir Estados

1. Na lista de produtos, clica num produto
2. Clica em **Alterar Estado**
3. Seleciona o próximo estado permitido (transições validadas automaticamente)
4. Adiciona observações se necessário
5. Confirma a transição

**Exemplo de Fluxo:**
```
Recebido → Em Análise → Aprovado → Em Armazenamento → 
Em Preparação → Em Expedição → Entregue
```

#### 5. Consultar Histórico

- Clica num produto para ver todas as movimentações
- Ou vai a **Histórico** para ver todas as operações do sistema
- Filtra por data, ação, entidade ou utilizador

#### 6. Dashboard

- Acede ao **Dashboard** para:
  - Ver resumo do inventário por estado
  - Analisar distribuição com gráficos
  - Monitorizar movimentações recentes
  - Identificar produtos parados há mais tempo

---

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registo de empresa e admin |  |
| POST | `/api/auth/login` | Login |  |
| GET | `/api/auth/me` | Dados do utilizador |  |

### Produtos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/products` | Lista produtos |  |
| GET | `/api/products/:id` | Detalhes de um produto |  |
| POST | `/api/products` | Criar produto |  |
| PUT | `/api/products/:id` | Atualizar produto |  |
| DELETE | `/api/products/:id` | Eliminar produto |  Admin |
| POST | `/api/products/:id/transition` | Alterar estado |  |
| GET | `/api/products/:id/history` | Histórico de movimentações |  |

### Dashboard

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/dashboard/stats` | Estatísticas gerais |  |
| GET | `/api/dashboard/by-status` | Distribuição por estado |  |

### Fornecedores

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/suppliers` | Lista fornecedores |  |
| POST | `/api/suppliers` | Criar fornecedor |  |
| PUT | `/api/suppliers/:id` | Atualizar fornecedor |  |
| DELETE | `/api/suppliers/:id` | Eliminar fornecedor |  Admin |

### Veículos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/vehicles` | Lista veículos |  |
| POST | `/api/vehicles` | Criar veículo |  |
| PUT | `/api/vehicles/:id` | Atualizar veículo |  |
| DELETE | `/api/vehicles/:id` | Eliminar veículo |  Admin |

### Transportes

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/transports` | Lista transportes |  |
| POST | `/api/transports` | Criar transporte |  |
| PUT | `/api/transports/:id` | Atualizar transporte |  |
| DELETE | `/api/transports/:id` | Eliminar transporte |  Admin |

### Auditoria

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/auditlog` | Lista logs de auditoria |  |

### Notificações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/notifications` | Lista notificações |  |
| PUT | `/api/notifications/:id/read` | Marcar como lida |  |
| PUT | `/api/notifications/read-all` | Marcar todas como lidas |  |

---

## 🔄 Estados dos Produtos

### Estados Disponíveis

| Estado | Descrição | Próximos Estados Permitidos |
|--------|-----------|----------------------------|
| **Recebido** | Produto acabado de chegar ao armazém | Em Análise |
| **Em Análise** | Produto a ser inspecionado | Aprovado, Rejeitado |
| **Aprovado** | Produto aprovado para armazenamento | Em Armazenamento |
| **Rejeitado** | Produto não conforme | Em Devolução |
| **Em Armazenamento** | Produto guardado no armazém | Em Preparação, Em Expedição |
| **Em Preparação** | Produto a ser preparado para envio | Em Expedição, Cancelado |
| **Em Expedição** | Produto em transporte | Entregue |
| **Entregue** | Produto entregue ao cliente (final) | - |
| **Em Devolução** | Produto em processo de devolução | Recebido, Eliminado |
| **Cancelado** | Preparação cancelada | Em Armazenamento |
| **Eliminado** | Produto descartado (final) | - |

### Regras de Transição

- **Apenas transições válidas** são permitidas (validadas no backend)
- Alguns estados requerem **observações obrigatórias**
- O histórico de transições é **imutável** e sempre registado
- Permissões são verificadas antes de cada transição

---

##  Permissões

### Super Admin

**Acesso total ao sistema:**
- Gestão de todas as empresas
- Criação de novos utilizadores globais
- Acesso a dashboards agregados
- Configurações do sistema

### Administrador (por empresa)

**Acesso total dentro da sua empresa:**
- Aprovar ou rejeitar produtos
- Alterar qualquer estado
- Gerir utilizadores da empresa
- Aceder a todos os módulos
- Eliminar produtos, fornecedores, veículos

### Operador (por empresa)

**Acesso restrito:**
- Gerir inventário e movimentações
- **Não pode** aprovar ou rejeitar produtos
- **Não pode** eliminar registos
- Acesso limitado a determinadas transições de estado

---

## 💻 Guia de Desenvolvimento

### Antes de Programar

📖 **Lê o documento de requisitos 3 vezes:**

1. **Primeira leitura**: Compreender o âmbito geral
2. **Segunda leitura**: Destacar campos obrigatórios, transições, regras de negócio
3. **Terceira leitura**: Fazer anotações sobre implementação

### Planear Antes de Codificar

Desenha no papel ou ferramenta visual:

1. **Estrutura da Base de Dados**
   - Tabelas e campos
   - Relações (FK)
   - Índices importantes
   - ⚠️ Não esquecer `companyId` em tabelas multi-tenant

2. **Fluxo de Estados**
   - Diagrama com todos os estados
   - Setas com transições permitidas
   - Quem pode fazer cada transição

3. **Estrutura de Pastas**
   - Controllers, services, routes
   - Componentes React
   - Organização lógica

4. **Ecrãs da Aplicação**
   - Rascunho de cada página
   - Posição de filtros, tabelas, formulários

### Executar Testes

```bash
cd backend
npm test
```

### Gerar Migração Prisma

```bash
cd backend
npx prisma migrate dev --name nome_da_migracao
```

### Visualizar Base de Dados

```bash
cd backend
npx prisma studio
```

Acede a http://localhost:5555

### Boas Práticas

-  Sempre validar input com Zod
-  Sempre filtrar por `companyId` em queries multi-tenant
-  Registar operações importantes no audit log
-  Usar transações Prisma para operações complexas
-  Escrever testes para lógica crítica
-  Documentar endpoints na API
-  Usar variáveis de ambiente para secrets

---

## 🗺️ Roadmap

### Fase 1 - Concluído 
- [x] Sistema multi-tenant
- [x] Autenticação JWT
- [x] CRUD de produtos
- [x] Máquina de estados
- [x] Dashboard básico
- [x] Histórico de operações

### Fase 2 - Concluído 
- [x] Gestão de fornecedores
- [x] Gestão de veículos
- [x] Gestão de transportes
- [x] Sistema de notificações
- [x] Dashboard avançado
- [x] Super Admin

### Fase 3 - Em Desenvolvimento 🚧
- [ ] Relatórios avançados em PDF
- [ ] Exportação de dados (Excel, CSV)
- [ ] Integração com APIs de transportadoras
- [ ] Sistema de alertas configurável
- [ ] Mobile app (React Native)

### Fase 4 - Planeado 📋
- [ ] Integração entre empresas
- [ ] Marketplace de transportes
- [ ] BI e análise preditiva
- [ ] Integração com ERP
- [ ] API pública para terceiros

---

## 🤝 Contribuir

Contribuições são bem-vindas! Este projeto foi desenvolvido para a comunidade **Commit PT** no Discord.

1. Faz fork do projeto
2. Cria uma branch para a tua feature (`git checkout -b feature/MinhaFeature`)
3. Commit as alterações (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abre um Pull Request

### Diretrizes

- Segue o estilo de código existente
- Adiciona testes para novas funcionalidades
- Atualiza a documentação conforme necessário
- Mantém commits pequenos e focados



## 📄 Licença

Este projeto está sob a licença MIT. Vê o ficheiro [LICENSE](LICENSE) para mais detalhes.

---


---

## 📞 Suporte

Se encontraste algum problema ou tens sugestões:

1. Verifica as [Issues](**vou adicionar quando acabar**) existentes
2. Cria uma nova issue se necessário
3. Contactar o criador




**Desenvolvido com pelo gonçalo coimbra**
>>>>>>> 184ecd699527caa52863a9b7d8f940f05749b654
