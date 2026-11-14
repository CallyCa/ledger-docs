---
title: Validar recuperação do ambiente
---

# Validar recuperação do ambiente

## 1. Conferir os dados restaurados

O responsável registra o ambiente, o ID e o horário de criação do backup. Depois do restore, registra até que horário conseguiu conferir os dados recuperados e em qual intervalo pode haver confirmações ausentes. O horário de criação do backup pode ser diferente do último horário verificado. A conferência usa registros anteriores à falha que continuem acessíveis após o restore.

A [conciliação](conciliar.md) deve conferir contas, titulares, movimentações, lançamentos, registros de idempotência e auditoria recuperados. Registre quais contas e períodos foram verificados, os saldos encontrados, a perda de dados observada e o tempo de recuperação. O resultado é avaliado contra o RPO, limite de perda de dados, e o RTO, prazo para retomar o serviço, definidos para o ambiente.

## 2. Suspender operações que dependem dos dados em conferência

Até identificar todas as contas afetadas, incluindo as contrapartidas, o Ledger suspende transferências, créditos de teste e estornos no ambiente. Com o alcance comprovado, a suspensão pode se limitar às operações que envolvem as contas afetadas. Cadastro e atribuição de titular também ficam suspensos quando os registros necessários a essas ações estiverem em conferência.

A suspensão permanece após reiniciar a aplicação. Se uma solicitação anterior puder ter confirmado dentro do intervalo afetado, o Ledger mantém o pedido em conferência. O horário informado pelo cliente e a ausência do registro de idempotência na cópia são insuficientes para concluir que o pedido é novo. Um pedido comprovadamente novo sobre uma conta suspensa recebe indisponibilidade temporária, mesmo com outro valor de `Idempotency-Key`.

## 3. Consultar dados e pedidos durante o restore

Saldo, extrato e comprovante só ficam disponíveis quando a equipe conferiu os dados e o Ledger pode verificar a permissão atual. Saldo e extrato mostram até que horário os dados foram conferidos. Se o período consultado incluir horários ainda em análise, o extrato exibe somente os lançamentos já conferidos e avisa que o restante está em análise. Se todo o período estiver em análise, a consulta fica indisponível.

Na interface, a pessoa pode consultar a situação da transferência ou do estorno com os mesmos dados do pedido e o mesmo valor de `Idempotency-Key`. Consultar a situação não cria lançamentos nem altera saldos.

| Resultado da conferência | Resposta ao usuário |
| --- | --- |
| A equipe conferiu a confirmação e os dois lançamentos restaurados. A pessoa tem acesso à movimentação. | O Ledger apresenta o mesmo ID e horário. A suspensão de novas operações pode continuar. |
| Há registro de que o pedido confirmou, mas ainda faltam dados da movimentação na base restaurada. | O pedido segue em conferência até recompor a confirmação, os lançamentos e o registro de idempotência e conferir os saldos. |
| A tentativa terminou sem confirmar e as operações das contas já foram liberadas. | A interface habilita **Repetir**. O reenvio usa os mesmos dados e o mesmo valor de `Idempotency-Key`. |
| A tentativa terminou sem confirmar e pelo menos uma conta ainda está suspensa. | A interface informa que o reenvio continua indisponível. |
| A evidência disponível ainda não permite saber se houve confirmação. | A interface mantém o pedido em conferência e permite atualizar a situação. |

Para crédito de teste, a conferência usa o ambiente, o cenário e o ID do pedido. A ausência do registro correspondente na cópia também exige conferência quando o pedido pode ter confirmado no intervalo afetado.

## 4. Liberar operações

Se a confirmação precisar ser recomposta, o responsável usa evidências que permitam recuperar os IDs, o horário, os lançamentos e o registro de idempotência originais. A liberação exige conciliação do conjunto recuperado. Divergências financeiras ou perda de dados acima da meta ficam registradas como recuperação não aceita para o conjunto afetado. O registro de liberação informa quem autorizou, a data, as contas ou ações liberadas, o último horário conferido, as evidências e o resultado da conciliação.

### Exemplo com backup restaurado em homologação

Depois do restore, a equipe conferiu os lançamentos da conta de Ana até 10:00 UTC. Ana enviou uma transferência às 10:05 UTC, antes da falha, e ficou sem resposta. A base restaurada ainda não informa se aquele pedido confirmou.

| Consulta ou ação de Ana | Resultado |
| --- | --- |
| Consulta o extrato de 09:00 a 11:00 | Mostra os lançamentos conferidos até 10:00 e informa que o restante do período está em análise. |
| Consulta o extrato de 10:30 a 11:00 | Informa que o extrato está indisponível para esse período. |
| Consulta a situação da transferência das 10:05 | Mostra o pedido em conferência. Se a equipe recuperar a confirmação, a consulta devolve o ID e o horário originais. |
| Tenta reenviar a transferência das 10:05 | O reenvio só fica disponível quando a equipe comprovar que o pedido terminou sem efeito e o responsável liberar as duas contas. |
