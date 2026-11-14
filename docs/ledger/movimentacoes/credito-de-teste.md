---
title: Creditar saldo de teste
slug: /ledger/movimentacoes/carga
---

# Creditar saldo de teste

## 1. Objetivo

O operador pode creditar valores simulados para testar transferências, extratos e conciliação. O crédito registra uma saída na funding account do ambiente e uma entrada na conta de destino.

## 2. Dados da operação

- Ambiente e cenário de teste.
- ID do pedido, usado para repetir a operação.
- Conta de destino, vinculada ao titular de teste.
- Valor em BRL.

## 3. Regras

### 3.1 Permissão e contas

- A operação exige permissão para conceder crédito de teste em desenvolvimento, teste descartável ou homologação. Produção recusa o pedido.
- A conta de destino deve pertencer a um titular de teste no mesmo ambiente da funding account. O saldo resultante de ambas deve ficar dentro dos limites.
- Se o cenário também preparar contas, uma nova tentativa deve reutilizar as contas do mesmo cenário e manter os titulares já vinculados.
- O ID do pedido é válido no mesmo ambiente e cenário. Um pedido de desenvolvimento fica separado do histórico de homologação.

### 3.2 Confirmação e reenvio

- Cada crédito de teste tem seu próprio ID de pedido. Repetir o mesmo pedido devolve a confirmação original. Trocar valor ou destino após a confirmação gera conflito.
- A confirmação registra quem executou a operação e os dois lançamentos. Se a primeira tentativa falhar antes da confirmação, repetir o pedido pode concluir o crédito uma única vez.
- O extrato do titular exibe a entrada como **Crédito de teste**. A [conciliação](../operacao/conciliar.md) inclui a funding account. O comprovante do titular omite o ID dessa conta.
- Se a operação falhar antes de confirmar, contas já preparadas podem continuar cadastradas com os saldos anteriores. Os lançamentos aparecem somente após a confirmação.

### 3.3 Crédito de teste após restore

Antes de confirmar um crédito de teste, o comando verifica se a conta de destino e a funding account podem movimentar saldo. Se uma delas estiver suspensa, o comando informa indisponibilidade e mantém os saldos e lançamentos. Se houver dúvida sobre a confirmação de um pedido anterior, a equipe consulta o ambiente, o cenário e o ID original antes de autorizar um reenvio. Veja [Conferir os dados restaurados](../operacao/validar-recuperacao.md).

## 4. Resultados

| Situação | Resultado | Saldos e lançamentos |
| --- | --- | --- |
| A e B têm saldo zero. O operador credita R&#36; 100,00 em A. | Crédito de teste confirmado | A fica com R&#36; 100,00, B com zero e a funding account com saldo de −R&#36; 100,00. A operação gera dois lançamentos. |
| Mesmo ambiente, cenário, ID e dados do pedido | Confirmação original | Mesmo ID da movimentação, mesmos saldos e contagens. |
| O operador reenvia um pedido confirmado de R&#36; 100,00 com o valor de R&#36; 110,00. | Conflito | O crédito original permanece. |
| Titular inválido, conta de outro ambiente ou saldo fora do limite | Crédito rejeitado | Saldos e lançamentos permanecem iguais. |
| O operador faz o pedido em produção. | Operação indisponível | Contas e saldos permanecem iguais. |

## 5. Dicionário de dados

| Campo | Obrigatório | Exemplo |
| --- | --- | --- |
| Cenário | Sim | Transferência de A para B. |
| Conta de destino | Sim | Conta A, vinculada à titular de teste. |
| Valor | Sim | R&#36; 100,00. |
| ID do pedido | Sim | Mesmo ID ao repetir a operação no mesmo ambiente e cenário. |
| Funding account | Determinada pelo ambiente | Funding account de homologação. |
