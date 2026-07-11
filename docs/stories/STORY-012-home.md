# STORY-012 — Home autenticada

**Status:** ready  
**Dependências:** STORY-008, STORY-009, STORY-011

## História

Como usuário, quero um resumo acionável da minha atividade ao abrir o app.

## Escopo

- Endpoint agregador ou consultas coordenadas para próximos torneios, saldo, inscrições e resultados recentes.
- Cards e atalhos para marketplace, carteira, histórico e perfil.
- Cache e refresh sem mostrar dados de outro usuário.

## Critérios de aceite

- Cada seção trata vazio/erro independentemente.
- Pull-to-refresh atualiza os dados.
- Torneio registrado permite abrir detalhe e, quando cabível, o Lichess.
- Saldo e datas usam formatação consistente com o restante do app.

## Verificação

Testes do agregador e smoke test dos atalhos.
