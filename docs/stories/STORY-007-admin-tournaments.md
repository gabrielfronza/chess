# STORY-007 — Administração de torneios

**Status:** ready  
**Dependências:** STORY-002, STORY-004

## História

Como administrador, quero criar, editar, publicar e cancelar torneios manuais.

## Escopo

- CRUD administrativo com nome, descrição, agenda, duração, ritmo, rodadas, fee, prize pool, regras e Lichess tournament ID.
- Máquina de estados DRAFT, PUBLISHED, REGISTRATION_CLOSED, RUNNING, FINISHED e CANCELLED.
- Lista de participantes e trilha de auditoria.
- Nesta story, a interface administrativa pode ser Swagger/API.

## Critérios de aceite

- Apenas ADMIN usa endpoints de escrita.
- Transições inválidas e edição financeira após inscrições são bloqueadas.
- Torneio publicado exige todos os campos e vínculo Lichess válidos.
- Cancelamento registra motivo e prepara reembolso idempotente quando necessário.

## Verificação

Testes da máquina de estados, RBAC e validações.
