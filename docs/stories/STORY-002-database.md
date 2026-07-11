# STORY-002 — PostgreSQL, TypeORM e modelo inicial

**Status:** ready  
**Dependências:** STORY-001

## História

Como equipe, queremos persistência transacional e um esquema versionado para sustentar o domínio.

## Escopo

- Docker Compose com PostgreSQL e TypeORM.
- Configurar um `DataSource` compartilhado pela aplicação e pela CLI do TypeORM.
- Versionar migrations para toda alteração de schema; manter `synchronize: false` nos ambientes da aplicação.
- Modelar User, LichessAccount, Tournament, Registration, Wallet, WalletEntry, Payment, Result, WithdrawalRequest e AuditLog.
- Usar enums explícitos de status, timestamps UTC, constraints únicas e dinheiro em centavos.
- Seed somente com administrador e torneios fictícios não financeiros.

## Critérios de aceite

- Migrations sobem o banco do zero e podem ser aplicadas pela CLI em CI.
- A aplicação não depende de sincronização automática do schema.
- Constraints impedem vínculo Lichess, inscrição e idempotency key duplicados.
- Relações e índices cobrem consultas descritas no MVP.
- Teste de integração grava e recupera o agregado principal.

## Verificação

Subir o banco, executar as migrations pela CLI do TypeORM, executar seed e testes de integração.
