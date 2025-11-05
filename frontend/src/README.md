# 🏢 Sistema de Gestão Logística Multi-Tenant

Sistema completo de gestão de inventário e logística para múltiplas empresas (multi-tenant), com controlo de estados, histórico de movimentações e dashboard de métricas.

---

 📋 Funcionalidades Principais

  Gestão de Empresas e Utilizadores
- Registo de empresas independentes
- Multi-tenant com isolamento total de dados
- Perfis: **Administrador** e **Operador**
- Autenticação JWT segura

 Gestão de Inventário
- CRUD completo de produtos
- Máquina de estados com 11 estados diferentes
- Histórico completo de movimentações
- Filtros por estado, fornecedor e localização
- Validação de transições de estado

 Estados do Produto
1. **Recebido** → Produto chegou ao armazém
2. **Em análise** → A ser verificado
3. **Rejeitado** → Não conforme
4. **Aprovado** → Validado para armazenamento
5. **Em armazenamento** → Guardado no armazém
6. **Em preparação** → A ser embalado
7. **Em expedição** → Em transporte
8. **Entregue** → Chegou ao destino
9. **Em devolução** → Devolvido ao fornecedor
10. **Eliminado** → Descartado
11. **Cancelado** → Envio cancelado

 Dashboard e Métricas
- Total de produtos
- Produtos em armazenamento
- Entregas realizadas
- Movimentações dos últimos 30 dias
- Gráficos de distribuição por estado
- Top 5 fornecedores

 Gestão de Fornecedores
- CRUD de fornecedores (backend completo)
- Associação produtos ↔ fornecedores
- Histórico de produtos por fornecedor

---

  Como Executar o Projeto

 Pré-requisitos
- Docker Desktop instalado
- Node.js 18+ (opcional, para desenvolvimento)

 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd LOGISTICA-MULTI-TENANT
```

 2. Configurar variáveis de ambiente

**Backend (.env no backend):**
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/logistica"
JWT_SECRET="seu-secret-super-secreto-aqui"
PORT=5000
```

**Frontend (.env no frontend):**
```env
VITE_API_URL=http://localhost:5000
```

 3. Executar com Docker
```bash
# Iniciar todos os serviços
docker-compose up --build

# Aguardar até ver:
# ✓ Backend rodando na porta 5000
# ✓ Frontend rodando na porta 5173
# ✓ PostgreSQL rodando na porta 5432

 4. Aceder à aplicação

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000



 Credenciais de Teste

 Conta Administrador

Email: admin@empresa.com
Password: Admin123!

 Conta Operador

Email: operador@empresa.com
Password: Operador123!




  Fluxo Operacional Básico

 1. Registar Empresa e Utilizador
1. Acede a `/register`
2. Preenche: Nome da Empresa, Nome, Email, Password
3. Faz login com as credenciais criadas

 2. Adicionar Produto
1. Acede a **"Produtos"** no menu
2. Clica em **"Novo Produto"**
3. Preenche todos os campos obrigatórios
4. O produto é criado no estado **"Recebido"**

 3. Alterar Estado do Produto
1. Na lista de produtos, clica em **"Ver Detalhes"**
2. Na secção **"Transição de Estado"**, escolhe o próximo estado
3. Preenche dados obrigatórios (se aplicável)
4. Clica em **"Alterar Estado"**
5. O histórico é automaticamente registado

 4. Consultar Dashboard
1. Acede ao **"Dashboard"**
2. Visualiza métricas em tempo real
3. Analisa gráficos de distribuição


 Arquitetura Técnica

 Backend
- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Arquitetura MVC**

 Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Recharts** (gráficos)
- **Lucide React** (ícones)

 Infraestrutura
- **Docker + Docker Compose**
- **Multi-stage builds**
- **Hot reload em desenvolvimento**


Estrutura do Projeto

LOGISTICA-MULTI-TENANT/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

  Segurança

- Autenticação JWT obrigatória
- Filtragem automática por `company_id` em todas as queries
- Validação de permissões por perfil (Admin/Operador)
- Validação de input em todas as rotas
- Isolamento total de dados entre empresas

---

 Regras de Negócio

 Transições de Estado
- **Apenas Administradores** podem aprovar produtos
- **Operadores** podem receber, preparar e expedir
- Certas transições exigem dados obrigatórios (ex: motivo de rejeição)
- Todas as transições geram registo no histórico

 Multi-Tenancy
- Cada empresa tem `company_id` único
- Todas as queries são automaticamente filtradas
- Utilizadores só vêem dados da sua empresa



 estes
bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test


  Scripts Úteis

 Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run migrate      # Executar migrações
npm run seed         # Popular base de dados
```

 Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build



 Troubleshooting

 Erro: "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

 Erro: "Cannot connect to database"
```bash
# Verificar se o PostgreSQL está a correr
docker ps

# Reiniciar serviços
docker-compose down
docker-compose up --build
```

 Limpar tudo e recomeçar
```bash
docker-compose down -v
docker-compose up --build
```

---

 Níveis de Implementação

  Nível Básico (100%)
- Autenticação funcional
- Multi-tenant
- CRUD de produtos
- Estados base
- Docker
  Nível Intermédio (95%)
- Máquina de estados com regras
- Histórico de movimentações
- Perfis de utilizador
- Frontend consumindo API
- Dashboard com métricas

  Nível Avançado (Parcial)
- Logs e auditoria (backend completo)
- Dashboard com gráficos
- Gestão de fornecedores (backend)



 Autor
Desenvolvido como projeto de avaliação de competências Full Stack.


Licença
Este projeto é propriedade académica.