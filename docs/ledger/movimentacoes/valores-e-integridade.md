---
title: Valores e integridade financeira
---

# Valores e integridade financeira

Créditos de teste, transferências e estornos usam as mesmas regras de valor. Cada confirmação registra uma entrada e uma saída de mesmo valor.

## Valores e limites

- O Ledger usa BRL e registra valores em centavos inteiros. O valor informado para uma movimentação é positivo e fica entre R&#36; 0,01 e R&#36; 10.000.000,00, inclusive. Fração de centavo, zero, valor negativo, moeda distinta e valor acima do teto são rejeitados. A entrada nunca é arredondada para se tornar válida.
- Os saldos de contas comuns ficam entre zero e 9.007.199.254.740.991 centavos. A funding account também respeita o limite de 9.007.199.254.740.991 centavos em valor absoluto, inclusive quando o saldo for negativo. Os limites valem para o saldo resultante de cada conta. Ultrapassá-los rejeita a movimentação inteira.

## Confirmação e histórico das movimentações

- Crédito de teste, transferência e estorno confirmados têm exatamente duas contas distintas e dois lançamentos do mesmo valor em BRL. Uma saída e uma entrada produzem soma algébrica zero.
- Os dois lançamentos e o registro da movimentação se tornam disponíveis juntos. Uma rejeição ou falha anterior à confirmação conserva saldos e histórico.
- Lançamento confirmado mantém conta, valor, sentido, data e relação com a movimentação original. A correção financeira acrescenta lançamentos compensatórios. Consultas posteriores continuam mostrando o original.
- Decisões concorrentes respeitam o saldo confirmado que resulta das operações já concluídas. Quando duas saídas disputam valor suficiente para apenas uma delas, uma única movimentação é confirmada. O produto não garante qual solicitação concorrente vence.
- A data financeira é o instante de confirmação, em UTC. A pessoa não informa uma data retroativa ou futura para alterar a posição do movimento no histórico.

## Entradas e saídas

Cada lançamento (*posting* ou *ledger entry*) registra o efeito de uma movimentação em uma conta. **Entrada (*inflow*)** aumenta o saldo da conta. **Saída (*outflow*)** reduz esse saldo. Os dois lançamentos têm o mesmo ID de movimentação, usado para localizar o par no histórico e na conciliação.

| Conta | Papel na transferência de R&#36; 25,00 | Efeito no saldo |
| --- | --- | --- |
| A | Origem | Saída de R&#36; 25,00, representada por −2.500 centavos. |
| B | Destino | Entrada de R&#36; 25,00, representada por +2.500 centavos. |
| Total da movimentação | Dupla entrada | Soma zero. |
