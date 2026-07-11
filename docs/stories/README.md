# Backlog

Status inicial de todas as stories: `ready`, condicionado às dependências declaradas.

| ID | Título | Depende de |
|---|---|---|
| 001 | Qualidade, configuração e contratos | — |
| 002 | Banco de dados e modelo | 001 |
| 003 | Shell mobile e navegação | 001 |
| 004 | Autenticação Auth0 | 002, 003 |
| 005 | Perfil e onboarding | 004 |
| 006 | OAuth Lichess | 005 |
| 007 | Administração de torneios | 002, 004 |
| 008 | Marketplace e detalhes | 003, 007 |
| 009 | Carteira e ledger | 002, 004 |
| 010 | Stripe e compra de créditos | 009 |
| 011 | Inscrição transacional | 006, 007, 009 |
| 012 | Home autenticada | 008, 009, 011 |
| 013 | Resultados e prêmios | 011 |
| 014 | Histórico | 003, 013 |
| 015 | Solicitação de saque | 009 |
| 016 | Operação, segurança e auditoria | 006, 010, 013, 015 |
| 017 | E2E e release | 012, 014, 016 |
| 018 | Landing page pública | 003 |

Cada story inclui objetivo, escopo, critérios de aceite, tarefas e verificação. O detalhamento técnico pode mudar durante a implementação, mas invariantes e critérios de aceite exigem decisão explícita para serem alterados.
