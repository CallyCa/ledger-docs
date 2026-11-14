---
title: Referência da API
---

# Referência da API

As rotas e os exemplos desta página são as definições previstas para o Ledger. As issues de API indicadas em cada seção publicam os schemas, os campos obrigatórios e as respostas no OpenAPI conforme a implementação avança. Os números das issues correspondem ao planejamento.

## Contas

### Cadastro e consulta

| Endpoint | Requisição | Resposta | Issues |
| --- | --- | --- | --- |
| `POST /accounts` | Envia `name`. O titular vem da sessão. | `201` com os dados da conta e o cabeçalho `Location`. Nome inválido retorna `400`. | #131, #51, #54 |
| `GET /accounts/{accountId}` | Usa o ID da conta na URL. | `200` para o titular. Conta inexistente, de outro titular ou funding account retorna o mesmo `404`. `balanceMinor` passa a ser calculado pelos lançamentos na entrega financeira. | #131, #116, #58 |

```http
POST /accounts
Content-Type: application/json

{"name":"  Conta A  "}
```

```http
HTTP/1.1 201 Created
Location: /accounts/a-001
Content-Type: application/json

{"id":"a-001","name":"Conta A","currency":"BRL","balanceMinor":0}
```

Depois de receber `201`, o frontend abre a conta pelo endereço informado em `Location`. Se o nome for inválido, mostra o erro em **Nome**. Se ficar sem resposta, mantém o campo preenchido e oferece a consulta a **Minhas contas** antes de outro envio. Consulte as [regras de cadastro](../contas/cadastrar-conta.md).

## Transferências

### Enviar e reenviar

| Endpoint | Requisição | Resposta | Issues |
| --- | --- | --- | --- |
| `POST /transfers` | Envia os IDs das contas, valor inteiro em centavos e `Idempotency-Key`. | `201` após confirmar. O reenvio autorizado com os mesmos dados devolve a confirmação original. Alterar o valor com a mesma chave confirmada retorna `409`. | #135, #117, #57, #56 |

O request body de `POST /transfers` contém `sourceAccountId`, `destinationAccountId` e `amountMinor`. O valor vai de 1 a 1.000.000.000 centavos. O valor de `Idempotency-Key` tem de 1 a 128 caracteres ASCII visíveis, sem espaços. O Ledger reconhece o pedido pelo usuário, pelo tipo de operação e pelo valor do cabeçalho.

A conta A pertence a Ana e começa com 10.000 centavos. A conta B pertence a Bruno e começa com zero.

```http
POST /transfers
Content-Type: application/json
Idempotency-Key: transfer-a-b-001

{"sourceAccountId":"a-001","destinationAccountId":"b-001","amountMinor":2500}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "transactionId": "tx-001",
  "sourceAccountId": "a-001",
  "destinationAccountId": "b-001",
  "type": "transfer",
  "amountMinor": 2500,
  "currency": "BRL",
  "confirmedAt": "2026-11-14T13:30:00Z"
}
```

A termina com 7.500 centavos e B com 2.500. Se Ana reenviar a requisição com os mesmos dados, o Ledger devolve `tx-001` e o mesmo horário, com os saldos e a quantidade de lançamentos iguais. Se ela enviar 2.600 centavos usando a mesma chave, recebe `409`. Consulte as [regras de transferência](../movimentacoes/transferencia.md) e [reenvio](../movimentacoes/repeticao.md).

## Consultas

### Saldo e extrato

| Endpoint | Requisição | Resposta | Issues |
| --- | --- | --- | --- |
| `GET /accounts/{accountId}` | Usa o ID da conta do titular. | O campo `balanceMinor` informa o saldo confirmado em centavos. | #146, #58 |
| `GET /accounts/{accountId}/entries` | Usa `from` e `to` em UTC. Aceita `limit` de 1 a 100, com padrão de 20, e `cursor` para continuar. | `200` com `items` e `nextCursor`. Período ou cursor inválido retorna `400`. Conta indisponível retorna `404`. | #146, #110 |

```http
GET /accounts/a-001/entries?from=2026-11-14T09:00:00Z&to=2026-11-14T11:00:00Z&limit=2
```

O extrato inclui o início e exclui o fim do período. A API ordena pelo horário de confirmação e pelo ID do lançamento. Cada item informa o ID do lançamento, o ID da movimentação, tipo, valor em centavos, moeda, sentido e horário. A última página retorna `nextCursor: null`. Para período vazio, a resposta traz `items: []` e `nextCursor: null`. Consulte as [regras do extrato](../consultas/extrato.md).

