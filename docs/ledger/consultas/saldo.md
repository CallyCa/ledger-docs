---
title: Consultar saldo
---

# Consultar saldo

## 1. Breadcrumb

Ledger > Consultas > **Saldo**

## 2. Cabeçalho

**Título**\
Saldo da conta

**Descrição**\
Nome da conta, identificador e moeda

## 3. Componentes

- Valor do saldo confirmado.
- Indicação de carregamento ou consulta indisponível.
- Ação para consultar novamente após falha.
- Acesso ao extrato da mesma conta.

## 4. Regras

### 4.1 Obter saldo

- O saldo deve corresponder à soma das entradas confirmadas menos as saídas confirmadas. Conta sem lançamentos deve apresentar R&#36; 0,00.
- Uma consulta deve refletir um estado confirmado. Enquanto uma transferência concorre com a consulta, a resposta pode refletir o estado anterior ou posterior à confirmação. Efeito parcial não deve ser apresentado.
- Em operação normal, uma consulta posterior à confirmação deve incluir a movimentação confirmada. Outras confirmações ocorridas no intervalo também podem estar incluídas.
- A consulta deve respeitar titularidade. Conta inexistente, funding account, conta de outro titular ou conta sem titular confirmado deve apresentar indisponibilidade no fluxo comum.
- Divergência entre saldo e histórico deve ser encaminhada para [conciliação](../operacao/conciliar.md). A divergência não permite corrigir o saldo diretamente.

### 4.2 Apresentar saldo e recuperar consulta

- Valor e moeda devem ser exibidos com centavos exatos. A apresentação deve distinguir zero, carregamento, erro e valor desatualizado.
- Se a transferência confirmar e a atualização do saldo falhar, a confirmação continua válida. A pessoa pode atualizar o saldo novamente sem reenviar a transferência.
- Ao trocar de conta, o saldo anterior não deve ser apresentado como se fosse da nova conta. Se houver valor anterior para a própria conta durante falha, ele deve ser identificado como desatualizado.
- Durante a [recuperação do ambiente](../operacao/validar-recuperacao.md), o Ledger mostra até que horário o saldo foi conferido. Por exemplo, se o último saldo verificado de A for R&#36; 75,00 às 10:00 UTC, a consulta mostra o valor com o horário e avisa que ele pode estar desatualizado. Se o responsável ainda estiver conferindo o saldo ou a titularidade, a consulta fica indisponível. A [referência da API](../api/index.md#cobertura-do-saldo-e-do-extrato) define como o horário de conferência aparece no JSON.

## 5. Resultados

| Histórico da conta | Saldo ou estado |
| --- | --- |
| Cadastro sem movimentos | R&#36; 0,00. |
| Crédito de teste confirmado de R&#36; 100,00 | R&#36; 100,00. |
| Saída confirmada de R&#36; 25,00 depois do crédito de teste | R&#36; 75,00. |
| Débito acima do saldo rejeitado | R&#36; 75,00. |
| Estorno de R&#36; 25,00 confirmado | R&#36; 100,00. |
| Consulta falha após transferência confirmada | Confirmação mantida. Saldo indisponível ou identificado como desatualizado. |

## 6. Dicionário de dados

| Informação | Tipo de dado | Observação |
| --- | --- | --- |
| Conta | Identificador | Disponível ao titular. |
| Saldo confirmado | Valor monetário | Em BRL, exato em centavos. |
| Estado da consulta | Estado | Disponível, carregando, indisponível ou desatualizado. |
