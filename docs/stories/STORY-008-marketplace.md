# STORY-008 — Marketplace e detalhes

**Status:** ready  
**Dependências:** STORY-003, STORY-007

## História

Como usuário, quero descobrir torneios e consultar todas as condições antes de entrar.

## Escopo

- Endpoints paginados de torneios publicados e detalhe.
- Lista mobile com nome, data, ritmo, rodadas, fee, prêmio, participantes e status.
- Tela de detalhe com agenda, duração, regras, participantes e CTA contextual.
- Estados vazio, loading, erro e atualização manual.

## Critérios de aceite

- Rascunhos não aparecem para usuários comuns.
- Datas usam timezone do aparelho e valores formatam USD.
- Paginação não duplica itens.
- CTA informa por que a inscrição está indisponível.

## Verificação

Testes de consulta/filtro e testes de componentes para estados principais.
