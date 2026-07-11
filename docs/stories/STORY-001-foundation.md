# STORY-001 — Qualidade, configuração e contratos

**Status:** ready  
**Dependências:** nenhuma

## História

Como equipe, queremos uma base reproduzível para desenvolver mobile e API com feedback rápido.

## Escopo

- Padronizar Node 22, scripts, lint, format e testes.
- Configurar variáveis validadas na inicialização da API.
- Criar pacote de contratos compartilhados sem lógica de domínio.
- Adicionar OpenAPI e endpoint `GET /api/v1/health`.
- Adicionar CI para lint, build e testes.

## Critérios de aceite

- Setup limpo funciona seguindo o README.
- Configuração inválida impede a API de iniciar com mensagem segura.
- Health check retorna versão e estado sem expor segredos.
- Pipeline executa lint, testes e build de ambos os apps.

## Verificação

`npm run lint`, `npm test` e build dos projetos.
