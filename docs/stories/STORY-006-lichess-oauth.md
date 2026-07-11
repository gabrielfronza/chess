# STORY-006 — Vinculação OAuth com Lichess

**Status:** ready  
**Dependências:** STORY-005

## História

Como usuário, quero conectar minha conta Lichess sem digitar o username para poder jogar.

## Escopo

- OAuth Authorization Code com PKCE, state e callback seguro.
- Consultar identidade autenticada no Lichess e persistir tokens criptografados.
- Garantir relação um-para-um nos níveis de banco e serviço.
- Exibir conta vinculada e permitir revogação somente se não quebrar inscrição ativa.

## Critérios de aceite

- State inválido/expirado é rejeitado.
- A mesma conta Lichess não pode ser ligada a dois usuários, mesmo sob concorrência.
- Username nunca é aceito como prova de identidade.
- Falhas externas têm timeout e mensagem recuperável.

## Verificação

Testes com servidor Lichess simulado para sucesso, duplicidade, state inválido e timeout.
