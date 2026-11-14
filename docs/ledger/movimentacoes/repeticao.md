---
title: Reenviar uma movimentação
---

# Reenviar uma movimentação

## Reenvio após perda de resposta

Uma transferência ou um estorno pode confirmar mesmo quando a resposta se perde. Reenviar os mesmos dados com a mesma *idempotency key* permite recuperar o resultado sem movimentar o valor de novo.

## Dados usados para reconhecer o pedido

- Transferência e estorno usam o cabeçalho `Idempotency-Key`. Seu valor tem de 1 a 128 caracteres ASCII visíveis, sem espaços, e diferencia maiúsculas de minúsculas.
- O Ledger procura a confirmação pela combinação de usuário, tipo de operação e valor do cabeçalho. O [crédito de teste](credito-de-teste.md) usa o ID do pedido no escopo do ambiente e do cenário.

## Confirmação anterior, conflito e indisponibilidade

- A aplicação valida usuário, formato e acesso. Se já houver uma confirmação, verifica se o usuário ainda pode consultá-la antes de devolver a confirmação ou informar conflito.
- Mesma *idempotency key* e mesmos dados recuperam o ID, valor e horário originais. A resposta mantém os dados da confirmação, mesmo se o saldo atual tiver mudado ou o estorno já tiver sido concluído.
- Mesma *idempotency key* com dados diferentes gera conflito após a confirmação. Se duas chamadas do mesmo usuário usarem o mesmo valor de `Idempotency-Key` para o mesmo tipo de operação, apenas uma movimentação pode ser confirmada. Com os mesmos dados, a segunda chamada pode recuperar essa confirmação. Com dados diferentes, recebe conflito.
- A API só verifica saldo e elegibilidade para um pedido que possa gerar novo efeito. Uma rejeição ou falha antes do commit permite repetir o mesmo pedido.
- O registro de idempotência permanece associado à confirmação. Se o usuário perder acesso, a API informa indisponibilidade sem revelar a confirmação ou o conflito.

## Retomar um pedido depois de recarregar a página

- Se Ana ficar sem resposta ao transferir, a página guarda os IDs das contas, o valor e o valor de `Idempotency-Key`. Ao recarregar em homologação, Ana volta a ver o pedido que fez em homologação. Se Bruno fizer login no mesmo navegador, o pedido de Ana fica oculto. Recarregar só recupera os dados na tela. Ana escolhe quando clicar em **Repetir**.
- Se Ana alterar o destino ou o valor, a página prepara outro pedido com outro valor de `Idempotency-Key`. Enquanto o resultado do pedido anterior for desconhecido, a página continua mostrando esse aviso.
- Se o pedido estiver em conferência após um [restore](../operacao/validar-recuperacao.md), Ana pode usar **Consultar situação**. Se a equipe recuperar a confirmação, a página mostra o ID original. Se a conferência provar que o pedido terminou sem efeito e o responsável liberar as contas, a página volta a oferecer **Repetir**.

## Exemplos de reenvio

| Situação | Novo pedido | Resultado |
| --- | --- | --- |
| A transferência confirmou, mas a pessoa ficou sem resposta. | Mesmo valor de `Idempotency-Key` e mesmos dados | Recupera a confirmação original com o mesmo ID, valor e horário. |
| A transferência de R&#36; 25,00 foi confirmada. | Mesmo valor de `Idempotency-Key` e transferência de R&#36; 26,00 | Conflito. O histórico preserva a transferência de R&#36; 25,00. |
| A falha aconteceu antes do commit. | Mesmo valor de `Idempotency-Key` e dados válidos | A nova tentativa pode confirmar a operação uma vez. |
| A pessoa perdeu acesso à conta. | Mesmo valor de `Idempotency-Key` e mesmos dados | Indisponibilidade. Saldos e lançamentos permanecem iguais. |
