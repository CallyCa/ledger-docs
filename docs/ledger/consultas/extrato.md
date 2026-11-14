---
title: Consultar extrato por período
---

# Consultar extrato por período

## 1. Breadcrumb

Ledger > Consultas > **Extrato**

## 2. Cabeçalho

**Título**\
Extrato da conta

**Descrição**\
Nome, identificador e moeda da conta consultada

## 3. Componentes

- Filtros **Início do período** e **Fim do período**.
- Ação **Consultar extrato**.
- Lista de lançamentos confirmados.
- Indicação de carregamento, período vazio, erro e fim dos resultados.
- Ação para obter a próxima página, quando houver continuação.

Cada lançamento apresenta instante de confirmação, tipo de movimento, sentido, valor, moeda e ID da movimentação. No estorno, o lançamento também mostra o ID da transferência original. Dados pessoais e saldo da contraparte não fazem parte da lista.

## 4. Regras

### 4.1 Consultar período

- A conta deve estar disponível ao titular. O período deve ter início anterior ao fim. O instante inicial deve ser incluído. O instante final deve ser excluído. A comparação usa UTC.
- A conta autorizada sem lançamentos no período deve apresentar extrato vazio. Uma conta fora do escopo da pessoa deve seguir a mesma indisponibilidade de uma conta ausente.
- Datas ausentes, inválidas ou com início igual ou posterior ao fim devem impedir a consulta e indicar o filtro que precisa de correção. Para um dia local, os limites devem representar o início daquele dia e o início do dia seguinte convertidos para UTC.
- Ao alterar conta ou período, os lançamentos apresentados devem corresponder à nova consulta. Uma resposta anterior não deve substituir resultados de filtros mais recentes.

### 4.2 Ordenar e continuar

- Os lançamentos devem ser apresentados do mais antigo ao mais recente. Quando os instantes coincidirem, o identificador do lançamento deve fornecer desempate estável.
- A quantidade padrão é 20 lançamentos por página. Quando informada, deve ficar entre 1 e 100. O cursor identifica a conta, o período e a posição do último lançamento da página. A próxima página começa depois dessa posição. A resposta informa se há outra página. Para um período sem lançamentos ou depois da última página, a opção de continuar fica indisponível.
- Uma continuação inválida ou de outra conta ou período deve exigir nova consulta. A autorização deve ser verificada em todas as páginas.
- Um lançamento confirmado entre duas consultas de página pode aparecer na continuação se sua posição vier depois do cursor. Para consultar o período desde o começo, reinicie a consulta.
- Se a próxima página falhar, o extrato continua mostrando os lançamentos já carregados para o mesmo período. A opção de tentar de novo usa o mesmo cursor.

### 4.3 Interpretar o resultado

- A soma do período deve representar a variação no intervalo. O saldo atual pode incluir movimentos anteriores ou posteriores ao período. A conferência do saldo usa o histórico completo até o instante considerado. A [conciliação](../operacao/conciliar.md) deve comparar saldo e extrato sobre o mesmo conjunto de movimentações confirmadas.
- Entrada e saída devem ser distinguíveis pela indicação de sentido e pelo valor. Estorno deve aparecer como movimento separado. O lançamento original deve continuar disponível.
- Depois de um [restore](../operacao/validar-recuperacao.md), o extrato só exibe lançamentos do período já conferido. Por exemplo, se a equipe conferiu a conta de Ana até 10:00 UTC, uma consulta de 09:00 a 11:00 mostra os lançamentos conferidos até 10:00 e avisa que o restante está em análise. Se Ana pedir apenas 10:30 a 11:00, o extrato informa indisponibilidade.

## 5. Resultados

| Condição | Resultado |
| --- | --- |
| Período das 09:00 às 10:00 UTC | Movimento às 09:00 entra. Movimento às 10:00 fica fora. |
| Dois movimentos às 09:15 | A ordem entre eles é estável nas páginas. |
| Período válido e sem registros | Lista vazia, com o período consultado identificado. |
| Filtro inválido | Indicação de erro junto ao filtro. Nenhum resultado é apresentado como se fosse da consulta inválida. |
| Continuação de outra conta | Continuação inválida ou recurso indisponível, conforme autorização. |
| Falha na próxima página | Lista já obtida preservada e nova tentativa disponível. |

## 6. Dicionário de dados

| Campo | Obrigatório | Tipo de dado | Observação |
| --- | --- | --- | --- |
| Conta | Sim | Identificador | Conta comum disponível ao titular. |
| Início | Sim | Data e hora | Inclusivo, comparado em UTC. |
| Fim | Sim | Data e hora | Exclusivo e posterior ao início. |
| Quantidade | Opcional | Inteiro de 1 a 100 | Padrão 20. |
| Cursor | Na próxima página | Cursor de paginação | Vinculado à conta e ao período. |
| Sentido | Apresentado | Entrada ou saída | Refere-se à conta consultada. |
| Tipo | Apresentado | Crédito de teste, transferência ou estorno | Estorno entra após a evolução. |
