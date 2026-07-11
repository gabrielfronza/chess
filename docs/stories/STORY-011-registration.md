# STORY-011 — Inscrição transacional

**Status:** ready  
**Dependências:** STORY-006, STORY-007, STORY-009

## História

Como usuário elegível, quero entrar em um torneio e ter minha vaga e taxa tratadas atomicamente.

## Escopo

- Validar onboarding, Lichess, status/prazo, duplicidade e saldo.
- Reservar fee, registrar no Swiss do Lichess, confirmar inscrição e capturar/deduzir reserva.
- Em falha, liberar reserva; job reconcilia estados intermediários após crash.
- UI com confirmação, progresso, sucesso e erro recuperável.

## Critérios de aceite

- Duplo clique/requisição concorrente cria uma inscrição e uma cobrança.
- Falha conhecida do Lichess libera os fundos.
- Timeout deixa estado reconciliável, sem assumir falha ou sucesso indevidamente.
- Inscrição confirmada contém referências da carteira e do Lichess.

## Verificação

Testes de integração para sucesso, saldo insuficiente, duplicidade, timeout e compensação.
