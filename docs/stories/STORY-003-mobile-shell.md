# STORY-003 — Shell mobile e navegação

**Status:** ready  
**Dependências:** STORY-001

## História

Como usuário, quero uma estrutura de navegação consistente e acessível no aplicativo.

## Escopo

- Configurar Expo Router, tema, safe areas, loading e error boundary.
- Criar rotas públicas, onboarding e tabs autenticadas: Home, Torneios, Carteira, Histórico e Perfil.
- Criar cliente HTTP tipado e configuração por ambiente.
- Telas são placeholders; lógica de negócio fica fora desta story.

## Critérios de aceite

- Rotas públicas e privadas têm grupos distintos.
- Deep link pode abrir uma rota de detalhe de torneio.
- Componentes base respeitam acessibilidade e estados de carregamento/erro/vazio.
- App inicia em iOS, Android ou Expo Web sem erro de TypeScript.

## Verificação

Executar typecheck e smoke test de navegação.
