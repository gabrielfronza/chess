# STORY-016 — Observabilidade, segurança e auditoria

**Status:** ready  
**Dependências:** STORY-006, STORY-010, STORY-013, STORY-015

## História

Como operador, quero detectar falhas e investigar ações sensíveis sem expor dados privados.

## Escopo

- Logs estruturados com correlation ID e redação de segredos/PII.
- Métricas e alertas para webhooks, jobs, inscrições presas e inconsistência financeira.
- Rate limiting, CORS, headers, limites de payload e gestão de erros.
- Audit log para admin, pagamentos, prêmios, vínculos e saques.
- Runbooks de reconciliação e resposta a incidentes.

## Critérios de aceite

- Uma jornada pode ser rastreada por correlation ID.
- Tokens, segredos, email completo e payloads sensíveis não aparecem em logs.
- Alertas cobrem falha persistente das integrações e estados presos.
- Auditoria identifica ator, ação, alvo, horário e metadados seguros.

## Verificação

Testes de redaction/rate limit e simulação documentada de falha externa.
