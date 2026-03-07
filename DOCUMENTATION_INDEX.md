# Índice de Documentação

Bem-vindo! Abaixo está um guia completo da documentação disponível no projeto.

## 📚 Documentação Geral

| Documento | Objetivo |
|-----------|----------|
| [README.md](./README.md) | Visão geral do projeto, stack, features e quickstart |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guia para contribuidores - como fazer PR, padrões de código |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Código de conduta e políticas de convivência |
| [CHANGELOG.md](./CHANGELOG.md) | Histórico de mudanças e versões |
| [ROADMAP.md](./ROADMAP.md) | Plano de desenvolvimento por trimestres (Q1-Q4 2026) |

## 🏗️ Arquitetura e Decisões

| Documento | Objetivo |
|-----------|----------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Estrutura de monorepo, decisão backend vs backend-nest, tecnologias |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deploy em Docker, Kubernetes, Helm, backup, rollback |
| [docs/UX_UI.md](./docs/UX_UI.md) | Design system, padrões de componentes, acessibilidade, temas |

## 📖 Guias por Projeto

### Backend (NestJS)
| Arquivo | Conteúdo |
|---------|----------|
| [backend-nest/README.md](./backend-nest/README.md) | Setup, estrutura de módulos, API docs, testes |
| [backend-nest/.env.example](./backend-nest/.env.example) | Variáveis de ambiente obrigatórias |
| [backend-nest/prisma/schema.prisma](./backend-nest/prisma/schema.prisma) | Modelo de dados (Prisma) |

### Frontend (React)
| Arquivo | Conteúdo |
|---------|----------|
| [frontend/README.md](./frontend/README.md) | Setup, estrutura, testes React, integração API |
| [frontend/.env.example](./frontend/.env.example) | Variáveis de ambiente |
| [frontend/tailwind.config.js](./frontend/tailwind.config.js) | Customizações de tema Tailwind |

### Backend Legado (Express)
| Arquivo | Conteúdo |
|---------|----------|
| [backend/README.md](./backend/README.md) | ⚠️ Deprecado - apenas referência histórica |

## 🔧 Configuração e Ferramentas

### Variaveis de Ambiente
- Criar `.env` a partir de `.env.example` em cada subprojeto
- Essenciais: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`

### Monorepo (npm workspaces)
```bash
npm install              # Instala todos os pacotes
npm run lint-all         # Lint em backend-nest e frontend
npm run test-all         # Testes em ambos
npm run build-all        # Build em ambos
npm run format-all       # Prettier em ambos
```

### CI/CD
- Pipeline: [.github/workflows/ci.yml](./.github/workflows/ci.yml)
- Roda automaticamente: lint, tests, build
- Suporta: Node.js 20+

### Git Hooks
- **Husky** + **lint-staged**: Pre-commit hooks automáticos
- Configuração: [.husky/](./.husky/) e `lint-staged` em [package.json](./package.json)

## 🚀 Inicialização Rápida

### Desenvolvimento Local

```bash
# 1. Clonar e instalar
git clone <repo>
cd logistica-multi-tenant
npm install

# 2. Configurar ambiente
cp backend-nest/.env.example backend-nest/.env
cp frontend/.env.example frontend/.env

# 3. BD e seed
docker-compose up -d
npm run --workspace=backend-nest prisma:migrate dev
npm run --workspace=backend-nest seed

# 4. Rodarda ambos
npm run start-all
# ou em terminais separados:
npm run --workspace=backend-nest start:dev
npm run --workspace=frontend dev
```

### Frontend
- Acesso: http://localhost:5173 (Vite) ou http://localhost:3000 (Create React App)
- API docs: http://localhost:3000/api/docs (Swagger)

## 📋 Checklist para Novo Desenvolvedor

- [ ] Clonar repo + `npm install`
- [ ] Copiar `.env.example` para `.env` (backend-nest e frontend)
- [ ] Rodar `docker-compose up -d`
- [ ] Executar migrações Prisma: `npm run --workspace=backend-nest prisma:migrate dev`
- [ ] Executar seed: `npm run --workspace=backend-nest seed`
- [ ] Rodar backend: `npm run --workspace=backend-nest start:dev`
- [ ] Rodar frontend: `npm run --workspace=frontend dev`
- [ ] Verificar: http://localhost:5173 (frontend) e http://localhost:3000/api/docs (Swagger)
- [ ] Ler [CONTRIBUTING.md](./CONTRIBUTING.md) para padrões de código
- [ ] Ler [ARCHITECTURE.md](./docs/ARCHITECTURE.md) para decisões de design

## 🐛 Troubleshooting

### "DATABASE_URL not set"
→ Copiar `.env.example` para `.env` em `backend-nest/` e preencher com dados válidos

### Porta 3000 em uso
→ Mudar `PORT` em `.env` ou parar outro processo: `lsof -i :3000`

### Build falha com TypeScript errors
→ Rodar `npm run lint-all` para ver erros; remover `@ts-nocheck`

### Migrações Prisma falharam
→ `npm run --workspace=backend-nest prisma:studio` para ver estado da BD

## 📞 Suporte

- **Issues**: Abrir no GitHub com descrição clara
- **Discussões**: Usar GitHub Discussions para perguntas
- **Docs**: Sempre verificar este índice ou o README do subprojeto

## 📅 Datas Importantes

| Data | Evento |
|------|--------|
| 31 Mar 2026 | DL Q1: Testes & Documentação |
| 30 Jun 2026 | DL Q2: Observabilidade & Segurança |
| 30 Set 2026 | DL Q3: Performance & Escala |
| 31 Dez 2026 | DL Q4: Produção Ready |

## 🎯 Próximos Passos

1. Ler [README.md](./README.md) para visão geral
2. Seguir [CONTRIBUTING.md](./CONTRIBUTING.md) para padrões
3. Consultar [Roadmap](./ROADMAP.md) para contexto
4. Explorar subprojetos: [backend-nest/README.md](./backend-nest/README.md) e [frontend/README.md](./frontend/README.md)

---

**Última atualização**: Fevereiro 2026  
**Mantido por**: Equipe de Desenvolvimento
