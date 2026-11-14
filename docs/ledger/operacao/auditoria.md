---
title: Consultar auditoria
---

# Consultar auditoria

## Eventos e campos da auditoria

| Evento | Campos da auditoria |
| --- | --- |
| Cadastro de conta | ID do usuário, ambiente, horário, resultado e ID da conta criada. |
| Atribuição de titular | ID do operador, ambiente, horário, resultado, ID da conta, ID do usuário escolhido, motivo e evidência usada para a atribuição. |
| Crédito de teste ou transferência confirmada | Usuário que executou a ação, ambiente, horário, contas afetadas e ID da movimentação. |
| Estorno confirmado | Operador, motivo, ambiente, horário e IDs da transferência original e do estorno. |
| Rejeição de acesso ou falha antes do commit | Ação, resultado e ID da requisição quando a chamada vier pela API. A tentativa não gera lançamento. |
| Reenvio de pedido já confirmado | Quando a tentativa é registrada, ela aponta para a mesma movimentação. |
| Suspensão ou liberação após restore | Responsável, ambiente, horário, alcance e evidência da decisão. |

Nas chamadas pela API, o ID da requisição permite localizar o evento. O ID da movimentação, quando houver, permite localizar os lançamentos no extrato.

## Permissão para consultar a auditoria

A consulta exige permissão de auditoria no ambiente. Secrets, tokens, valores de `Idempotency-Key` e o corpo completo da requisição ficam fora dos registros. Se a titularidade mudar, a auditoria preserva o usuário que executou cada ação.

Se Ana perder a resposta depois de confirmar a transferência, a auditoria ainda mostra a confirmação. Por exemplo, o evento da requisição `req-0082` aponta para a movimentação `tx-001`. Se Bruno assumir a titularidade de uma conta após uma atribuição, os eventos anteriores continuam associados a quem os executou. Se a equipe ainda não consegue determinar o resultado após um restore, a tentativa permanece em conferência conforme as [regras de recuperação](validar-recuperacao.md).
