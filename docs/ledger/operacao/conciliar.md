---
title: Conciliar histórico e saldo
---

# Conciliar histórico e saldo

## Conferência de saldos e lançamentos

Escolha o ambiente, as contas ou movimentações e o horário de referência. Use as mesmas contas e o mesmo horário para contar lançamentos e calcular saldos. Para conferir um saldo até 10:00, considere as entradas e saídas confirmadas até 10:00, inclusive as anteriores ao período exibido no extrato.

| Conferência | Resultado esperado |
| --- | --- |
| Lançamentos por movimentação | Dois lançamentos em contas distintas, um de entrada e outro de saída, com o mesmo valor e moeda. |
| Soma por movimentação | Zero. Um estorno e sua transferência original são conferidos separadamente. |
| Saldo por conta | O saldo consultado corresponde à soma de entradas menos saídas confirmadas até o mesmo horário. Inclua a funding account quando ela for a contrapartida. |
| Conta ou movimentação vinculada ao lançamento | O ID aponta para um registro do mesmo ambiente e o saldo respeita os limites aplicáveis. |

## Divergências no resultado da conciliação

Informe o ID da conta ou da movimentação, o horário da conferência e o que foi encontrado. Para um saldo diferente, mostre o valor esperado e o observado. Para um lançamento ausente, mostre a quantidade esperada e a encontrada. A conciliação preserva os dados conferidos. Se o caso admitir correção por [estorno](../movimentacoes/estorno.md), ela é executada pela operação de estorno.

Após um restore, informe quais contas e contrapartidas foram verificadas. Para cada pedido em conferência, indique quais registros ajudam a determinar se ele foi confirmado. A [liberação de operações](validar-recuperacao.md) usa esse resultado.

## 3. Exemplo

A e B começam com saldo zero. O operador credita R&#36; 100,00 em A e Ana transfere R&#36; 25,00 para B. Ao conferir o histórico após as duas confirmações, devem constar duas movimentações e quatro lançamentos. A fica com R&#36; 75,00, B com R&#36; 25,00 e a funding account com saldo de −R&#36; 100,00. Os lançamentos de cada movimentação somam zero.

Se faltar a saída da funding account, a conferência indica o ID do crédito de teste, dois lançamentos esperados e um encontrado.
