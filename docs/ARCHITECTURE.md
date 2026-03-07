# Arquitetura do Projeto

Este documento explica a organização dos componentes e a decisão sobre os backends.

## Backends

- **`backend-nest`**
  - Projeto NestJS atualizado com Prisma, Swagger, validação e arquitetura modular.
  - Considerado peça principal para desenvolvimento futuro.
  - Inclui pipelines de testes, scripts de migração e todos os novos recursos.

- **`backend`** (Express)
  - Código antigo que foi inicialmente usado para prototipação.
  - Não possui `package.json` independente e usa `ts-nocheck` em muitos arquivos.
  - **Depreciado:** não deve ser modificado. Ele existe apenas para referência histórica e possivelmente para copiar pequenas implementações durante migrações.
  - A meta de longo prazo é remover completamente este diretório assim que a `backend-nest` estiver completa e estabilizada.

## Monorepo

O repositório foi reorganizado como monorepo usando `npm workspaces` (poderia ser facilmente adaptado para `yarn` ou `pnpm`).
Pacotes incluídos:

- `backend-nest`
- `frontend`

Scripts globais (`npm run lint-all`, `test-all` etc.) facilitam operações em todo o monorepo.

## Dependências e ferramentas

- `tsconfig-paths`/aliases configurados no `tsconfig.json` de cada subprojeto para imports padronizados.
- Husky + lint-staged para garantir qualidade nos commits.

> Consulte `README.md` na raiz para instruções de inicialização e lista de melhorias.
