# STORY-001 — Qualidade, configuração e contratos

**Status:** ready  
**Dependências:** nenhuma

## História

Como equipe, queremos uma base reproduzível para desenvolver mobile e API com feedback rápido.

## Escopo

- Padronizar Node 22, scripts, lint, format e testes unitários.
- Configurar hook de pre-commit para executar lint com correção automática e atualizar os arquivos staged.
- Configurar variáveis validadas na inicialização da API.
- Criar pacote de contratos compartilhados sem lógica de domínio.
- Adicionar OpenAPI e endpoint `GET /api/v1/health`.
- Adicionar CI obrigatório para pull requests com lint, build e testes unitários.
- Configurar Playwright e um pipeline E2E iniciado apenas manualmente.

## Critérios de aceite

- Setup limpo funciona seguindo o README.
- Configuração inválida impede a API de iniciar com mensagem segura.
- Health check retorna versão e estado sem expor segredos.
- Todo commit executa lint com correção automática antes de ser criado.
- Pipeline de pull request executa lint sem alterar arquivos, testes unitários e build de ambos os apps.
- O check `quality-gate` pode ser configurado como obrigatório na proteção da branch `main`.
- Pipeline E2E pode ser iniciado manualmente no GitHub Actions e publica o relatório do Playwright.
- Pelo menos um teste E2E Playwright valida a aplicação em execução.

## Verificação

`npm run lint`, `npm run test:unit`, `npm run build` e `npm run test:e2e`.

No GitHub, executar manualmente o workflow E2E e proteger a branch `main`, exigindo que o check `quality-gate` passe antes do merge.
