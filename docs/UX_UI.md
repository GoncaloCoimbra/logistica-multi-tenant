# UX/UI Guide

This document describes the design patterns, usability, and accessibility of the platform.

## Design Principles

### 1. **Clarity**
- Clean and direct interfaces
- Descriptive labels in forms
- Useful error messages (not technical)

### 2. **Efficiency**
- Fewer clicks for common actions
- Keyboard shortcuts for critical operations
- Quick search in large lists

### 3. **Consistency**
- Unified visual standard across all pages
- Consistent naming (ex. always "Transports", never "Shipments")
- Similar behaviors for similar actions

### 4. **Accessibility**
- WCAG 2.1 AA minimum
- Screen reader support
- Color contrast ≥ 4.5:1
- Complete keyboard navigation

## Color Palette

```javascript
// tailwind.config.js (example)
{
  theme: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#0066cc',
        900: '#003d99',
      },
      secondary: {
        50: '#f5f3ff',
        500: '#7c3aed',
        900: '#4c1d95',
      },
      success: {
        500: '#22c55e',
      },
      warning: {
        500: '#eab308',
      },
      danger: {
        500: '#ef4444',
      },
      neutral: {
        50: '#f9fafb',
        500: '#6b7280',
        900: '#111827',
      },
    }
  }
}
```

## Typography

- **Headlines (H1-H3)**: Inter Bold, 24-32px
- **Body**: Inter Regular, 14-16px
- **Meta/Helper**: Inter Regular 12px, color `neutral-500`

## Base Components

### Forms

```typescript
// Example: Validated input with error message
<Input
  label="E-mail"
  type="email"
  required
  error={errors.email?.message}
  placeholder="user@company.com"
/>
```

**Rules:**
- Required field = red asterisk
- Error = red message below input
- Success = green icon/border (optional)

### Notifications/Toasts

```typescript
<Toast
  type="success"  // success | warning | error | info
  title="Product created"
  message="The product was successfully added to the library."
  action={{
    label: "View",
    onClick: () => navigate('/products/123')
  }}
/>
```

### Modais/Diálogos

- Teclado: `Escape` para fechar
- Foco: presa dentro do modal
- Sobrescrita: backdrop clicável para fechar (confirmação se houver mudanças)

### Loading

```typescript
// Skeleton em listas
<SkeletonLoader count={5} height={48} />

// Spinner em ações
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Salvar'}
</Button>
```

## Padrões de Página

### Listagem de Dados

```
┌─────────────────────────────────────────┐
│  Título + Descrição                     │
│  [Buscar...] | [Filtros] | [+ Novo]    │
├─────────────────────────────────────────┤
│                                         │
│  Tabela com colunas (sortáveis)         │
│  - Linha destacada no hover             │
│  - Checkbox para ações em batch         │
│  - Ação principal: clique na linha      │
│                                         │
├─────────────────────────────────────────┤
│ Página 1 de 5 | [< | >] | 50 por página│
└─────────────────────────────────────────┘
```

### Formulário de Criação/Edição

```
┌─────────────────────────────────────────┐
│  Título (criar vs. editar)              │
│  Descrição do formulário                │
├─────────────────────────────────────────┤
│                                         │
│  [Seção 1]          [Seção 2]           │
│  ├─ Campo 1         ├─ Campo A          │
│  ├─ Campo 2         ├─ Campo B          │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Seção expandida (tabela, lista)  │   │
│  └──────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ [Cancelar] ... [Salvar] | [Salvar+Novo]│
└─────────────────────────────────────────┘
```

## Estados de Página

### Vazia
- Ícone grande (ilustração)
- Título curto ("Nenhum produto ainda")
- Descrição leve
- CTA primário ("Criar primeiro produto")

### Erro
- Ícone de erro (❌ ou ⚠️)
- Mensagem amigável
- Motivo (ex. "Conexão perdida")
- CTA ("Tentar novamente")

### Carregamento
- Skeleton/spinner apropriado
- Não alterar layout
- Placeholder similar ao conteúdo final

## Formulários de Validação

```typescript
// Integração com React Hook Form + Zod
<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    {...register("email", {
      required: "E-mail é obrigatório",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "E-mail inválido"
      }
    })}
    error={errors.email?.message}
  />
  
  <Button type="submit" loading={isSubmitting}>
    Salvar
  </Button>
</form>
```

## Temas (Dark Mode)

```typescript
// Context de tema
<ThemeProvider>
  <App />
</ThemeProvider>

// em componentes
const { theme, toggleTheme } = useTheme();

// Tailwind dark mode
// class="dark:bg-gray-900 dark:text-white"
```

## Responsividade

| Device | Breakpoint | Cols | Comportamento |
|--------|-----------|------|---|
| Mobile | < 640px | 1 | Stack vertical, botões full-width |
| Tablet | 640-1024px | 2 | Sidebar colapsável |
| Desktop | > 1024px | 3-4 | Layout completo |

## Testes de Acessibilidade

```bash
# Integrar jest-axe
npm install jest-axe

# em testes
import { axe } from 'jest-axe';

test('renderiza accessivelmente', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Fluxos Críticos (wireframes)

### Login
1. E-mail + password
2. "Esqueceu a senha?" link
3. Validação inline
4. Erro: mensagem clara
5. Sucesso: redireção para dashboard

### CRUD de Produto
1. **Listar**: tabela com busca + filtros
2. **Criar**: modal ou página dedicada
3. **Editar**: in-place ou modal
4. **Deletar**: confirmação com aviso

## Captura de Tela / Maquetes

```
docs/
├─ screenshots/
│  ├─ login.png
│  ├─ dashboard.png
│  ├─ product-list.png
│  ├─ product-detail.png
│  └─ transport-map.png
└─ wireframes/
   ├─ dashboard.pdf
   └─ mobile-flow.pdf
```

## Recursos

- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com/
- Headless UI: https://headlessui.com/
- Accessibility WCAG: https://www.w3.org/WAI/WCAG21/quickref/

---

**Coordenador de Design:** [Sua equipe]  
**Última atualização:** Dezembro 2025
