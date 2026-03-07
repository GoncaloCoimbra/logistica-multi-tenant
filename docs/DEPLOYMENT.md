# Deployment Guide

Complete guide to deploy **Logística Multi-Tenant** to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Platforms](#cloud-platforms)
   - [Heroku](#heroku)
   - [AWS](#aws)
   - [DigitalOcean](#digitalocean)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Database Migrations](#database-migrations)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Prerequisites

- **Node.js**: v18+ 
- **npm**: 9+
- **Git**: Latest version
- **Docker**: 20.10+ (for containerized deployment)
- **PostgreSQL**: 12+ (or use managed database service)

---

## Local Testing

Before deploying, test locally:

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Database setup
npm run migrate

# 4. Start development server
npm run dev

# 5. Run tests
npm run test
npm run e2e
```

**Verify endpoints**:
- Backend: http://localhost:3000
- Frontend: http://localhost:3002
- Swagger API: http://localhost:3000/api/docs

---

## Docker Deployment

### Build Docker Images

```bash
# Build backend image
cd backend-nest
docker build -t logistica-backend:latest .

# Build frontend image  
cd ../frontend
docker build -t logistica-frontend:latest .

# Tag for registry (example: Docker Hub)
docker tag logistica-backend:latest yourusername/logistica-backend:latest
docker tag logistica-frontend:latest yourusername/logistica-frontend:latest
```

### Docker Compose (Local)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Push to Docker Registry

```bash
# Login to Docker Hub
docker login

# Push images
docker push yourusername/logistica-backend:latest
docker push yourusername/logistica-frontend:latest
```

---

## Cloud Platforms

### Heroku

#### Deploy Backend

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create logistica-backend --buildpack heroku/nodejs

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev --app logistica-backend

# 5. Set environment variables
heroku config:set NODE_ENV=production --app logistica-backend
heroku config:set JWT_SECRET=your-secret-key --app logistica-backend
heroku config:set CORS_ORIGIN=https://logistica-frontend.herokuapp.com --app logistica-backend

# 6. Deploy
git push heroku main

# 7. Run migrations
heroku run 'npm run migrate' --app logistica-backend

# 8. View logs
heroku logs --tail --app logistica-backend
```

#### Deploy Frontend

```bash
# 1. Create Heroku app
heroku create logistica-frontend --buildpack heroku/static

# 2. Add build script to package.json:
# "heroku-postbuild": "npm run build"

# 3. Configure backend URL
heroku config:set REACT_APP_API_URL=https://logistica-backend.herokuapp.com/api

# 4. Deploy
git push heroku main

# 5. View app
heroku open --app logistica-frontend
```

**Cost**: ~$20/month (Dyno + PostgreSQL)  
**Uptime**: 99.9%

---

### AWS (EC2 + RDS)

#### Prerequisites

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
```

#### Step-by-Step Deployment

```bash
# 1. Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier logistica-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourSecurePassword123 \
  --allocated-storage 20

# 2. Create EC2 instance
aws ec2 run-instances \
  --image-ids ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-groups allow-http-https

# 3. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 4. On EC2 instance:
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/yourusername/logistica-multi-tenant.git
cd logistica-multi-tenant

# Install & build
npm install
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "backend" -- start
pm2 save

# 5. Setup frontend
cd frontend
npm run build
# Serve with Nginx or CloudFront

# 6. Setup RDS connection
# Add RDS endpoint to .env
# Run migrations
npm run migrate
```

#### Setup Nginx Reverse Proxy (on EC2)

```bash
sudo apt-get install nginx

# Edit /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx

# Install SSL certificate (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**Cost**: ~$30-50/month (EC2 t3.small + RDS t3.micro)  
**Uptime**: 99.95% SLA

---

### DigitalOcean

#### Deploy with App Platform (Easiest)

```bash
# 1. Install doctl CLI
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-x64.tar.gz
tar xf ~/doctl-1.94.0-linux-x64.tar.gz
sudo mv ~/doctl /usr/local/bin

# 2. Authenticate
doctl auth init

# 3. Create app.yaml
```

```yaml
# app.yaml
name: logistica
region: nyc

services:
- name: backend
  github:
    repo: yourusername/logistica-multi-tenant
    branch: main
  build_command: npm install && npm run build
  run_command: npm run start
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}
  http_port: 3000
  
- name: frontend
  github:
    repo: yourusername/logistica-multi-tenant
    branch: main
    source_dir: frontend
  build_command: npm install && npm run build
  run_command: npm start
  envs:
  - key: REACT_APP_API_URL
    value: https://logistica-backend.ondigitalocean.app/api
  http_port: 3000

databases:
- name: db
  engine: PG
  version: "12"
```

```bash
# 4. Deploy
doctl apps create --spec app.yaml

# 5. View logs
doctl apps logs logistica --follow
```

**Cost**: ~$25/month (with free $200 credit for first 60 days)  
**Uptime**: 99.9%

---

## Kubernetes Deployment

For production-grade infrastructure:

```bash
# 1. Make sure you're in k8s/ directory
cd k8s

# 2. Create namespace
kubectl apply -f namespace.yaml

# 3. Create secrets (edit with real values first)
kubectl apply -f secrets.yaml

# 4. Create config maps
kubectl apply -f configmap.yaml

# 5. Deploy database
kubectl apply -f postgres.yaml

# 6. Deploy backend
kubectl apply -f backend.yaml

# 7. Deploy frontend
kubectl apply -f frontend.yaml

# 8. Setup Ingress
kubectl apply -f ingress.yaml

# 9. Configure HPA (auto-scaling)
kubectl apply -f hpa.yaml

# 10. Verify deployment
kubectl get pods -n logistica
kubectl get services -n logistica
kubectl logs -f deployment/backend -n logistica
```

**Access application**:
- Visit your ingress endpoint
- Check with: `kubectl get ingress -n logistica`

---

## Environment Configuration

### Backend Environment Variables

```env
# Server
NODE_ENV=production
PORT=3000

# Database  
DATABASE_URL=postgresql://user:password@host:5432/logistica

# Authentication
JWT_SECRET=your-very-secure-secret-key-min-32-chars
JWT_REFRESH_SECRET=another-secure-refresh-key

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Uploads
UPLOAD_DIR=/uploads

# Email (optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENV=production
```

---

## Database Migrations

### Create New Migration

```bash
# Backend
cd backend-nest
npx prisma migrate dev --name description_of_change
```

### Run Migrations in Production

```bash
# Using Prisma
npm run migrate:prod

# Or manually
npx prisma migrate deploy
```

### Backup Database

```bash
# PostgreSQL backup
pg_dump postgresql://user:password@host:5432/logistica > backup.sql

# Restore
psql postgresql://user:password@host:5432/logistica < backup.sql
```

---

## Monitoring & Troubleshooting

### Health Check

```bash
# Check backend health
curl https://your-backend-domain.com/api

# Check frontend
curl https://your-frontend-domain.com

# Check database connection
psql postgresql://user:password@host:5432/logistica -c "SELECT 1;"
```

### Common Issues

#### "Connection refused"
```bash
# Check if port is open
lsof -i :3000

# Start service again
npm run start
```

#### "Database connection failed"
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Restart database service
sudo systemctl restart postgresql
```

#### "Out of memory"
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=2048 npm start

# Or use PM2
pm2 start npm --max-memory-restart 500M --name backend -- start
```

### Performance Monitoring

```bash
# Install New Relic monitoring (optional)
npm install newrelic

# Add to main.ts:
require('newrelic');

# Set license key
NEW_RELIC_LICENSE_KEY=your-key npm start
```

### Log Aggregation (ELK Stack)

```bash
# Install Elasticsearch + Kibana for production logging
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker pull docker.elastic.co/kibana/kibana:8.0.0

# Configure logging in main.ts (Winston for NestJS)
npm install winston
```

---

## Scaling Strategies

### Horizontal Scaling (Multiple Instances)

```bash
# Using load balancer (Nginx)
upstream backend {
  server backend1:3000;
  server backend2:3000;
  server backend3:3000;
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
```

### Vertical Scaling (Larger Instances)

- Increase instance type
- Add more CPU/RAM
- Use caching (Redis)

### Database Scaling

```bash
# Read replicas for scaling reads
# Write to primary, read from replica

# Connection pooling
npm install pg-pool
```

---

## Production Checklist

- [ ] All environment variables set correctly
- [ ] SSL/TLS certificate configured
- [ ] Database backups enabled (daily)
- [ ] Monitoring & alerts configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Audit logging enabled
- [ ] Database indexes optimized
- [ ] Frontend assets cached with CDN
- [ ] Error tracking (Sentry) enabled
- [ ] Load tests performed
- [ ] Security audit completed

---

## Rollback Strategy

```bash
# If deployment fails, rollback to previous version
git revert HEAD
git push heroku main

# Or with Docker
docker pull yourusername/logistica-backend:previous-tag
docker-compose restart
```

---

## Support

For deployment issues:
- Check logs: `npm run logs`
- Contact: devops@your-company.com
- Status page: https://status.your-domain.com

---

**Last Updated**: February 27, 2026  
**Version**: 1.0.0
