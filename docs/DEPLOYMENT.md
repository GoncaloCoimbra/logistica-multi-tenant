# Guia de Deployment

Este documento detalha como colocar a aplicação em produção em diferentes ambientes.

## Requisitos

- Docker e Docker Compose (para containerização)
- Node.js 20+
- Postgres 15+ (para base de dados)
- Kubectl (se usar Kubernetes)
- Git

## Stack de Produção

```
┌─────────────────────────────────────────┐
│   Frontend (React + Vite)               │
│   servido por Nginx ou vercel           │
└──────────┬──────────────────────────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────────────────────────┐
│   NestJS Backend (backend-nest)         │
│   API segura, validação, JWT auth       │
└──────────┬──────────────────────────────┘
           │
           │
           ▼
┌─────────────────────────────────────────┐
│   PostgreSQL 15+                        │
│   Backup automático + WAL archiving     │
└─────────────────────────────────────────┘
```

## Docker Compose (Desenvolvimento + Staging)

```bash
# Iniciar todos os serviços localmente
docker-compose up -d

# Ver logs
docker-compose logs -f backend-nest
docker-compose logs -f frontend

# Parar tudo
docker-compose down
```

## Variáveis de Ambiente - Produção

Certifique-se de que as seguintes estão configuradas:

```bash
# Backend (backend-nest/.env)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@postgres-host:5432/logistica_prod
JWT_SECRET=<secret-key-muito-longo>
CORS_ORIGIN=https://seu-dominio.com
LOG_LEVEL=warn
SENTRY_DSN=https://...      # opcional para error tracking

# Frontend (.env.production)
REACT_APP_API_URL=https://api.seu-dominio.com
REACT_APP_ENV=production
```

## Deploy em Kubernetes (Recomendado para Produção)

### 1. Preparar Imagens Docker

```bash
# Build do backend
docker build -t seu-registry/logistica-backend-nest:1.0.0 ./backend-nest

# Build do frontend
docker build -t seu-registry/logistica-frontend:1.0.0 ./frontend

# Push para repositório
docker push seu-registry/logistica-backend-nest:1.0.0
docker push seu-registry/logistica-frontend:1.0.0
```

### 2. Helm Chart ou kustomize

Use os manifests em `k8s/`:

```bash
# Aplicar todo o stack
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml      # Secrets seguros
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Verificar
kubectl get pods -n logistica
kubectl get svc -n logistica
```

### 3. Configurar DNS e TLS

```bash
# Criar certificado (Let's Encrypt via cert-manager)
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: logistica-cert
  namespace: logistica
spec:
  secretName: logistica-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - api.seu-dominio.com
  - seu-dominio.com
EOF
```

## Backup e Recuperação

### Backup Automático (PostgreSQL)

Em Kubernetes:

```bash
# ConfigMap com script backup
kubectl create configmap backup-script --from-file=backup.sh -n logistica

# CronJob para backups diários
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: logistica
spec:
  schedule: "2 2 * * *"  # 02:02 UTC diariamente
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgres
            image: postgres:15
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h postgres-svc -U \$POSTGRES_USER \$POSTGRES_DB | \
              gzip > /backups/dump-\$(date +%Y%m%d-%H%M%S).sql.gz
            env:
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_DB
              value: logistica_prod
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
            volumeMounts:
            - name: backups
              mountPath: /backups
          volumes:
          - name: backups
            persistentVolumeClaim:
              claimName: backups-pvc
          restartPolicy: OnFailure
EOF
```

### Restaurar de Backup

```bash
# Se usar backup local
gunzip < dump-20251227-020200.sql.gz | psql -U postgres logistica_prod
```

## Monitoramento e Alertas

### Prometheus + Grafana

```bash
# Aplicar stack de monitoramento
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Acessar Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# URL: http://localhost:3000 (padrão: admin/prom-operator)
```

### Sentry (Error Tracking)

```bash
# Configurar nas variáveis de ambiente do backend
SENTRY_DSN=https://key@sentry.io/project-id
```

## CI/CD Pipeline

Ver `.github/workflows/ci.yml` para o pipeline automatizado que:

1. ✅ Lint e format check
2. ✅ Testes automáticos
3. ✅ Build Docker
4. ✅ Push para registry
5. ✅ Deploy automático (opcional)

## Checklist pré-Deploy

- [ ] Todas as testes passando (`npm run test-all`)
- [ ] Lint sem erros (`npm run lint-all`)
- [ ] Migrações Prisma executadas (`prisma migrate deploy`)
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Backup da BD feito
- [ ] Certificados SSL/TLS válidos
- [ ] CORS configurado para domínios autorizados
- [ ] Secrets em Vault/K8s não em .env
- [ ] Logs centralizados funcionando
- [ ] Alertas de monitoramento ativados

## Performance e Otimização

### Frontend

```bash
# Build otimizado
npm run --workspace=frontend build

# Análise de bundle
npm install -g @bundle-stats/cli
bundle-stats ./frontend/build
```

### Backend

```bash
# Cache Redis (adicionar conforme necessário)
# Compressão GZIP habilitada
# Lazy-loading de modules Nest
```

## Políticas de Rollback

Se um deploy falhar:

```bash
# Kubernetes rollout undo
kubectl rollout undo deployment/backend-nest -n logistica
kubectl rollout undo deployment/frontend -n logistica

# Ver histórico
kubectl rollout history deployment/backend-nest -n logistica
```

## Suporte

Problemas? Consulte:

- Backend logs: `kubectl logs -f deployment/backend-nest -n logistica`
- Database: `kubectl exec -it postgres-pod -- psql -U postgres`
- Documentação API: https://seu-dominio.com/api/docs (Swagger)

---

**Última atualização:** Dezembro 2025
