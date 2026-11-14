---
title: Referência da API
---

# Referência da API

Este é o contrato HTTP previsto para o Ledger. As rotas implementadas devem expor no OpenAPI os mesmos campos, respostas e exemplos. A coluna **Implementação** aponta para as issues do repositório Ledger.

## Convenções

- Contas, movimentações e lançamentos usam IDs UUID. Os exemplos usam os mesmos IDs para que o cadastro, a transferência, o extrato e o comprovante possam ser conferidos em conjunto.
- Valores são inteiros em centavos. A moeda é `BRL`. Horários de confirmação e de conferência usam ISO 8601 em UTC, com sufixo `Z`.
- Nas rotas de negócio, os exemplos pressupõem `Authorization: Bearer <access-token>` de quem executa a operação. O titular vem da sessão. As rotas de operador também verificam a permissão correspondente.
- Respostas de sucesso com dados usam `application/json`. Erros de negócio usam [Problem Details](#respostas-de-erro).

## Contas

### Cadastro e consulta

| Endpoint | Requisição | Resposta | Implementação |
| --- | --- | --- | --- |
| `POST /accounts` | JSON com `name` obrigatório. Após remover espaços das extremidades, o nome deve ter de 1 a 100 caracteres visíveis. | `201` com a conta e o header `Location`. Erro de nome retorna `400` com `errors.name`. Cadastro suspenso retorna `503`. | [#37](https://github.com/CallyCa/Ledger/issues/37) |
| `GET /accounts/{accountId}` | ID da conta na URL. | `200` para o titular atual. Conta inexistente, alheia ou interna retorna o mesmo `404`. | [#38](https://github.com/CallyCa/Ledger/issues/38), [#47](https://github.com/CallyCa/Ledger/issues/47) |

```http
POST /accounts
Content-Type: application/json

{"name":"  Conta A  "}
```

```http
HTTP/1.1 201 Created
Location: /accounts/7395dd70-4752-4b96-bd43-666797b1a4ac
Content-Type: application/json

{"id":"7395dd70-4752-4b96-bd43-666797b1a4ac","name":"Conta A","currency":"BRL","balanceMinor":0}
```

O POST confirma depois de persistir a conta. O GET indicado em `Location` devolve os mesmos campos. `balanceMinor` começa em zero e passa a refletir os lançamentos confirmados na entrega financeira. Após perder a resposta do cadastro, consultar [Minhas contas](#listagem-e-comprovante) antes de enviar outro POST. Dois cadastros aceitos com o mesmo nome geram IDs diferentes. [Regras de cadastro](../contas/cadastrar-conta.md)

## Transferências

### Enviar e reenviar

| Endpoint | Requisição | Resposta | Implementação |
| --- | --- | --- | --- |
| `POST /transfers` | JSON com `sourceAccountId`, `destinationAccountId`, `amountMinor` e header `Idempotency-Key`. | `201` com a confirmação. Reenvio igual e autorizado devolve o mesmo `201` e o mesmo JSON. Dados diferentes com a mesma chave confirmada retornam `409`. | [#28](https://github.com/CallyCa/Ledger/issues/28), [#48](https://github.com/CallyCa/Ledger/issues/48) |

`amountMinor` vai de 1 a 1.000.000.000. `Idempotency-Key` contém de 1 a 128 caracteres ASCII visíveis, sem espaços. O Ledger reconhece a chave pelo usuário e pelo tipo de operação. A origem precisa ser do titular autenticado. O destino pode pertencer a outro titular.

A conta A de Ana começa com 10.000 centavos. A conta B de Bruno começa com zero.

```http
POST /transfers
Content-Type: application/json
Idempotency-Key: transfer-a-b-001

{"sourceAccountId":"7395dd70-4752-4b96-bd43-666797b1a4ac","destinationAccountId":"e36d4008-0b94-4f98-b180-db13b5f5314f","amountMinor":2500}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "transactionId": "94751280-c136-4abc-b871-2e8053125c47",
  "sourceAccountId": "7395dd70-4752-4b96-bd43-666797b1a4ac",
  "destinationAccountId": "e36d4008-0b94-4f98-b180-db13b5f5314f",
  "type": "transfer",
  "amountMinor": 2500,
  "currency": "BRL",
  "confirmedAt": "2026-11-14T09:30:00Z"
}
```

A termina com 7.500 centavos e B com 2.500. Ao repetir os dados e a chave, Ana recebe o mesmo `transactionId` e `confirmedAt`. O histórico continua com um débito e um crédito. Alterar para 2.600 centavos com a mesma chave retorna `409` e `code: "idempotencyConflict"`. Um pedido em conferência após restauração segue o [contrato de recuperação](#consulta-do-pedido-e-dados-parciais). [Transferência](../movimentacoes/transferencia.md) e [reenvio](../movimentacoes/repeticao.md)

## Consultas

### Saldo e extrato

| Endpoint | Requisição | Resposta | Implementação |
| --- | --- | --- | --- |
| `GET /accounts/{accountId}` | ID da conta do titular. | `200` com `balanceMinor` confirmado. Durante a recuperação, pode incluir o horário da última conferência. | [#38](https://github.com/CallyCa/Ledger/issues/38), [#47](https://github.com/CallyCa/Ledger/issues/47), [#65](https://github.com/CallyCa/Ledger/issues/65) |
| `GET /accounts/{accountId}/entries` | `from` e `to` obrigatórios, em UTC. `limit` de 1 a 100, padrão 20. `cursor` opcional. | `200` com `items` e `nextCursor`. Período ou cursor inválido retorna `400`. Conta indisponível retorna `404`. | [#47](https://github.com/CallyCa/Ledger/issues/47) |

```http
GET /accounts/7395dd70-4752-4b96-bd43-666797b1a4ac/entries?from=2026-11-14T09:00:00Z&to=2026-11-14T11:00:00Z&limit=2
```

```json
{
  "items": [
    {
      "id": "b9b28eba-7cb2-40fe-aa4e-8c6b6b0e948c",
      "transactionId": "94751280-c136-4abc-b871-2e8053125c47",
      "type": "transfer",
      "amountMinor": 2500,
      "currency": "BRL",
      "direction": "outflow",
      "confirmedAt": "2026-11-14T09:30:00Z"
    }
  ],
  "nextCursor": null
}
```

O exemplo contém uma saída no período. Cada item tem `id` do lançamento, `transactionId`, `type`, `amountMinor` positivo, `currency`, `direction` e `confirmedAt`. `type` aceita `testCredit`, `transfer` e `reversal`. `direction` aceita `inflow` e `outflow`, sempre da perspectiva da conta solicitada. Itens de `reversal` também incluem `originalTransactionId`. Esse campo é omitido nos demais tipos.

O período inclui `from` e exclui `to`, com `from < to`. O extrato ordena por `confirmedAt` e depois por `id`, ambos em ordem crescente. O cursor é opaco, vinculado à conta e aos filtros do período. Na última página ou em período sem lançamentos, `nextCursor` é `null`. Quando o período estiver vazio, `items` é `[]`. [Regras do extrato](../consultas/extrato.md)

### Listagem e comprovante

| Endpoint | Requisição | Resposta | Implementação |
| --- | --- | --- | --- |
| `GET /accounts` | `limit` de 1 a 100, padrão 20, e `cursor` opcional. | `200` com `items` e `nextCursor`. Cursor ou limite inválido retorna `400`. | [#41](https://github.com/CallyCa/Ledger/issues/41) |
| `GET /accounts/{accountId}/transactions/{transactionId}/receipt` | IDs da conta consultada e da movimentação. | `200` com a perspectiva da conta indicada. Um único `404` cobre conta alheia, inexistente ou que não participou, e movimentação indisponível. | [#49](https://github.com/CallyCa/Ledger/issues/49) |

```http
GET /accounts?limit=1
```

```json
{
  "items": [
    {"id":"7395dd70-4752-4b96-bd43-666797b1a4ac","name":"Conta A","currency":"BRL","balanceMinor":0}
  ],
  "nextCursor": null
}
```

A lista retorna as contas do titular do cadastro mais recente ao mais antigo, com `id` crescente em caso de empate. Cada item inclui `id`, `name`, `currency` e `balanceMinor` nas mesmas condições de cobertura do detalhe. O cursor é vinculado ao titular. `nextCursor` é `null` na última página. Se o saldo de uma conta que já pode ser listada estiver em conferência, aplicar a disponibilidade descrita em [Recuperação](#consulta-do-pedido-e-dados-parciais). [Regras de listagem](../contas/listar-contas.md)

```http
GET /accounts/e36d4008-0b94-4f98-b180-db13b5f5314f/transactions/94751280-c136-4abc-b871-2e8053125c47/receipt
```

```json
{
  "transactionId": "94751280-c136-4abc-b871-2e8053125c47",
  "accountId": "e36d4008-0b94-4f98-b180-db13b5f5314f",
  "type": "transfer",
  "direction": "inflow",
  "amountMinor": 2500,
  "currency": "BRL",
  "confirmedAt": "2026-11-14T09:30:00Z"
}
```

O exemplo é a entrada que Bruno vê na conta B. Ao consultar pela conta A, Ana vê `direction: "outflow"` e `counterpartyAccountId` com o ID de B que informou no pedido. Para o recebedor, `counterpartyAccountId` só aparece se ele também for titular da origem. O comprovante de `testCredit` omite o ID da funding account. O de `reversal` inclui `originalTransactionId` e omite `counterpartyAccountId`, motivo e operador. A autorização e a projeção dos campos são avaliadas em cada consulta. [Regras do comprovante](../consultas/comprovante.md)

## Estorno

### Elegibilidade, confirmação e consulta

| Endpoint | Requisição | Resposta | Implementação |
| --- | --- | --- | --- |
| `GET /ops/transfers/{transactionId}/reversal-eligibility` | ID da transferência original e permissão de estorno. | `200` com `transactionId`, `amountMinor`, `currency`, `eligible` e `reasonCode`. | [#71](https://github.com/CallyCa/Ledger/issues/71) |
| `POST /transfers/{transactionId}/reversal` | JSON com `reason` e header `Idempotency-Key`. Exige permissão de estorno. | `201` com a confirmação. `409` se a transferência perdeu a elegibilidade ou a chave está em conflito. | [#71](https://github.com/CallyCa/Ledger/issues/71) |
| `POST /transfers/{transactionId}/reversal/status` | Usa o ID da transferência original, o motivo normalizado e a chave do pedido. Exige permissão atual de estorno. | `200` com a situação descrita em [Recuperação](#consulta-do-pedido-e-dados-parciais). | [#64](https://github.com/CallyCa/Ledger/issues/64) |

Para uma transferência confirmada e visível ao operador, `reasonCode` é `null` se `eligible` for `true`. Quando `eligible` for `false`, usar `alreadyReversed`, `insufficientFunds`, `balanceLimitExceeded` ou `recoveryInProgress`, conforme a restrição encontrada. Recurso indisponível recebe `404`. A elegibilidade mostra o valor do estorno e o motivo da inelegibilidade, sem expor saldos das contas. O POST revalida a operação antes do commit.

```json
{
  "transactionId":"94751280-c136-4abc-b871-2e8053125c47",
  "amountMinor":2500,
  "currency":"BRL",
  "eligible":false,
  "reasonCode":"insufficientFunds"
}
```

O exemplo de elegibilidade indica que o estorno devolveria 2.500 centavos, mas o saldo do destino original é insuficiente.

```http
POST /transfers/94751280-c136-4abc-b871-2e8053125c47/reversal
Content-Type: application/json
Idempotency-Key: reversal-tx-001

{"reason":"Transferência enviada para a conta errada"}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "transactionId": "51903aaa-02ba-42b5-a396-92b116c4b521",
  "originalTransactionId": "94751280-c136-4abc-b871-2e8053125c47",
  "type": "reversal",
  "amountMinor": 2500,
  "currency": "BRL",
  "confirmedAt": "2026-11-14T14:30:00Z"
}
```

`reason` tem de 1 a 250 caracteres após remoção dos espaços das extremidades. A confirmação acrescenta os lançamentos compensatórios e preserva a transferência original. Se B gastar parte do saldo entre a elegibilidade e a confirmação, o POST devolve `409` com `code: "insufficientFunds"` e o banco mantém o histórico anterior. Reenviar o mesmo pedido autorizado devolve o mesmo `201` com o ID original do estorno. [Regras de estorno](../movimentacoes/estorno.md)

## Recuperação

### Consulta do pedido e dados parciais

| Endpoint ou operação | Requisição | Resposta | Implementação |
| --- | --- | --- | --- |
| `POST /transfer-intents/status` | Titular da origem, JSON original de `POST /transfers` e a mesma `Idempotency-Key`. | `200` com a situação do pedido. | [#64](https://github.com/CallyCa/Ledger/issues/64) |
| `POST /transfers/{transactionId}/reversal/status` | Permissão atual de estorno, ID da transferência original, JSON com `reason` e a mesma chave. | `200` com a situação do pedido. | [#64](https://github.com/CallyCa/Ledger/issues/64) |
| Consultas de conta, extrato e comprovante | Mesmas regras de autorização da consulta original. | `200` se os dados solicitados ou parte do intervalo do extrato tiverem sido conferidos. `503` com `code: "recoveryInProgress"` se o dado autorizado ainda estiver indisponível. | [#65](https://github.com/CallyCa/Ledger/issues/65) |
| Novo cadastro, crédito, transferência ou estorno suspenso | Requisição válida e autorizada que dependa dos dados em conferência. | `503` com `code: "recoveryInProgress"`. O pedido anterior em conferência também usa esse erro se o cliente tentar confirmá-lo diretamente. | [#63](https://github.com/CallyCa/Ledger/issues/63), [#64](https://github.com/CallyCa/Ledger/issues/64) |

Os endpoints de situação consultam o histórico e o estado de recuperação. Eles deixam saldo, postings e registros de idempotência intactos. Entrada inválida retorna `400`, sessão ausente ou inválida retorna `401` e falta de permissão de estorno retorna `403`. Se o pedido estiver fora do escopo da pessoa, retornar `404`. Se a chave pertencer a um pedido confirmado autorizado com dados diferentes, usar `409` com `code: "idempotencyConflict"`.

| `status` em `200` | Quando devolver | Outros campos |
| --- | --- | --- |
| `recovered` | A confirmação original e os lançamentos foram conferidos e a autorização atual foi verificada. | `confirmation` com o mesmo JSON do `201` original. |
| `underReview` | As evidências ainda são insuficientes ou há confirmação encontrada fora da base recuperada que precisa ser recomposta. | Apenas `status`. |
| `retryBlocked` | Há prova de que o pedido terminou sem confirmar e alguma conta envolvida continua suspensa. | Apenas `status`. |
| `retryAllowed` | Há prova de que o pedido terminou sem confirmar e todas as contas envolvidas já foram liberadas. | Apenas `status`. O cliente repete os dados originais e a mesma chave. |

```http
POST /transfer-intents/status
Content-Type: application/json
Idempotency-Key: transfer-after-backup-001

{"sourceAccountId":"7395dd70-4752-4b96-bd43-666797b1a4ac","destinationAccountId":"e36d4008-0b94-4f98-b180-db13b5f5314f","amountMinor":2500}
```

```json
{"status":"underReview"}
```

Para um pedido das 10:05 sem resposta, com backup conferido até 10:00, a ausência da chave restaurada deixa o pedido em `underReview`. Data informada pelo cliente e ausência da chave na base restaurada são insuficientes para liberar o reenvio. Se a confirmação original das 10:05 for recuperada e verificada, a consulta devolve a confirmação dentro de `confirmation`.

```json
{
  "status": "recovered",
  "confirmation": {
    "transactionId": "7695dd70-4752-4b96-bd43-666797b1a4ac",
    "sourceAccountId": "7395dd70-4752-4b96-bd43-666797b1a4ac",
    "destinationAccountId": "e36d4008-0b94-4f98-b180-db13b5f5314f",
    "type": "transfer",
    "amountMinor": 2500,
    "currency": "BRL",
    "confirmedAt": "2026-11-14T10:05:00Z"
  }
}
```

Para estorno, `confirmation` contém o JSON do `201` do estorno, incluindo `originalTransactionId`.

#### Cobertura do saldo e do extrato

`verifiedThrough` indica o último instante conferido, inclusive. O saldo recuperado usa `coverage: {"status":"verifiedAsOf","verifiedThrough":"..."}` dentro do objeto da conta. A aplicação exibe o horário e pode sinalizar o valor como desatualizado. Quando uma conta listável ainda não tem saldo conferido, o item mantém seus dados autorizados com `balanceMinor: null` e `coverage: {"status":"unavailable"}`. Nesse caso, a consulta ao detalhe devolve `503`. Em operação normal, os objetos de conta e de extrato omitem `coverage`.

Para extrato com início igual ou anterior ao limite conferido e fim posterior, `coverage.status` é `partial`. A consulta preserva as regras do período, devolve lançamentos confirmados até `verifiedThrough` e limita o cursor ao trecho conferido. Se `to` for igual ou anterior a `verifiedThrough` enquanto durar a recuperação, o extrato devolve `coverage.status: "complete"` com o mesmo `verifiedThrough`. Se o início do período for posterior a `verifiedThrough`, devolver `503` com `code: "recoveryInProgress"`. Em qualquer caso, o comprovante só é servido depois da conferência do registro e dos lançamentos. A API só informa a recuperação de um recurso quando já conseguiu confirmar a autorização para consultá-lo. Caso a titularidade ainda dependa de dados em conferência, a consulta não devolve os dados nem informa se o recurso existe e usa o mesmo `404` das demais consultas indisponíveis.

```json
{
  "items": [
    {
      "id": "b9b28eba-7cb2-40fe-aa4e-8c6b6b0e948c",
      "transactionId": "94751280-c136-4abc-b871-2e8053125c47",
      "type": "transfer",
      "amountMinor": 2500,
      "currency": "BRL",
      "direction": "outflow",
      "confirmedAt": "2026-11-14T09:30:00Z"
    }
  ],
  "nextCursor": null,
  "coverage": {"status":"partial","verifiedThrough":"2026-11-14T10:00:00Z"}
}
```

No exemplo, Ana solicitou de 09:00 a 11:00. Uma consulta só de 10:30 a 11:00 recebe `503`. [Regras de recuperação](../operacao/validar-recuperacao.md)

## Saúde da API

| Endpoint | Resposta | Implementação |
| --- | --- | --- |
| `GET /health/live` | `200` com o processo ativo, inclusive se o PostgreSQL estiver indisponível. | [#22](https://github.com/CallyCa/Ledger/issues/22) |
| `GET /health/ready` | `200` quando o host está pronto. `503` se a dependência PostgreSQL estiver indisponível. | [#22](https://github.com/CallyCa/Ledger/issues/22) |

## Respostas de erro

Erros de negócio usam `application/problem+json`. `type` é `about:blank` e `title` usa a descrição do status HTTP. `status` representa o mesmo código da resposta. `code` diferencia causas programaticamente. `errors` aparece quando houver erro por campo e contém uma lista de mensagens por chave. Um erro interno inclui `requestId` para diagnóstico. O cliente usa `status` e `code` para detectar o caso.

| Status | `code` | Uso |
| --- | --- | --- |
| `400` | `validationFailed` | Campos, parâmetros ou chave inválidos. O cadastro aponta a validação em `errors.name`. |
| `401` | `authenticationRequired` | Token ausente ou inválido. Incluir `WWW-Authenticate: Bearer`. |
| `403` | `permissionDenied` | Pessoa autenticada sem permissão para a ação de operador. |
| `404` | `resourceUnavailable` | Recurso indisponível para o usuário. A resposta não revela se o recurso existe para outro titular. |
| `409` | `insufficientFunds`, `balanceLimitExceeded`, `idempotencyConflict`, `alreadyReversed` | Rejeição por saldo, limite, mudança do pedido vinculado à chave ou estorno já confirmado. Reenvio idêntico com a chave original recupera a confirmação. |
| `429` | `rateLimitExceeded` | Limite de requisições excedido nas rotas cobertas pela política. |
| `500` | `internalError` | Falha interna. O `requestId` identifica a ocorrência nos logs. |
| `503` | `recoveryInProgress` | Operação temporariamente indisponível durante a conferência. |

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "code": "validationFailed",
  "errors": {"name":["Informe um nome com 1 a 100 caracteres."]}
}
```

Crédito de teste [#46](https://github.com/CallyCa/Ledger/issues/46) e conciliação [#50](https://github.com/CallyCa/Ledger/issues/50) são comandos do backend. A atribuição de titular a uma conta antiga está em [#73](https://github.com/CallyCa/Ledger/issues/73).

[Semântica HTTP (RFC 9110)](https://www.rfc-editor.org/rfc/rfc9110) · [Problem Details (RFC 9457)](https://www.rfc-editor.org/rfc/rfc9457.html)
