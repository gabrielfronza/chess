# STORY-004 — Autenticação com Auth0

**Status:** ready  
**Dependências:** STORY-002, STORY-003

## História

Como visitante, quero criar conta e entrar com segurança para acessar a plataforma.

## Escopo

- Universal Login do Auth0 no app com PKCE e armazenamento seguro de sessão.
- Guard JWT/JWKS na API, audience/issuer e sincronização idempotente do usuário.
- Logout e tratamento de token expirado.
- Papel `USER` e `ADMIN` mantido pela API; não confiar em papel enviado pelo cliente.

## Critérios de aceite

- Endpoint privado rejeita token ausente/inválido e aceita token válido.
- Primeiro login cria usuário uma única vez; logins seguintes atualizam apenas campos permitidos.
- Logout remove credenciais locais.
- Nenhum token aparece em logs ou armazenamento inseguro.

## Verificação

Testes unitários do guard, integração de sincronização e smoke test do login.
