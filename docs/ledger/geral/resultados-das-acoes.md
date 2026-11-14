---
title: Resultados das ações
---

# Resultados das ações

## 1. Objetivo

Esta página mostra o que acontece quando o Ledger confirma, rejeita ou deixa um pedido em conferência.

## 2. Regras gerais

- Em homologação e produção, o Ledger solicita login antes de apresentar dados de conta ou movimentação. Depois do login, verifica se o usuário tem acesso à conta ou a permissão exigida pela ação. Veja [Permissões por operação](../acesso/permissoes.md).
- O Ledger verifica qual usuário fez o pedido e se os campos enviados são válidos antes de processar a ação. Uma rejeição de preenchimento deve identificar o campo ou a condição a corrigir. A autorização do recurso deve ser verificada antes de apresentar dados protegidos ou motivos financeiros.
- Quando houver uma confirmação para a idempotency key, o Ledger deve verificar o acesso à movimentação original antes de informar replay ou conflito. Com acesso válido, os mesmos dados recuperam a confirmação original. Usar o mesmo valor de `Idempotency-Key` com dados diferentes resulta em conflito. O saldo atual só é avaliado se a ação puder produzir uma nova movimentação.
- Se a transferência for rejeitada por saldo insuficiente, o Ledger informa o motivo e mantém os saldos e lançamentos anteriores. Se a pessoa perder a resposta, o resultado do pedido fica desconhecido para ela. A página indica como consultar ou repetir o pedido, de acordo com a ação.
- Um resultado vazio deve indicar consulta concluída sem registros. Falha de consulta deve indicar indisponibilidade. Se algum resultado anterior for mantido, ele deve estar associado à mesma conta e identificado como desatualizado quando aplicável.

## 3. Resultados e ações disponíveis

| Resultado | Quando se aplica | Ação disponível |
| --- | --- | --- |
| Confirmação | Cadastro, crédito de teste, transferência ou estorno foi concluído. | Abrir a conta ou consultar a movimentação pelo ID retornado. |
| Autenticação necessária | A pessoa tentou acessar uma conta em homologação ou produção sem um login válido. | Fazer login e tentar de novo. |
| Recurso indisponível | A conta ou movimentação não está disponível no escopo da pessoa. | Conferir os dados já conhecidos. O resultado não informa se o recurso pertence a outra pessoa. |
| Preenchimento inválido | Campo obrigatório ausente, formato incorreto ou valor fora da faixa. | Corrigir o campo indicado antes de enviar. |
| Saldo insuficiente | A conta debitada não tem saldo para o valor informado. | Rever a operação ou aguardar que a conta possa cobrir o valor. |
| Limite de saldo excedido | O crédito levaria uma conta além da faixa permitida. | Rever valor e destino quando a ação permitir. |
| Conflito de idempotência | O mesmo valor de `Idempotency-Key` foi enviado com dados diferentes depois da confirmação. | Consultar a confirmação original ou iniciar outro pedido com uma nova idempotency key. |
| Estorno já realizado | Outro estorno para o mesmo original já foi confirmado. | Consultar a compensação quando houver permissão. |
| Resultado desconhecido | A pessoa ficou sem a resposta e ainda não sabe se o pedido foi confirmado. | Para transferência ou estorno, reenviar o mesmo pedido com a mesma idempotency key quando permitido. Para cadastro, conferir a lista antes de enviar outro pedido. |
| Pedido em conferência após restore | O Ledger restaurou um backup. O pedido pode ter confirmado depois do último horário verificado, e a equipe ainda está conferindo seu resultado. | Consultar a situação do pedido e aguardar o resultado da conferência. |
| Operação temporariamente indisponível | Um pedido novo ou um pedido anterior que comprovadamente terminou sem confirmar depende de uma conta ainda suspensa. | Aguardar a liberação da operação. |
| Consulta vazia | A conta está disponível, mas o período não contém lançamentos. | Alterar o período ou encerrar a consulta. |
| Consulta indisponível | O Ledger não conseguiu buscar os dados pedidos. | Tentar consultar novamente com a mesma conta e os mesmos filtros. |
