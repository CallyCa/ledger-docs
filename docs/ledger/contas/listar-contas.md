---
title: Listar contas próprias
---

# Listar contas próprias

## 1. Breadcrumb

Ledger > Contas > **Minhas contas**

## 2. Cabeçalho

**Título**\
Minhas contas

## 3. Componentes

- Lista de contas comuns disponíveis ao titular.
- Nome, identificador e moeda em cada item.
- Ação para visualizar a conta.
- Ação **Cadastrar conta**.
- Indicação de carregamento, lista vazia, indisponibilidade e continuação.

## 4. Regras

- A listagem deve apresentar apenas as contas comuns da pessoa identificada no ambiente atual. Funding account, conta de outro titular e conta antiga sem titular devem ficar fora da lista.
- Cada item deve apresentar nome, identificador e moeda. Contas com o mesmo nome devem permanecer distinguíveis pelo identificador. A seleção deve abrir a [visualização](visualizar-conta.md) da conta correspondente. Ao [abrir a conta pela lista](visualizar-conta.md#41-abrir-a-conta), o Ledger deve verificar novamente se ela pertence à pessoa.
- A lista deve apresentar os cadastros mais recentes primeiro. Instantes iguais devem ter desempate pelo identificador. A quantidade padrão deve ser 20 itens, com faixa de 1 a 100 quando informada. O cursor vale para o mesmo usuário e identifica a última conta apresentada. Quando a lista não muda entre consultas, cada conta aparece uma única vez. Se a resposta indicar que a página é a última, a opção de continuar fica indisponível.
- Lista vazia deve indicar que a pessoa ainda não tem contas disponíveis e oferecer a ação de cadastro. Falha de consulta deve apresentar indisponibilidade. Se Bruno entrar depois de Ana no mesmo navegador, **Minhas contas** passa a mostrar apenas as contas de Bruno.
- Uma nova consulta após cadastro confirmado deve incluir a conta criada. Se um cadastro ocorrer entre páginas, o novo item poderá ser encontrado ao reiniciar a consulta a partir do início.

## 5. Resultados

| Condição | Resultado |
| --- | --- |
| Ana tem duas contas de mesmo nome e Bruno tem uma conta | Ana vê dois itens com IDs distintos e pode abrir cada conta própria. |
| Ana ainda não tem contas | Lista vazia com ação para cadastrar. |
| Consulta falha com contas existentes | Indicação de indisponibilidade. |
| Bruno usa o cursor que a API devolveu a Ana | O cursor é rejeitado na sessão de Bruno. |

## 6. Dicionário de dados

| Informação | Tipo de dado | Observação |
| --- | --- | --- |
| Nome | Texto | Pode se repetir entre contas. |
| ID da conta | ID | Distingue contas de mesmo nome. |
| Moeda | Moeda | BRL. |
| Cursor | Cursor de paginação | Válido para o mesmo usuário e consulta. |
