# STORY-018 — Landing page pública

**Status:** ready  
**Dependências:** STORY-003

## História

Como visitante, quero entender a proposta e ver evidências de atividade antes de criar uma conta.

## Escopo

- Rota pública responsiva no Expo Web com Hero, Como funciona, próximos torneios, vencedores recentes e FAQ.
- CTAs de Login e Cadastro direcionam ao Auth0 quando a STORY-004 estiver disponível; antes disso podem usar adaptador/placeholder explícito.
- Endpoints públicos retornam somente torneios publicados e vencedores já finalizados, sem dados pessoais extras.
- Metadados, acessibilidade, performance e analytics consentido básico.

## Critérios de aceite

- Conteúdo principal funciona em desktop e mobile web.
- Nenhuma funcionalidade privada é acessível sem autenticação.
- Estados vazios não quebram a página nem inventam resultados.
- Lighthouse de staging não aponta problema crítico de acessibilidade ou segurança.

## Verificação

Executar export web, testes das consultas públicas e auditoria Lighthouse.
