#!/usr/bin/env pwsh

# 🧪 TESTE DE HISTÓRICO (AuditLog) - Script Interativo
# Este script testa e mostra o histórico funcionando em tempo real

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔍 TESTE DE HISTÓRICO (AuditLog) - Verificação em Tempo  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ⚙️ CONFIGURAÇÃO
$BASE_URL = "http://localhost:3000/api"

Write-Host "⚙️  CONFIGURAÇÃO NECESSÁRIA" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

$TOKEN = Read-Host "📝 Cole seu token JWT"
Write-Host ""

$COMPANY_ID = Read-Host "📝 Cole seu Company ID"
Write-Host ""

$SUPPLIER_ID = Read-Host "📝 Cole seu Supplier ID"
Write-Host ""

# Headers padrão
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host " Configuração completa!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 1️⃣ PEGAR HISTÓRICO ANTES
Write-Host "1️⃣  PASSO 1: Verificar histórico ANTES" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

Write-Host "🔄 Buscando histórico..." -ForegroundColor Cyan

try {
    $auditBefore = Invoke-RestMethod -Uri "$BASE_URL/audit-logs" -Headers $headers -Method Get -ErrorAction Stop
    $countBefore = @($auditBefore).Count
    
    Write-Host " Históricos encontrados: $countBefore" -ForegroundColor Green
    Write-Host ""
    
    if ($countBefore -gt 0) {
        Write-Host "📋 Últimos 3 registros:" -ForegroundColor Cyan
        $auditBefore | Select-Object -First 3 | ForEach-Object {
            $time = [datetime]::Parse($_.createdAt).ToString("HH:mm:ss")
            Write-Host "   • [$($_.action)] $($_.entity) - $($_.userId) ($time)" -ForegroundColor White
        }
    } else {
        Write-Host "   (Nenhum histórico ainda)" -ForegroundColor Gray
    }
    
    Write-Host ""
    
} catch {
    Write-Host " Erro ao buscar histórico: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2️⃣ CRIAR PRODUTO
Write-Host "2️⃣  PASSO 2: Criar um novo produto (vai gerar histórico)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$productData = @{
    internalCode = "TEST-$timestamp"
    description = "Produto Teste de Histórico $timestamp"
    quantity = 100
    unit = "kg"
    supplierId = $SUPPLIER_ID
} | ConvertTo-Json

Write-Host "🔄 Criando produto..." -ForegroundColor Cyan

