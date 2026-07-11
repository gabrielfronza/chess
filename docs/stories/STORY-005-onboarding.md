# STORY-005 — Perfil e onboarding

**Status:** ready  
**Dependências:** STORY-004

## História

Como novo usuário, quero completar meus dados obrigatórios antes de participar de torneios.

## Escopo

- Formulário de nome, email, país, data de nascimento e aceite dos termos.
- API `GET/PATCH /me`, validação e registro da versão/data dos termos.
- Estado de onboarding e redirecionamento obrigatório.
- Email vindo do Auth0 é exibido e tratado conforme política definida.

## Critérios de aceite

- Campos e maioridade/política etária configurada são validados no servidor.
- Aceite armazena versão e timestamp, não apenas booleano.
- Usuário incompleto não acessa inscrição nem carteira.
- Reabertura do app continua no passo correto.

## Verificação

Testes de validação, autorização e fluxo mobile completo.