### Listagem e comprovante

| Endpoint | Requisição | Resposta | Issues |
| --- | --- | --- | --- |
| `GET /accounts` | Aceita `limit` e `cursor`. O limite padrão é 20 e o máximo é 100. | `200` com as contas do titular em `items`, da mais recente para a mais antiga, com desempate por ID. A última página ou lista vazia retorna `nextCursor: null`. | #149, #136 |
| `GET /accounts/{accountId}/transactions/{transactionId}/receipt` | Usa o ID da conta consultada e o ID da movimentação. | `200` com os dados do lançamento na conta consultada. O mesmo `404` é usado quando a conta pertence a outra pessoa, não participou ou o ID da movimentação não existe. | #149, #137 |

Para a transferência `tx-001`, Ana consulta pela conta de origem `a-001` e vê a saída e o ID da conta B, que ela informou no pedido. Bruno consulta pela conta de destino `b-001` e vê a entrada de 2.500 centavos. Como ele é titular apenas de B, o ID da conta A fica fora dessa resposta. Consulte as [regras do comprovante](../consultas/comprovante.md).

## Estorno

### Elegibilidade, confirmação e consulta

| Endpoint | Requisição | Resposta | Issues |
| --- | --- | --- | --- |
| `GET /ops/transfers/{transactionId}/reversal-eligibility` | Exige permissão de estorno e usa o ID da transferência original. | Informa valor e elegibilidade. O saldo é reavaliado na confirmação. | #150, #111 |
| `POST /transfers/{transactionId}/reversal` | Exige permissão de estorno. Envia `reason` e `Idempotency-Key`. | `201` com os IDs do estorno e da transferência original após confirmar. | #150, #111 |
| `POST /transfers/{transactionId}/reversal/status` | Usa a mesma transferência, motivo e `Idempotency-Key` do pedido. | Informa se existe confirmação recuperada, se o pedido está em conferência ou se o reenvio foi liberado. | #150, #111, #157 |

```http
POST /transfers/tx-001/reversal
Content-Type: application/json
Idempotency-Key: reversal-tx-001

{"reason":"Transferência enviada para a conta errada"}
```

O estorno registra novos lançamentos e mantém a transferência original. Se a conta B gastar parte do saldo depois da consulta de elegibilidade e já não tiver 2.500 centavos, a confirmação rejeita o pedido sem criar lançamentos. Consulte as [regras de estorno](../movimentacoes/estorno.md).

## Recuperação

### Consulta do pedido e dados parciais

| Endpoint | Requisição | Resposta | Issues |
| --- | --- | --- | --- |
| `POST /transfer-intents/status` | Usa a sessão, os dados originais da transferência e `Idempotency-Key`. | Informa confirmação recuperada, pedido em conferência ou reenvio liberado. Consultar a situação não cria movimentação. | #151, #152 |
| Rotas de saldo, extrato e comprovante | Mantêm a autorização da consulta original. | Saldo e extrato indicam o último horário conferido. Se o período inteiro estiver em conferência, o extrato fica indisponível. O comprovante exige confirmação, lançamentos e acesso verificados. | #151, #153 |

A issue #151 define os status HTTP e os schemas para pedidos em conferência, pedidos novos bloqueados e extratos parcialmente disponíveis. Consulte as [regras de recuperação](../operacao/validar-recuperacao.md).

## Saúde da API

| Endpoint | Resposta | Issue |
| --- | --- | --- |
| `GET /health/live` | `200` com o processo ativo, inclusive se o PostgreSQL estiver indisponível. | #49 |
| `GET /health/ready` | `200` quando a API está pronta para uso. Retorna `503` se a conexão com PostgreSQL falhar. | #90 |

## Respostas de erro

| Status | Uso |
| --- | --- |
| `400` | Entrada inválida. O cadastro indica o erro no campo `name`. |
| `401` | Token ausente ou inválido. |
| `403` | Usuário autenticado sem a permissão necessária para a ação. |
| `404` | Recurso indisponível para o usuário, inclusive quando não existe. |
| `409` | Saldo ou limite impede confirmar, ou os dados divergem do pedido já confirmado com a mesma chave. |
| `500` | Falha interna. A resposta pública informa o ID da requisição para diagnóstico. |

Crédito de teste e conciliação usam os comandos especificados na issue #144. A atribuição de titular a uma conta antiga está prevista na issue condicional #142.

[Semântica HTTP (RFC 9110)](https://www.rfc-editor.org/rfc/rfc9110) · [Problem Details (RFC 9457)](https://www.rfc-editor.org/rfc/rfc9457.html)
