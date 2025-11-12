 Sistema de Gestão Logística Multi-Tenant

Sistema completo de gestão logística desenvolvido para servir múltiplas empresas através de uma plataforma centralizada. Cada empresa opera de forma totalmente isolada, garantindo segurança e privacidade dos dados.

 Descrição

Esta plataforma permite gerir todo o ciclo de vida de produtos num armazém, desde a receção até à entrega final. O sistema inclui controlo de inventário, gestão de estados dos produtos, rastreabilidade completa e dashboard com estatísticas em tempo real.

 Antes de Começar - Importante!

Lê o documento de requisitos (PDF) pelo menos 3 vezes. Esta é a parte mais importante do projeto.

 Primeira Leitura
Lê tudo de forma corrida para perceberes o âmbito geral do projeto. Não te preocupes em decorar tudo, apenas tenta perceber o que é pedido.

 Segunda Leitura
Agora sublinha ou destaca:
- Todos os campos obrigatórios de cada entidade (produtos, utilizadores, etc.)
- As transições de estado permitidas
- As regras de negócio (quem pode fazer o quê)
- Os filtros necessários (por estado, localização, fornecedor)
- As validações e permissões

 Terceira Leitura
Faz anotações sobre:
- Como vais implementar cada funcionalidade
- Que endpoints da API vais precisar
- Que componentes React vais criar
- Questões ou dúvidas que surjam

 Planear Antes de Programar

Antes de escrever uma linha de código, pega num papel, no Paint, no Excalidraw ou noutra ferramenta qualquer e desenha:

1. Estrutura da Base de Dados
   - Que tabelas vais ter?
   - Que campos em cada tabela?
   - Que relações entre tabelas?
   - Não te esqueças do `company_id` em todas as tabelas de negócio!

2. Fluxo de Estados
   - Desenha um diagrama com todos os estados
   - Liga-os com setas mostrando as transições permitidas
   - Anota ao lado de cada transição: quem pode fazer e que dados são obrigatórios

3. Estrutura de Pastas
   - Como vais organizar o código?
   - Que controllers, services e routes vais precisar?
   - Que componentes React vais criar?

4. Ecrãs da Aplicação
   - Faz um rascunho rápido de cada página
   - Onde ficam os filtros?
   - Como mostrar a tabela de produtos?
   - Como fazer o formulário de mudança de estado?

Exemplo prático: Quando leres sobre os filtros na secção 2.2.6, já deves estar a pensar: "vou precisar de dropdowns no frontend para , um input de pesquisa para localização, outro dropdown para fornecedor". Depois desenhas onde vão ficar esses filtros no ecrã e como vais implementá-los.

Este planeamento inicial poupa-te horas de refactoring e retrabalho. É muito mais fácil mudar um desenho no Paint do que reescrever código.

 Tecnologias Utilizadas

 Backend
- Node.js com TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Zod para validação

 Frontend
- React 18 com TypeScript
- React Router v6
- Tailwind CSS
- Recharts para gráficos
- Axios para comunicação com a API

 Infraestrutura
- Docker & Docker Compose
- PostgreSQL 15

 Funcionalidades Principais

 Gestão de Utilizadores
- Sistema multi-tenant com isolamento total de dados
- Dois perfis: Administrador e Operador
- Autenticação JWT

Gestão de Inventário
- CRUD completo de produtos
- Máquina de estados para controlo do ciclo de vida
- Histórico completo de movimentações
- Rastreabilidade total de cada produto

 Estados dos Produtos
O sistema implementa uma máquina de estados que controla as transições permitidas:

- Recebido → Em Análise
- Em Análise → Aprovado / Rejeitado
- Rejeitado → Em Devolução
- Aprovado → Em Armazenamento
- Em Armazenamento → Em Preparação / Em Expedição
- Em Preparação → Em Expedição / Cancelado
- Em Expedição → Entregue
- Entregue (estado final)
- Em Devolução → Recebido / Eliminado
- Eliminado (estado final)
- Cancelado → Em Armazenamento

 Dashboard
