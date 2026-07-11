# STORY-009 — Carteira e ledger

**Status:** ready  
**Dependências:** STORY-002, STORY-004

## História

Como usuário, quero ver meu saldo e movimentações com rastreabilidade.

## Escopo

- Ledger imutável com CREDIT, DEBIT, RESERVE, RELEASE e ADJUSTMENT.
- Serviço transacional de saldo disponível e reservado.
- Endpoints de saldo e histórico paginado; tela mobile correspondente.
- Ajuste administrativo exige motivo, ator e idempotency key.

## Critérios de aceite

- Nenhum valor monetário usa float.
- Concorrência não permite saldo disponível negativo.
- Uma idempotency key não gera duas movimentações.
- Histórico mostra valor, tipo, data, status e referência.

## Verificação

Testes concorrentes de reserva, idempotência e reconciliação do ledger.
