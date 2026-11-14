---
title: Consultar comprovante de movimentação
---

# Consultar comprovante de movimentação

## 1. Breadcrumb

Ledger > Consultas > **Comprovante**

## 2. Cabeçalho

**Título**\
Comprovante de movimentação

**Descrição**\
Identificador e instante de confirmação

## 3. Componentes

- Tipo de movimentação, valor em BRL e instante de confirmação.
- Conta própria relacionada à consulta e sentido do lançamento.
- ID da transferência original, quando o comprovante for de estorno.
- Acesso pelo extrato da conta ou pela confirmação da operação.

## 4. Regras

### 4.1 Identificar a conta consultada

- A consulta deve indicar a conta comum cuja participação será exibida. A pessoa deve ser titular atual dessa conta, e a conta deve participar de uma movimentação confirmada no mesmo ambiente.
- O comprovante fica indisponível se a conta for de outro titular, não existir ou não tiver participado da movimentação. Use o mesmo resultado quando o ID da movimentação não existir ou o pedido tiver sido rejeitado.
- Quando a pessoa for titular das duas contas, deve poder consultar a saída pela origem e a entrada pelo destino. As duas visões devem apresentar o mesmo identificador, valor, moeda e instante de confirmação.

### 4.2 Apresentar os dados da movimentação

O comprovante apresento ID da movimentação, tipo, ID da conta consultada, sentido do lançamento, valor em BRL e instante de confirmação. O valor aparece como número positivo. O campo **Sentido** indica entrada ou saída.

| Movimento | Conta consultada | Informação adicional disponível |
| --- | --- | --- |
| Transferência | Origem | O titular pode ver o identificador do destino se tiver informado esse identificador na solicitação original ou se também for titular do destino. |
| Transferência | Destino | O identificador da origem só aparece se a pessoa também for titular da origem. |
| Crédito de teste | Conta que recebeu o valor | Exibe **Crédito de teste** e omite o ID da funding account. |
| Estorno | Conta comum que recebeu ou devolveu o valor | O comprovante apresenta o ID da transferência original e o efeito do estorno na conta consultada. |

Nome, titular, saldo e extrato da contraparte ficam fora do comprovante comum. O motivo do estorno e o identificador do operador ficam na auditoria. O comprovante de estorno não apresenta identificador da contraparte.

### 4.3 Consultar novamente

- A consulta deve verificar a titularidade atual. Alteração de saldo e novas movimentações preservam os dados da confirmação original.
- Um estorno deve ter comprovante próprio. A transferência original permanece consultável com o mesmo identificador e os dados originais.
- Após uma [restauração](../operacao/validar-recuperacao.md), o comprovante só fica disponível quando a confirmação, os lançamentos e a titularidade atual tiverem sido verificados.

## 5. Resultados

| Condição | Resultado |
| --- | --- |
| Ana envia R&#36; 25,00 da conta A para a conta B de Bruno | Ana consulta a saída e vê o ID de B que informou. Bruno consulta a entrada na conta B. Como ele é titular apenas de B, o ID de A fica oculto. Os dois comprovantes mostram o mesmo ID da movimentação. |
| Pessoa sem conta participante conhece o ID da movimentação | Resultado de indisponibilidade, sem dados da movimentação. |
| Ana consulta novamente após outro movimento | Valor, ID e data da transferência original permanecem iguais. |
| Transferência é estornada | Comprovantes do original e da compensação permanecem consultáveis com IDs de movimentação distintos. |

## 6. Dicionário de dados

| Informação | Tipo de dado | Observação |
| --- | --- | --- |
| ID da movimentação | ID | Estável após confirmação. |
| Conta consultada | Identificador | Conta própria participante. |
| Sentido | Entrada ou saída | Depende da conta consultada. |
| Valor e moeda | Valor monetário | Valor confirmado em BRL. |
| Instante de confirmação | Data e hora | Mesmo instante do histórico. |
| Conta de destino ou origem | Identificador | Condicional à participação e à titularidade, conforme a tabela de apresentação. |
| ID da transferência original | ID | Disponível em comprovante de estorno. |
