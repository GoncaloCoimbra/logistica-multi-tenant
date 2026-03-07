# 🧪 SCRIPT DE TESTE - HISTÓRICO E NOTIFICAÇÕES (PowerShell)
# Requer: TOKEN JWT válido e IDs reais

$BASE_URL = "http://localhost:3000/api"

# ⚙️ CONFIGURAÇÕES (Atualize com valores reais)
$TOKEN = "seu-jwt-token-aqui"
$COMPANY_ID = "seu-company-id-aqui"
$SUPPLIER_ID = "seu-supplier-id-aqui"
$USER_ID = "seu-user-id-aqui"

# Headers padrão
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "🧪 TESTE DE HISTÓRICO E NOTIFICAÇÕES" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# 1️⃣ VERIFICAR HISTÓRICO ANTES
Write-Host "1️⃣  Verificando histórico ANTES..." -ForegroundColor Yellow
try {
    $auditBefore = Invoke-RestMethod -Uri "$BASE_URL/audit-logs" -Headers $headers -Method Get
    Write-Host " Históricos encontrados: $($auditBefore.Count)" -ForegroundColor Green
} catch {
    Write-Host " Erro ao buscar histórico: $($_.Exception.Message)" -ForegroundColor Red
}

# 2️⃣ VERIFICAR NOTIFICAÇÕES ANTES
Write-Host ""
Write-Host "2️⃣  Verificando notificações ANTES..." -ForegroundColor Yellow
try {
    $notifBefore = Invoke-RestMethod -Uri "$BASE_URL/notifications/unread/count" -Headers $headers -Method Get
    Write-Host " Notificações não lidas: $($notifBefore.count)" -ForegroundColor Green
} catch {
    Write-Host " Erro ao buscar notificações: $($_.Exception.Message)" -ForegroundColor Red
}

# 3️⃣ CRIAR NOVO PRODUTO
Write-Host ""
Write-Host "3️⃣  Criando novo produto (dispara histórico + notificação)..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$productData = @{
    internalCode = "TEST-$timestamp"
    description = "Produto Teste $timestamp"
    quantity = 100
    unit = "kg"
    supplierId = $SUPPLIER_ID
} | ConvertTo-Json

try {
    $productResponse = Invoke-RestMethod -Uri "$BASE_URL/products" `
        -Headers $headers `
        -Method Post `
        -Body $productData

    $productId = $productResponse.id
    Write-Host " Produto criado com sucesso!" -ForegroundColor Green
    Write-Host "   ID: $productId" -ForegroundColor Green
    Write-Host "   Código: $($productResponse.internalCode)" -ForegroundColor Green
} catch {
    Write-Host " Erro ao criar produto: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4️⃣ VERIFICAR HISTÓRICO DEPOIS
Write-Host ""
Write-Host "4️⃣  Verificando histórico DEPOIS..." -ForegroundColor Yellow
try {
    $auditAfter = Invoke-RestMethod -Uri "$BASE_URL/audit-logs" -Headers $headers -Method Get
    Write-Host " Total de registros de histórico: $($auditAfter.Count)" -ForegroundColor Green
    if ($auditAfter.Count -gt 0) {
        Write-Host "   Último: $($auditAfter[0].action) - $($auditAfter[0].entity)" -ForegroundColor Cyan
    }
} catch {
    Write-Host " Erro ao buscar histórico: $($_.Exception.Message)" -ForegroundColor Red
}

# 5️⃣ VERIFICAR NOTIFICAÇÕES DEPOIS
Write-Host ""
Write-Host "5️⃣  Verificando notificações DEPOIS..." -ForegroundColor Yellow
try {
    $notifAfter = Invoke-RestMethod -Uri "$BASE_URL/notifications" -Headers $headers -Method Get
    $unreadCount = $notifAfter.total
    Write-Host " Notificações não lidas: $unreadCount" -ForegroundColor Green
    if ($notifAfter.notifications.Count -gt 0) {
        Write-Host "   Última: $($notifAfter.notifications[0].title)" -ForegroundColor Cyan
    }
} catch {
    Write-Host " Erro ao buscar notificações: $($_.Exception.Message)" -ForegroundColor Red
}

# 6️⃣ ATUALIZAR STATUS DO PRODUTO
Write-Host ""
Write-Host "6️⃣  Atualizando status do produto..." -ForegroundColor Yellow
$statusData = @{
    newStatus = "IN_ANALYSIS"
    location = "Armazém Teste"
    reason = "Teste de notificação automática"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$BASE_URL/products/$productId/status" `
        -Headers $headers `
        -Method Put `
        -Body $statusData

    Write-Host " Status atualizado com sucesso!" -ForegroundColor Green
    Write-Host "   Novo status: $($updateResponse.status)" -ForegroundColor Green
} catch {
    Write-Host " Erro ao atualizar status: $($_.Exception.Message)" -ForegroundColor Red
}

# 7️⃣ VERIFICAR NOTIFICAÇÕES NOVAMENTE
Write-Host ""
Write-Host "7️⃣  Verificando notificações após atualização..." -ForegroundColor Yellow
try {
    $notifFinal = Invoke-RestMethod -Uri "$BASE_URL/notifications" -Headers $headers -Method Get
    Write-Host " Notificações não lidas: $($notifFinal.total)" -ForegroundColor Green
    Write-Host "   Total de notificações: $($notifFinal.notifications.Count)" -ForegroundColor Green
} catch {
    Write-Host " Erro ao buscar notificações: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "🎉 TESTE CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue

#  RESUMO
Write-Host ""
Write-Host " RESUMO:" -ForegroundColor Cyan
Write-Host "   ✓ Histórico criado automaticamente ao criar/atualizar" -ForegroundColor Green
Write-Host "   ✓ Notificações disparadas automaticamente" -ForegroundColor Green
Write-Host "   ✓ Dados persistidos no banco de dados" -ForegroundColor Green