- Resumo do inventário por estado
- Gráficos de distribuição
- Estatísticas de movimentações
- Métricas de desempenho

 Estrutura do Projeto

```
logistica-multi-tenant/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

 Instalação e Configuração

 Requisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (ou usar o container Docker)

 Configuração

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd logistica-multi-tenant
```

2. Configure as variáveis de ambiente:

Crie um ficheiro `.env` na pasta `backend/`:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logistica
JWT_SECRET=sua-chave-secreta-minimo-32-caracteres
```

3. Inicie os containers Docker:
```bash
docker-compose up -d
```

4. Execute as migrações da base de dados:
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
```

5. Inicie o backend:
```bash
npm run dev
```

6. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm install
npm start
```

 Acesso ao Sistema

 Desenvolvimento
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Base de Dados: localhost:5432

 Credenciais de Teste

Após executar o seed inicial:

Administrador:
- Email: admin@exemplo.pt
- Password: admin123

Operador:
- Email: operador@exemplo.pt
- Password: operador123

 Utilização

 Fluxo Básico de Operação

1. Registo da Empresa
   - Aceda à página de registo
   - Preencha os dados da empresa e do utilizador administrador

2. Login
   - Aceda com as credenciais criadas

3. Adicionar Produto
   - Vá a "Produtos" → "Novo Produto"
   - Preencha os dados: código, descrição, quantidade, fornecedor, etc.
   - O produto é criado no estado "Recebido"

4. Gerir Estados
   - Na lista de produtos, clique em "Alterar Estado"
   - Selecione o próximo estado permitido
   - Adicione observações se necessário
   - Apenas transições válidas são permitidas

5. Consultar Histórico
   - Aceda aos detalhes de cada produto
   - Visualize todas as movimentações e alterações

6. Dashboard
   - Acompanhe métricas em tempo real
   - Analise distribuição por estado
   - Monitore movimentações recentes

 Regras de Negócio

 Permissões

Super-Admin

Acesso a todo



Administrador:
- Acesso total ao sistema
- Pode aprovar ou rejeitar produtos
- Pode alterar qualquer estado
- Acede a todos os módulos

Operador:
- Gere inventário e movimentações
- Não pode aprovar ou rejeitar produtos
- Acesso restrito a determinadas transições

 Validações

- Todas as transições de estado são validadas
- Dados obrigatórios variam conforme a transição
- Histórico completo é sempre registado
- Isolamento multi-tenant em todas as operações

 API Endpoints

 Autenticação
- `POST /api/auth/register` - Registo de empresa e utilizador
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do utilizador autenticado

 Produtos
- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Detalhes de um produto
- `POST /api/products` - Criar novo produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Eliminar produto
- `POST /api/products/:id/transition` - Alterar estado do produto
- `GET /api/products/:id/history` - Histórico de movimentações

 Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/by-status` - Distribuição por estado

 Desenvolvimento

 Executar Testes
```bash
cd backend
npm test

 Gerar Migração Prisma
```bash
npx prisma migrate dev --name nome_da_migracao
```

 Visualizar Base de Dados
```bash
npx prisma studio
```

 Segurança

- Autenticação JWT obrigatória em todos os endpoints
- Isolamento multi-tenant através de `companyId`
- Validação de permissões em cada operação
- Proteção contra SQL injection via Prisma
- Validação de input com Zod

 Notas Importantes

- O sistema garante isolamento total entre empresas
- Todas as queries são automaticamente filtradas por `companyId`
- O histórico de movimentações é imutável
- Transições de estado seguem regras rígidas de validação

Próximas Melhorias

- [ ] Módulo de fornecedores
- [ ] Gestão de transportes e veículos
- [ ] Integração entre empresas
- [ ] Sistema de notificações
- [ ] Relatórios avançados em PDF
- [ ] Auditoria detalhada de ações



PS:Este projeto foi desenvolvido para uma comunidade(Commit PT) no discord onde várias pessoas podiam fazer e servir para portfolio 




