#!/bin/bash

# 🧪 SCRIPT DE TESTE - HISTÓRICO E NOTIFICAÇÕES
# Requer: TOKEN JWT válido e IDs reais

BASE_URL="http://localhost:3000/api"

# ⚙️ CONFIGURAÇÕES (Atualize com valores reais)
TOKEN="seu-jwt-token-aqui"
COMPANY_ID="seu-company-id-aqui"
SUPPLIER_ID="seu-supplier-id-aqui"
USER_ID="seu-user-id-aqui"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🧪 TESTE DE HISTÓRICO E NOTIFICAÇÕES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# 1️⃣ VERIFICAR HISTÓRICO ANTES
echo -e "${YELLOW}1️⃣  Verificando histórico ANTES...${NC}"
curl -s -X GET "$BASE_URL/audit-logs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.length'

# 2️⃣ VERIFICAR NOTIFICAÇÕES ANTES
echo -e "\n${YELLOW}2️⃣  Verificando notificações ANTES...${NC}"
curl -s -X GET "$BASE_URL/notifications/unread/count" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.count'

# 3️⃣ CRIAR NOVO PRODUTO (Vai disparar histórico + notificação)
echo -e "\n${YELLOW}3️⃣  Criando novo produto (dispara histórico + notificação)...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"internalCode\": \"TEST-$(date +%s)\",
    \"description\": \"Produto Teste $(date +%H:%M:%S)\",
    \"quantity\": 100,
    \"unit\": \"kg\",
    \"supplierId\": \"$SUPPLIER_ID\"
  }")

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.id')
echo -e "${GREEN} Produto criado: $PRODUCT_ID${NC}"
echo $PRODUCT_RESPONSE | jq '.'

# 4️⃣ VERIFICAR HISTÓRICO DEPOIS
echo -e "\n${YELLOW}4️⃣  Verificando histórico DEPOIS...${NC}"
AUDIT_RESPONSE=$(curl -s -X GET "$BASE_URL/audit-logs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

AUDIT_COUNT=$(echo $AUDIT_RESPONSE | jq '.length')
echo -e "${GREEN} Total de registros de histórico: $AUDIT_COUNT${NC}"
echo $AUDIT_RESPONSE | jq '.[:3]'

# 5️⃣ VERIFICAR NOTIFICAÇÕES DEPOIS
echo -e "\n${YELLOW}5️⃣  Verificando notificações DEPOIS...${NC}"
NOTIF_RESPONSE=$(curl -s -X GET "$BASE_URL/notifications/unread" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

NOTIF_COUNT=$(echo $NOTIF_RESPONSE | jq '.length')
echo -e "${GREEN} Total de notificações: $NOTIF_COUNT${NC}"
echo $NOTIF_RESPONSE | jq '.[:3]'

# 6️⃣ ATUALIZAR STATUS DO PRODUTO (Vai disparar outra notificação)
echo -e "\n${YELLOW}6️⃣  Atualizando status do produto...${NC}"
curl -s -X PUT "$BASE_URL/products/$PRODUCT_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"newStatus\": \"IN_ANALYSIS\",
    \"location\": \"Armazém Teste\",
    \"reason\": \"Teste de notificação automática\"
  }" | jq '.'

# 7️⃣ VERIFICAR NOTIFICAÇÕES NOVAMENTE
echo -e "\n${YELLOW}7️⃣  Verificando notificações após atualização...${NC}"
NOTIF_FINAL=$(curl -s -X GET "$BASE_URL/notifications/unread/count" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo -e "${GREEN} Notificações não lidas: $(echo $NOTIF_FINAL | jq '.count')${NC}"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 TESTE CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
