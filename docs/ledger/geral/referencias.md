---
title: Referências
---

# Referências

## Movimentações e saldo

| Referência | Conceito | Aplicação no Ledger |
| --- | --- | --- |
| [Square Books](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/) | Registro imutável de dupla entrada e cálculo de saldo com base nos lançamentos. | Uma movimentação confirmada entre duas contas produz uma saída e uma entrada de mesmo valor. Veja [Valores e integridade](../movimentacoes/valores-e-integridade.md). |
| [Formance, Quick Start](https://docs.formance.com/v3.2/modules/ledger/quick-start) | Exemplo de crédito em conta de usuário a partir de `@world`, a origem dos fundos no exemplo da Formance. | No Ledger, a funding account fornece a contrapartida dos créditos de teste e tem limite de saldo. Veja [Creditar saldo de teste](../movimentacoes/credito-de-teste.md). |
| [Blnk](https://docs.blnkfinance.com/transactions/refunds) | Estorno como nova transação que inverte origem e destino e preserva a transação original. | O estorno integral gera seu próprio par de lançamentos e mantém o vínculo com a transferência. Veja [Estornar transferência](../movimentacoes/estorno.md). |
| [Formance Ledger](https://docs.formance.com/v3.2/modules/ledger/working-with/reverting-transactions) | Compensação com lançamentos opostos aos da transação original. | A conciliação pode conferir separadamente os lançamentos da transferência e os do estorno. Veja [Conciliar histórico e saldo](../operacao/conciliar.md). |
| [Modern Treasury](https://docs.moderntreasury.com/ledgers/docs/transaction-status-and-balances) | Relação entre transações pendentes e confirmadas e os saldos calculados a partir delas. | O Ledger confirma movimentações internas de imediato e calcula o saldo pelos lançamentos confirmados. Veja [Consultar saldo](../consultas/saldo.md). |
| [TigerBeetle, Financial Accounting](https://docs.tigerbeetle.com/coding/financial-accounting/) | *Debit*, *credit* e saldo normal em sistemas contábeis. | Para acompanhar o efeito no saldo deste Ledger, veja as [entradas e saídas](../movimentacoes/valores-e-integridade.md#entradas-e-saídas). |
| [hledger](https://hledger.org/checking-for-errors.html#balance-assertions) | *Balance assertions* para conferir o saldo esperado em um ponto do histórico. | A conciliação confronta o saldo esperado com o apurado pelos lançamentos até o mesmo horário. Veja [Conciliar histórico e saldo](../operacao/conciliar.md). |

## Repetição, acesso e recuperação

| Referência | Conceito | Aplicação no Ledger |
| --- | --- | --- |
| [TigerBeetle](https://docs.tigerbeetle.com/coding/reliable-transaction-submission/) | Reenvio da mesma transferência com o ID original após perda da resposta. | O cliente guarda os dados do pedido e o valor de `Idempotency-Key`. Uma repetição autorizada recupera a confirmação original. Veja [Repetir movimentação](../movimentacoes/repeticao.md). |
| [Stripe](https://docs.stripe.com/api/idempotent_requests) | Uso de `Idempotency-Key` para identificar o pedido e verificar se os parâmetros foram alterados. | O Ledger reconhece o pedido pelo usuário, tipo de operação e valor de `Idempotency-Key`. Alterar os dados de um pedido já confirmado gera conflito. Veja [Repetir movimentação](../movimentacoes/repeticao.md). |
| [OWASP API Security, API3:2023](https://api-security.owasp.org/editions/2023/en/0xa3-broken-object-property-level-authorization/) | Autorização dos campos que uma API devolve, além da autorização para acessar o recurso. | O comprovante exibe os campos permitidos para a conta consultada e para a relação do titular com a outra conta. Veja [Consultar comprovante](../consultas/comprovante.md). |
| [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html) | RPO para o intervalo de perda admissível e RTO para o tempo de recuperação. | O responsável confere os dados restaurados e registra a evidência que permite liberar as contas. Veja [Validar recuperação do ambiente](../operacao/validar-recuperacao.md). |
