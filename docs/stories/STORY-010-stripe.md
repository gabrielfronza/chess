# STORY-010 — Compra de créditos com Stripe

**Status:** ready  
**Dependências:** STORY-009

## História

Como usuário, quero adicionar créditos em USD à carteira por meio do Stripe.

## Escopo

- Criar sessão/intenção de pagamento para valores permitidos.
- Webhook assinado como autoridade para confirmar o crédito.
- Persistir estado do pagamento, event ID e idempotência.
- Tela mobile inicia checkout e acompanha o resultado.

## Critérios de aceite

- Retorno do cliente sozinho nunca credita saldo.
- Webhook repetido credita exatamente uma vez.
- Assinatura inválida é rejeitada e falhas são retentáveis.
- Valor/moeda do evento precisam coincidir com o pagamento criado.

## Verificação

Testar via Stripe CLI os cenários sucesso, repetição, falha e assinatura inválida.
