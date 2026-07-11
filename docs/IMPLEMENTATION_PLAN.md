# Plano de implementação do MVP

## Estratégia

As stories estão ordenadas por dependência e risco. Primeiro criamos uma vertical fina de infraestrutura e identidade; depois torneios e dinheiro; por fim integrações, operação e qualidade. Cada arquivo em `docs/stories` é uma unidade que pode ser entregue e revisada isoladamente.

## Onda 0 — Base

1. `STORY-001` — Qualidade, configuração e contratos.
2. `STORY-002` — PostgreSQL, TypeORM, migrations e modelo inicial.
3. `STORY-003` — Shell do aplicativo e navegação.
4. `STORY-018` — Landing page pública no Expo Web.

As stories 002 e 003 podem ser executadas em paralelo após a 001. A 018 pode começar assim que a 003 terminar.

## Onda 1 — Identidade

5. `STORY-004` — Auth0 na API e no app.
6. `STORY-005` — Perfil e onboarding.
7. `STORY-006` — Vinculação OAuth com Lichess.

## Onda 2 — Catálogo e operação

8. `STORY-007` — Administração de torneios.
9. `STORY-008` — Marketplace e detalhes.
10. `STORY-009` — Carteira e ledger.

As stories 008 e 009 podem ser paralelizadas depois que seus pré-requisitos estiverem prontos.

## Onda 3 — Receita e inscrição

11. `STORY-010` — Compra de créditos com Stripe.
12. `STORY-011` — Inscrição transacional em torneio.
13. `STORY-012` — Home autenticada.

## Onda 4 — Fechamento do ciclo

14. `STORY-013` — Sincronização de resultados e prêmios.
15. `STORY-014` — Histórico de torneios.
16. `STORY-015` — Solicitação de saque (sem payout automático).

## Onda 5 — Prontidão do MVP

17. `STORY-016` — Observabilidade, segurança e auditoria.
18. `STORY-017` — Testes end-to-end e preparação de release.

## Marcos verificáveis

- M1 (Stories 001–006 e 018): visitante acessa a landing; usuário entra, completa onboarding e liga o Lichess.
- M2 (Stories 007–009): administrador publica torneio e usuário consulta catálogo/saldo.
- M3 (Stories 010–012): usuário compra créditos e se inscreve com compensação de falhas.
- M4 (Stories 013–015): resultado, prêmio, histórico e pedido de saque fecham a jornada.
- M5 (Stories 016–017): fluxo crítico testado e operável em staging.

## Ordem recomendada por agente

Passe ao agente o caminho exato da story. Ele deve começar confirmando dependências, terminar executando a seção “Verificação” e não iniciar a próxima story automaticamente.
