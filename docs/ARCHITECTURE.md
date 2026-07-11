# Arquitetura do MVP

## Decisões principais

- Monólito modular NestJS no backend. É a opção mais simples para preservar transações de inscrição e carteira no MVP.
- PostgreSQL como fonte de verdade; TypeORM será introduzido na fundação, com evolução do schema exclusivamente por migrations versionadas e `synchronize: false` fora dos testes.
- Valores monetários armazenados em centavos de USD, nunca em ponto flutuante.
- Ledger imutável para carteira. O saldo é derivado/atualizado apenas dentro de transações do banco.
- Auth0 emite a identidade; a API mantém perfil, papel e estado da conta.
- OAuth PKCE do Lichess liga a conta sem entrada manual de username.
- Stripe Checkout/Payment Intent adiciona créditos; webhooks assinados confirmam o crédito de forma idempotente.
- Jobs assíncronos cuidam da sincronização de resultados e retentativas das integrações.

## Módulos da API

`auth`, `users`, `lichess`, `tournaments`, `registrations`, `wallet`, `payments`, `results`, `admin` e `jobs`.

## Invariantes críticas

1. Um usuário da plataforma se liga a no máximo uma conta Lichess, e vice-versa.
2. Uma inscrição confirmada corresponde a uma única reserva/cobrança de entry fee.
3. Falha no Lichess após reserva libera os fundos de forma idempotente.
4. Um evento Stripe ou sincronização Lichess repetido não duplica créditos, inscrições nem prêmios.
5. Ajustes administrativos e alterações financeiras sempre geram trilha de auditoria.

## Fora do MVP

Assinatura, restrições por rating, criação automática de torneios, provedor/processamento final de saques, microserviços e chat.

Observação: a landing page será entregue pela saída web responsiva do Expo na STORY-018. Caso SEO e marketing se tornem críticos, ela deverá migrar depois para uma aplicação web dedicada.
