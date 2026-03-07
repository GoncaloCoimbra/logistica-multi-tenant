# Roadmap - Logística Multi-Tenant

Este documento descreve o roteiro de desenvolvimento planejado para os próximos meses.

## Visão Geral

```
Q1 2026:  Estabilidade & Testes
Q2 2026:  Observabilidade & Segurança  
Q3 2026:  Performance & Escala
Q4 2026:  Produção & Operações
```

---

## Q1 2026 (Jan-Mar) - Estabilidade & Testes

### Objetivos
- ✅ Estabelecer confiança no código via testes
- ✅ Documentação completa
- ✅ Simplificar estrutura (depreciar express backend)
- ✅ Setup monorepo e CI/CD

### Tarefas

#### Backend (backend-nest)

- [x] Monorepo + workspaces
- [x] CI/CD com GitHub Actions
- [ ] **Cobertura de testes ≥ 80%**
  - [ ] Testes unitários para services
  - [ ] Mocks para BD (Prisma)
  - [ ] Testes e2e para fluxos críticos (auth, CRUD)
  - [ ] Casos de erro e validação
- [x] Swagger/OpenAPI
- [ ] **Validação de env vars** melhorada
- [ ] Logging estruturado (Pino)

#### **Frontend**

- [ ] **Testes React Testing Library** ≥ 60% components
- [ ] **E2E tests** Cypress (login, CRUD, navegação)
- [ ] **Storybook** para componentes isolados
- [ ] Organização de pastas melhorada
- [ ] ESLint + Prettier CI

#### **Documentação**

- [x] CONTRIBUTING.md atualizado
- [x] ARCHITECTURE.md
- [x] DEPLOYMENT.md
- [x] UX_UI.md
- [x] CHANGELOG.md
- [x] Roadmap (este arquivo)
- [ ] Adicionar screenshots reais
- [ ] README específicos por pasta

### DL: **31 Março 2026**

---

## Q2 2026 (Abr-Jun) - Observabilidade & Segurança

### Objetivos
- Visibilidade completa do sistema (logs, metrics, traces)
- Proteção contra vulnerabilidades comuns
- Performance baseline estabelecido

### Tarefas

#### Backend

- [ ] **Prometheus metrics** (request count, latency, errors)
- [ ] **Grafana dashboard** com KPIs principais
- [ ] **Sentry** para error tracking e alertas
- [ ] **Rate-limiting** (Express-rate-limit)
- [ ] **CSRF protection** (csurf ou nest-js-csrf)
- [ ] **Security headers** (helmet, HSTS, CSP)
- [ ] **Dependency scanning** (Dependabot or Snyk)
- [ ] **Request/Response logging** (pino + transporte para ELK)

#### Frontend

- [ ] **Error Boundary** com fallback UI
- [ ] **Sentry integration** para frontend errors
- [ ] **Audit de acessibilidade** (axe, jest-axe)
  - [ ] Corrigir todas as issues WCAG 2.1 AA
- [ ] **Dark mode** completo
- [ ] **Service Worker** (offline support - PWA)

#### DevOps

- [ ] **Docker robusto** (multi-stage, security scanning)
- [ ] **Docker-compose + health checks**
- [ ] **Helm chart** com readiness/liveness probes
- [ ] **K8s manifests** revistos (PVC, secrets, resources)

### DL: **30 Junho 2026**

---

## Q3 2026 (Jul-Set) - Performance & Escala

### Objetivos
- Sistema otimizado para produção
- Suporte a crescimento de dados
- Experiência fluida em redes lentas

### Tarefas

#### Backend

- [ ] **Database indexing** e query optimization
- [ ] **Caching** (Redis para sessões, dados frequentes)
- [ ] **Pagination** robusto em endpoints grandes
- [ ] **Lazy-loading** de Prisma relations
- [ ] **Background jobs** (Bull, RabbitMQ) para tasks longos
- [ ] **API Gateway** (Kong ou similar - opcional)
- [ ] **Testes de carga** (k6, Locust)

#### Frontend

- [ ] **Code-splitting** baseado em rotas
- [ ] **Image optimization** (next-image ou similar)
- [ ] **Bundle analysis** e tree-shaking
- [ ] **Virtual scrolling** em listas grandes
- [ ] **Lazy-loading** de componentes
- [ ] **Lighthouse score** ≥ 90

#### Data

- [ ] **Backup automático** (cron + offsite)
- [ ] **Replication** (secundário para HA)
- [ ] **Migration strategy** testada
- [ ] **Point-in-time recovery** documentado

### DL: **30 Setembro 2026**

---

## Q4 2026 (Out-Dez) - Produção & Operações

### Objetivos
- Sistema pronto para produção
- Documentação de runbooks
- Equipe preparada para operações

### Tarefas

#### Deploy & Infrastructure

- [ ] **Ambiente de staging** separado
- [ ] **DNS + SSL/TLS** configurado
- [ ] **Load balancer** (Ingress Nginx, ALB)
- [ ] **Auto-scaling** HPA configurado
- [ ] **Disaster recovery** plan + testes
- [ ] **Rollback automático** em casos de falha

#### Monitoring & Alertas

- [ ] **Prometheus + Grafana** full setup
- [ ] **Alert rules** for critical metrics
- [ ] **On-call rotation** documentado
- [ ] **SLO/SLI** definidos (uptime, latency)

#### Documentation & Training

- [ ] **Runbooks** para operações diárias
- [ ] **Troubleshooting guide**
- [ ] **Training sessions** para equipe ops
- [ ] **Incident response** procedure

#### Security Audit

- [ ] **Pentest** or security review
- [ ] **OWASP Top 10** checklist
- [ ] **Compliance** (GDPR, se aplicável)
- [ ] **Secrets management** (Vault)

### DL: **31 Dezembro 2026**

---

## Backlog (Nice-to-Have / Future)

- [ ] **Real-time features** (WebSockets + Socket.io para notificações)
- [ ] **Advanced analytics** (Data warehouse + BI)
- [ ] **Mobile app** (React Native)
- [ ] **Internationalization** (i18n - multilingual)
- [ ] **Two-factor authentication** (2FA/MFA)
- [ ] **Audit trail** baseado em eventos
- [ ] **GraphQL** API alternativa
- [ ] **API rate-limiting granular** (por user/org)
- [ ] **Machine learning** (previsão de rotas, anomalias)

---

## Dependências Entre Fases

```
Q1: Testes ─┬─→ Q2: Observabilidade
           └─→ Q2: Segurança
           
Q2: Performance ─→ Q3: Otimização
                → Q3: Escala
                
Q3: Backup ─────→ Q4: DR Plan
Q3: Monitoring ─→ Q4: Alertas
```

---

## Métricas de Sucesso

| Métrica | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| Test Coverage | 80% | 85% | 90% | 95% |
| Lighthouse Score | 75 | 80 | 90 | 95 |
| API Response Time | <500ms | <300ms | <200ms | <100ms |
| Uptime | 95% | 98% | 99% | 99.9% |
| Security Incidents | 0 | 0 | 0 | 0 |

---

## Revisão & Ajustes

Este roadmap será revisado:
- **Mensalmente**: Status check nas tarefas
- **Trimestral**: Ajustes baseado em feedback e blockers

Última revisão: **27 Fev 2026**  
Próxima revisão: **31 Mar 2026**

---

## Como Contribuir

1. Abra uma issue se encontrar um blocker
2. Submeta PRs alinhadas com o roadmap
3. Participe nas discussões de planejamento (reuniões quinzenais)

**Dúvidas?** Contacte o PM ou líder técnico.
