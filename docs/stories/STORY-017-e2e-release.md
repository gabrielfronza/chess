# STORY-017 — Testes E2E e preparação de release

**Status:** ready  
**Dependências:** STORY-012, STORY-014, STORY-016

## História

Como equipe, queremos provar o fluxo crítico em staging e ter uma entrega repetível.

## Escopo

- E2E da jornada login → onboarding → Lichess → créditos → inscrição → resultado → prêmio → histórico.
- Cenários de falha prioritários: pagamento repetido, Lichess indisponível e saldo concorrente.
- Builds de staging, migrations, seed seguro, backup/restore e checklist de release/rollback.
- Documentar contas sandbox e separar segredos por ambiente.

## Critérios de aceite

- Jornada feliz passa em CI/staging com integrações sandbox ou simuladas controladas.
- Testes provam idempotência dos três fluxos financeiros críticos.
- Deploy e rollback estão documentados e ensaiados.
- Nenhum bloqueador crítico/alto permanece sem aceite explícito.

## Verificação

Executar pipeline completo, E2E em staging e exercício de rollback.