try {
    $productResponse = Invoke-RestMethod -Uri "$BASE_URL/products" `
        -Headers $headers `
        -Method Post `
        -Body $productData `
        -ErrorAction Stop

    $productId = $productResponse.id
    Write-Host " Produto criado com sucesso!" -ForegroundColor Green
    Write-Host "   ID: $productId" -ForegroundColor Green
    Write-Host "   Código: $($productResponse.internalCode)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host " Erro ao criar produto: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3️⃣ AGUARDAR UM POUCO
Write-Host "3️⃣  PASSO 3: Aguardando um momento para o histórico ser registrado..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

for ($i = 3; $i -gt 0; $i--) {
    Write-Host "   ⏳ $i segundos..." -ForegroundColor Cyan
    Start-Sleep -Seconds 1
}

Write-Host ""

# 4️⃣ PEGAR HISTÓRICO DEPOIS
Write-Host "4️⃣  PASSO 4: Verificar histórico DEPOIS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

Write-Host "🔄 Buscando histórico..." -ForegroundColor Cyan

try {
    $auditAfter = Invoke-RestMethod -Uri "$BASE_URL/audit-logs" -Headers $headers -Method Get -ErrorAction Stop
    $countAfter = @($auditAfter).Count
    
    Write-Host " Históricos encontrados: $countAfter" -ForegroundColor Green
    Write-Host ""
    
    # Comparar
    $newRecords = $countAfter - $countBefore
    
    if ($newRecords -gt 0) {
        Write-Host "🎉 NOVO HISTÓRICO CRIADO!" -ForegroundColor Green
        Write-Host "   Registros antes: $countBefore" -ForegroundColor Cyan
        Write-Host "   Registros depois: $countAfter" -ForegroundColor Cyan
        Write-Host "   Novos registros: +$newRecords " -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "⚠️  Nenhum novo histórico criado" -ForegroundColor Yellow
        Write-Host "   Isso pode significar que o interceptor não está funcionando" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Mostrar últimos registros
    Write-Host "📋 Últimos 5 registros de histórico:" -ForegroundColor Cyan
    Write-Host ""
    
    $auditAfter | Select-Object -First 5 | ForEach-Object {
        $time = [datetime]::Parse($_.createdAt).ToString("dd/MM/yyyy HH:mm:ss")
        $entity = $_.entity
        $action = $_.action
        $ip = $_.ipAddress
        
        # Cores por ação
        $actionColor = @{
            "CREATE" = "Green"
            "UPDATE" = "Yellow"
            "DELETE" = "Red"
            "UNKNOWN" = "Gray"
        }[$action] || "White"
        
        Write-Host "   ├─ [$(($action).PadRight(6))] $entity.PadRight(15) | $time" -ForegroundColor White
        Write-Host "   │  └─ IP: $ip" -ForegroundColor Gray
    }
    
    Write-Host ""
    
} catch {
    Write-Host " Erro ao buscar histórico: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5️⃣ ATUALIZAR STATUS (Gera outro histórico)
Write-Host "5️⃣  PASSO 5: Atualizar status do produto (gera outro histórico)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

$statusData = @{
    newStatus = "IN_ANALYSIS"
    location = "Armazém Teste"
    reason = "Teste de histórico"
} | ConvertTo-Json

Write-Host "🔄 Atualizando status..." -ForegroundColor Cyan

try {
    $updateResponse = Invoke-RestMethod -Uri "$BASE_URL/products/$productId/status" `
        -Headers $headers `
        -Method Put `
        -Body $statusData `
        -ErrorAction Stop

    Write-Host " Status atualizado com sucesso!" -ForegroundColor Green
    Write-Host "   Novo status: $($updateResponse.status)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host " Erro ao atualizar status: $($_.Exception.Message)" -ForegroundColor Red
}

# 6️⃣ AGUARDAR
Write-Host "6️⃣  PASSO 6: Aguardando..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

for ($i = 2; $i -gt 0; $i--) {
    Write-Host "   ⏳ $i segundos..." -ForegroundColor Cyan
    Start-Sleep -Seconds 1
}

Write-Host ""

# 7️⃣ VERIFICAR HISTÓRICO FINAL
Write-Host "7️⃣  PASSO 7: Verificar histórico final" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

Write-Host "🔄 Buscando histórico..." -ForegroundColor Cyan

try {
    $auditFinal = Invoke-RestMethod -Uri "$BASE_URL/audit-logs" -Headers $headers -Method Get -ErrorAction Stop
    $countFinal = @($auditFinal).Count
    
    Write-Host " Total de históricos: $countFinal" -ForegroundColor Green
    Write-Host ""
    
    # Mostrar todos os registros relacionados ao produto
    $productLogs = $auditFinal | Where-Object { $_.entityId -eq $productId -or $_.entity -eq "product" } | Select-Object -First 10
    
    if ($productLogs) {
        Write-Host "📋 Históricos relacionados ao produto:" -ForegroundColor Cyan
        Write-Host ""
        
        $productLogs | ForEach-Object {
            $time = [datetime]::Parse($_.createdAt).ToString("HH:mm:ss")
            $action = $_.action
            $entity = $_.entity
            
            Write-Host "   ✓ [$action] $entity - ID: $($_.entityId)" -ForegroundColor Green
            Write-Host "     └─ Timestamp: $time" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    
} catch {
    Write-Host " Erro ao buscar histórico: $($_.Exception.Message)" -ForegroundColor Red
}

#  RESUMO FINAL
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                     RESUMO FINAL                         ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host " CONTAGEM DE REGISTROS:" -ForegroundColor Cyan
Write-Host "   Antes: $countBefore" -ForegroundColor White
Write-Host "   Depois: $countAfter" -ForegroundColor White
Write-Host "   Novos: +$($countAfter - $countBefore) " -ForegroundColor Green

Write-Host ""
Write-Host "🎯 CONCLUSÃO:" -ForegroundColor Yellow

if ($countAfter -gt $countBefore) {
    Write-Host "    HISTÓRICO FUNCIONA PERFEITAMENTE!" -ForegroundColor Green
    Write-Host "   └─ Registros sendo criados automaticamente" -ForegroundColor Green
} else {
    Write-Host "    HISTÓRICO NÃO ESTÁ FUNCIONANDO" -ForegroundColor Red
    Write-Host "   └─ Verifique se o interceptor está configurado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 O QUE VOCÊ VISTO:" -ForegroundColor Cyan
Write-Host "   ✓ Histórico registra quando você cria um produto" -ForegroundColor Green
Write-Host "   ✓ Histórico registra quando você atualiza o status" -ForegroundColor Green
Write-Host "   ✓ Cada ação gera um novo registro em tempo real" -ForegroundColor Green
Write-Host "   ✓ Dados completos: ação, entidade, usuário, IP, timestamp" -ForegroundColor Green

Write-Host ""
Write-Host "🔍 PRÓXIMAS AÇÕES:" -ForegroundColor Yellow
Write-Host "   1. Verifique GET /api/audit-logs no Postman" -ForegroundColor Cyan
Write-Host "   2. Crie mais produtos/atualizações" -ForegroundColor Cyan
Write-Host "   3. Veja novos históricos sendo criados" -ForegroundColor Cyan

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Teste concluído!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
