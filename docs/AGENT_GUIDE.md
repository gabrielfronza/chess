# Guia para agentes

## Contrato de execução

- Trabalhe em uma única story por vez.
- Leia `README.md`, `docs/ARCHITECTURE.md` e o arquivo da story.
- Não implemente itens explicitamente fora do escopo.
- Preserve as invariantes financeiras e a idempotência.
- Não grave segredos, tokens ou dados pessoais em logs.
- Faça migrações compatíveis e inclua testes para regras de negócio.
- Atualize documentação e `.env.example` quando criar configuração.

## Entrega obrigatória

Ao finalizar, informe: arquivos alterados, decisões tomadas, comandos executados, resultado dos testes, riscos restantes e critérios de aceite conferidos.

## Definition of Done global

- Critérios de aceite da story atendidos.
- TypeScript compila sem erros.
- Lint e testes relevantes passam.
- Erros externos têm timeout, tratamento e logs seguros.
- Endpoints novos têm autorização, validação e documentação OpenAPI.
- Operações repetíveis são idempotentes quando aplicável.
