---
title: Transferir entre contas
---

# Transferir entre contas

## 1. Breadcrumb

Ledger > Movimentações > **Transferência**

## 2. Cabeçalho

**Título**\
Transferência entre contas

**Ação**\
Confirmar transferência

## 3. Componentes

| Componente | Disponibilidade e conteúdo |
| --- | --- |
| Conta de origem | Conta comum do titular. Quando a ação começa na visualização de uma conta, deve carregar o identificador dessa conta. |
| Conta de destino | Identificador informado pela pessoa. Pode ser de outra conta própria ou de outra pessoa. |
| Valor | Campo monetário em BRL. A entrada representa um valor exato em centavos. |
| Confirmar transferência | Envia as contas e o valor informados. Durante o envio, a mesma ação deve ficar indisponível para novo acionamento. |
| Resultado | Indica confirmação, rejeição ou resultado desconhecido. Uma confirmação informa o ID da movimentação. |

## 4. Regras

### 4.1 Validar origem e destino

- As contas devem ser comuns, distintas, aptas a movimentar e pertencer ao mesmo ambiente. A origem deve pertencer à pessoa que solicita. A funding account e contas antigas sem titular definido ficam fora da operação.
- A pessoa pode informar uma conta de destino pertencente a outro titular. O resultado pode apresentar o identificador já informado. Nome, titularidade, saldo e extrato do destinatário devem permanecer restritos.
- Origem ausente, origem sem acesso e destino indisponível devem produzir resultado de indisponibilidade sem revelar dados de terceiros. Se origem e destino forem iguais, o resultado deve indicar que são necessárias contas distintas.

### 4.2 Validar valor e saldo

- A confirmação deve respeitar os limites de [valor e saldo](valores-e-integridade.md). O saldo da origem deve ser suficiente no momento da confirmação. O saldo do destino após o crédito deve permanecer dentro do limite.
- Uma transferência com valor igual ao saldo disponível deve ser aceita quando as demais condições forem atendidas. O saldo da origem deve terminar em zero.
- Dois pedidos com valores diferentes de `Idempotency-Key` são tratados separadamente. Se a origem tiver saldo para um único pedido, um confirma e o outro é rejeitado por saldo insuficiente. O Ledger não garante qual pedido confirma primeiro.

### 4.3 Confirmar transferência

- O resultado confirmado deve apresentar ID da movimentação, IDs das contas de origem e destino, valor, moeda, tipo e instante de confirmação.
- A transferência deve registrar uma saída na origem e uma entrada no destino. Os dois lançamentos e a confirmação devem ficar disponíveis juntos. O extrato da origem deve apresentar a saída e o do destino, a entrada. A confirmação deve vincular o ID da movimentação ao solicitante na [auditoria](../operacao/auditoria.md).
- Conta, valor, saldo ou autorização inválidos devem preservar saldos, quantidade de movimentações e quantidade de lançamentos. Falha de comunicação deve seguir a [reenvio de movimentação](repeticao.md).
- Se houver falha antes do commit, a transferência e seus lançamentos não entram no histórico. Isso vale mesmo se o banco já tiver começado a inserir o primeiro lançamento. A pessoa pode reenviar o mesmo pedido com o mesmo valor de `Idempotency-Key`.
- Após confirmação, a interface deve atualizar saldo e extrato. Se a consulta ficar indisponível, a confirmação continua válida e a consulta pode ser repetida separadamente.

### 4.4 Repetir ou alterar o pedido

- Se a resposta se perder, a interface mantém as contas, o valor e o valor de `Idempotency-Key` para [reenviar o mesmo pedido](repeticao.md). Alterar a conta ou o valor cria outro pedido. Antes de enviá-lo, a interface avisa que o resultado do anterior ainda é desconhecido.
- Se um pedido ficar em conferência após [restore](../operacao/validar-recuperacao.md), a interface permite consultar a situação com os dados originais. A pessoa pode recuperar uma confirmação verificada durante a suspensão. Um reenvio que possa movimentar saldo só fica disponível após a liberação.

## 5. Resultados

| Condição | Resultado | Efeito financeiro |
| --- | --- | --- |
| A com R&#36; 100,00, B com zero, valor de R&#36; 25,00 | Transferência confirmada | A fica com R&#36; 75,00. B fica com R&#36; 25,00. Uma saída e uma entrada. |
| A com R&#36; 25,00, valor de R&#36; 25,00 | Transferência confirmada | A fica com zero. |
| A com R&#36; 25,00, valor de R&#36; 25,01 | Saldo insuficiente | Saldos e lançamentos permanecem iguais. |
| Crédito ultrapassa o limite do destino | Limite de saldo excedido | Nenhum efeito parcial na origem. |
| Origem e destino iguais, valor inválido ou cabeçalho `Idempotency-Key` ausente | Solicitação inválida | A pessoa pode corrigir os dados. |
| Acesso, origem ou destino indisponíveis | Operação indisponível | Nenhum dado adicional do recurso é apresentado. |
| A pessoa ficou sem a resposta | Resultado desconhecido | A nova tentativa usa os mesmos dados e o mesmo valor de `Idempotency-Key`. |

## 6. Dicionário de dados

| Campo | Obrigatório | Tipo de dado | Observação |
| --- | --- | --- | --- |
| Conta de origem | Sim | Identificador | Conta comum do titular. |
| Conta de destino | Sim | Identificador | Conta comum distinta da origem. |
| Valor | Sim | Valor em BRL | De R&#36; 0,01 a R&#36; 10.000.000,00. Exemplo: R&#36; 25,00. |
| `Idempotency-Key` | Sim | Identificador do pedido | O reenvio do mesmo pedido usa o mesmo valor no cabeçalho. |
| ID da movimentação | Gerado | ID | Permanece igual ao recuperar a confirmação. |
| Instante de confirmação | Gerado | Data e hora | UTC, associado à movimentação original. |
