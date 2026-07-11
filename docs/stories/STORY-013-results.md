# STORY-013 — Resultados e distribuição de prêmios

**Status:** ready  
**Dependências:** STORY-011

## História

Como participante, quero que o resultado final do Lichess seja sincronizado e os prêmios sejam creditados corretamente.

## Escopo

- Sincronização administrativa e por job dos standings finais.
- Snapshot imutável de colocação, score e tie-breaks.
- Política explícita de prize breakdown e créditos no ledger.
- Reconciliação, retentativa e auditoria.

## Critérios de aceite

- Só torneio finalizado no Lichess pode distribuir prêmio.
- Soma dos prêmios não excede o pool configurado.
- Reprocessar standings não duplica resultados nem créditos.
- Divergências após distribuição exigem fluxo administrativo auditado.

## Verificação

Fixtures de standings testam empates, vencedores, repetição, dado incompleto e falha parcial.
