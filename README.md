# Chess Tournament Platform

Base do MVP para torneios de xadrez pagos. A plataforma gerencia usuários, inscrições, carteira, pagamentos e prêmios; o Lichess gerencia as partidas, emparceiramentos e classificação.

## Estrutura

- `apps/mobile`: aplicativo React Native com Expo e TypeScript.
- `apps/api`: API NestJS com TypeScript.
- `packages/contracts`: contratos compartilhados (será implementado na Story 01).
- `docs/IMPLEMENTATION_PLAN.md`: ordem de execução do MVP.
- `docs/stories`: backlog executável, uma story por arquivo.

## Pré-requisitos

- Node.js 22 LTS (o Node 23 não é suportado pelo Metro usado pelo Expo atual).
- npm 10 ou superior.
- Docker, a partir da story de infraestrutura.

## Começar

```bash
nvm use
npm --prefix apps/api install
npm --prefix apps/mobile install
npm run dev:api
```

Em outro terminal:

```bash
npm run dev:mobile
```

A API inicial responde em `http://localhost:3000`. Variáveis futuras estão documentadas em `.env.example` e devem ser configuradas story a story.

## Como executar o backlog com agentes

1. Escolha somente uma story marcada como `ready` cujas dependências estejam concluídas.
2. Envie ao agente o arquivo da story, `docs/AGENT_GUIDE.md` e os arquivos citados em “Contexto”.
3. Exija testes e os comandos da seção “Verificação”.
4. Revise os critérios de aceite antes de marcar a story como `done`.
5. Stories da mesma onda só devem ser paralelizadas quando não alterarem os mesmos módulos.

Consulte [o plano de implementação](docs/IMPLEMENTATION_PLAN.md) para a sequência completa.
