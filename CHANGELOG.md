# Changelog

Todos as mudanças notáveis neste projeto estão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/), e o projeto adota [Semantic Versioning](https://semver.org/).

## [Não lançado]

### Added
- Monorepo com npm workspaces (`backend-nest`, `frontend`)
- Scripts globais: `npm run lint-all`, `test-all`, `build-all`, `format-all`
- Husky + lint-staged para CI local (pre-commit hooks)
- CI/CD pipeline com GitHub Actions (lint, test, build)
- Swagger/OpenAPI documentation em `/api/docs`
- CONTRIBUTING.md e guias de arquitetura
- Documentação de deployment (Docker, Kubernetes, Helm)
- Guia de UX/UI e design system
- Deprecação oficial do `backend` (Express); `backend-nest` é a base ativa

### Changed
- Atualizado `.github/workflows/ci.yml` para usar monorepo
- Reorganizado `tsconfig.json` com aliases (`@common/*`, `@modules/*`, etc.)
- Simplificado processo de startup (um único `npm install`)

### Removed
- Remoção de `@ts-nocheck` do código legado
- Limpeza de dependências não utilizadas

### Fixed
- Validação de `DATABASE_URL` no startup
- Tratamento de erros melhorado em middleware

## [0.1.0] - 2025-02-15

### Added
- Projeto inicial com `backend` (Express) + `backend-nest` (NestJS) + `frontend` (React)
- Autenticação JWT com roles (ADMIN, USER, SUPPLIER)
- Sistema multi-tenant com suporte a múltiplas empresas
- Modelos Prisma para usuarios, products, vehicles, transports, companies
- Endpoints API básicos para CRUD de produtos e veículos
- Frontend com Dashboard, produto list/detail, mapa de transportes
- Docker Compose para desenvolvimento local
- Kubernetes manifests para deploy
- Suport a uploads de arquivos (avatares, documentos)
- Logging básico e interceptors de auditoria
- Testes iniciais (Jest + Supertest)

---

## Guia de Versioning

**Bumping de versão:**

```bash
# Patch (bug fixes)
npm version patch          # 0.1.0 → 0.1.1

# Minor (novas features)
npm version minor          # 0.1.0 → 0.2.0

# Major (breaking changes)
npm version major          # 0.1.0 → 1.0.0

# Tags automáticas
git push origin --tags
```

## Próximas Versões Planejadas

### v0.2.0 (Testes e Documentação)
- [ ] Cobertura de testes ≥ 80% (unitários e e2e)
- [ ] Documentação completamente atualizada
- [ ] Storybook para componentes React
- [ ] Testes de acessibilidade

### v0.3.0 (Observabilidade e Segurança)
- [ ] Logging estruturado com Pino
- [ ] Prometheus metrics + Grafana dashboard
- [ ] Sentry para error tracking
- [ ] Rate-limiting e proteção CSRF

### v1.0.0 (Produção)
- [ ] 100% de cobertura crítica
- [ ] Deploy em Kubernetes com Helm
- [ ] Monitoramento completo
- [ ] Documentação de operações

---

**Mantém este arquivo atualizado com cada PR/release!**
