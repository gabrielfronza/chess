# STORY-014 — Histórico de torneios

**Status:** ready  
**Dependências:** STORY-003, STORY-013

## História

Como usuário, quero consultar meus torneios passados, colocação e prêmio.

## Escopo

- Endpoint paginado do histórico do usuário.
- Tela com nome, data, fee, participantes, colocação e prêmio.
- Detalhe abre resultado/torneio correspondente.

## Critérios de aceite

- Usuário vê apenas o próprio histórico.
- Ordenação padrão é mais recente primeiro e paginação é estável.
- Ausência de prêmio é diferenciada de sincronização pendente.
- Valores e colocação vêm do snapshot final.

## Verificação

Testes de autorização, paginação e estados visuais.
