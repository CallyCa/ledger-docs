---
title: Glossário
---

# Glossário

## 1. Termos do Ledger

| Termo | Significado no Ledger |
| --- | --- |
| ID do usuário | Identifica quem fez login. No cadastro, o Ledger vincula esse ID à conta para saber quem é o titular. |
| ID da conta | Identifica uma conta específica. Ana pode ter várias contas, cada uma com um ID diferente e todas vinculadas ao mesmo ID de usuário. |
| Conta comum | Conta do titular para receber, transferir e consultar saldo simulado. Começa com saldo zero e não admite saldo negativo. |
| Funding account | Conta interna do ambiente usada como origem dos créditos de teste. Recebe o lançamento de saída que faz contrapartida à entrada na conta do titular. Pode ficar negativa dentro do limite de saldo do Ledger. |
| Movimentação (*ledger transaction*) | Registro financeiro único que agrupa os lançamentos de um crédito de teste, transferência ou estorno. |
| Lançamento (*posting*, *ledger entry*) | Efeito confirmado sobre uma conta. Uma saída reduz o saldo e uma entrada o aumenta. |
| Dupla entrada (*double-entry*) | Toda movimentação gera dois lançamentos de igual valor e efeitos opostos. A soma algébrica dos dois é zero. |
| Saldo confirmado (*posted balance*) | Soma das entradas menos as saídas confirmadas de uma conta. |
| Extrato da conta (*account statement*) | Histórico ordenado dos lançamentos da conta consultada. |
| Idempotency key | Valor enviado em `Idempotency-Key` para reconhecer o mesmo pedido de transferência ou estorno. |
| ID do pedido | Identifica um crédito de teste no ambiente e no cenário em que o operador solicitou o crédito. |
| ID da movimentação | Identifica o crédito de teste, a transferência ou o estorno após confirmar. É o mesmo no extrato, no comprovante e na auditoria. |
| Estorno (*reversal*) | Nova movimentação que inverte integralmente os efeitos de uma transferência existente. |
| Cursor do extrato | Valor devolvido pela API para consultar a página seguinte. Usa a conta, o período e a posição do último lançamento da página. |

## 2. Expressões usadas em referências sobre ledgers

| Termo | Uso neste produto |
| --- | --- |
| *Ledger account* | Conta em que o Ledger registra entradas ou saídas. Uma conta comum e a funding account são exemplos. |
| *Inflow / outflow* | Entrada ou saída de valor na perspectiva da conta consultada. |
| *Posted / confirmed* | Movimentação confirmada e disponível no histórico. |
| *Pending transaction* | Movimentação pendente em sistemas que separam o pedido da confirmação. |
| *Available balance* | Valor disponível para movimentar. Em sistemas com reservas, esse valor pode considerar movimentações pendentes. O Ledger apresenta o saldo confirmado. |
| *Ledger reconciliation* | Conferência do histórico e dos saldos. Conciliação com fonte externa exige registros independentes e regras de correspondência. |
| *Chart of accounts* | Plano de contas contábil. É uma classificação para escrituração e relatórios contábeis. |
