# STORY-015 — Solicitação de saque

**Status:** ready  
**Dependências:** STORY-009

## História

Como usuário, quero solicitar um saque para que a equipe possa processá-lo manualmente enquanto o provedor não é definido.

## Escopo

- Criar solicitação e reservar o valor no ledger.
- Estados REQUESTED, APPROVED, REJECTED, PAID e CANCELLED.
- Administração via API, com motivo e auditoria.
- Não integrar payout ou coletar dados bancários nesta fase.

## Critérios de aceite

- Solicitação não excede saldo disponível e não duplica por idempotency key.
- Rejeição/cancelamento libera reserva exatamente uma vez.
- Marcar PAID exige confirmação administrativa e referência externa.
- UI deixa claro que processamento é manual e não promete prazo.

## Verificação

Testes da máquina de estados, reservas e autorização administrativa.
