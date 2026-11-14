---
title: Estornar transferência
---

# Estornar transferência

## 1. Breadcrumb

Ledger > Movimentações > **Estorno**

## 2. Cabeçalho

**Título**\
Estorno de transferência

**Disponibilidade**\
Evolução posterior à transferência, ao extrato e à autorização. Ação restrita a operador com permissão de estorno.

## 3. Componentes

- Identificador da transferência original.
- Valor original e indicação de elegibilidade.
- Campo **Motivo**.
- Ação de confirmar estorno.
- Resultado com identificador da compensação e referência à transferência original.

## 4. Regras

### 4.1 Selecionar a transferência e informar motivo

- Operador com permissão específica deve informar a transferência e um motivo de 1 a 250 caracteres após remoção dos espaços das extremidades. O Ledger deve registrar autoria e justificativa.
- A ação deve estar disponível apenas para transferência confirmada no mesmo ambiente e ainda elegível. Crédito de teste, estorno e transferência indisponível ao operador devem ser rejeitados.
- Para estornar, a pessoa precisa da permissão de estorno no ambiente. Se Ana enviou a transferência e tem acesso à conta de origem, ela ainda precisa dessa permissão. A ação permite debitar o valor da compensação e mantém o saldo do destinatário visível apenas ao titular.

### 4.2 Confirmar o estorno

- O estorno deve ser integral. Ele deve debitar o destino original e creditar a origem original pelo valor original. O saldo resultante de ambas as contas deve ser válido.
- Uma transferência pode ter somente um estorno confirmado. A compensação deve manter o vínculo com a transferência original. O original deve permanecer disponível com seus lançamentos intactos. O extrato das duas contas deve apresentar o lançamento compensatório com referência à transferência original. A [conciliação](../operacao/conciliar.md) deve verificar a soma zero do original e do estorno separadamente.
- Saldo insuficiente no destino original deve impedir o estorno sem alterar o histórico. Nova tentativa pode ser aceita se o saldo voltar a ser suficiente e a transferência continuar elegível. Se um débito comum e um estorno disputarem o mesmo saldo no destino original, deve confirmar apenas o que encontrar saldo suficiente. Quando o saldo cobrir apenas um, a outra operação deve ser rejeitada sem efeito financeiro.
- Se o crédito de retorno ultrapassar o limite da origem original, o estorno inteiro deve ser rejeitado.

### 4.3 Reenviar o estorno

- Reenviar a mesma transferência e o mesmo motivo normalizado com a mesma idempotency key recupera a confirmação. Outro pedido para uma transferência já estornada recebe conflito. Se dois pedidos concorrerem pela mesma transferência, no máximo um estorno confirma.
- Reenviar a idempotency key de um estorno confirmado com outro motivo gera conflito e preserva o estorno anterior.

### 4.4 Consultar o pedido após restore

Se a resposta do estorno se perder e o pedido entrar em conferência após [restore](../operacao/validar-recuperacao.md), o operador pode consultar a situação com o ID da transferência original, o motivo do pedido e o mesmo valor de `Idempotency-Key`. A consulta usa a permissão atual de estorno. Se a confirmação tiver sido recuperada, a tela mostra o mesmo ID do estorno, mesmo com as contas ainda suspensas. Enquanto o pedido estiver em conferência, o operador pode consultar a situação novamente. A opção **Repetir** só fica disponível quando houver prova de que o estorno anterior não confirmou e as duas contas estiverem liberadas.

## 5. Resultados

| Condição | Resultado | Efeito |
| --- | --- | --- |
| A enviou R&#36; 25,00 a B e B mantém saldo suficiente | Estorno confirmado | B perde R&#36; 25,00, A recebe R&#36; 25,00. Original preservado. |
| B gastou parte do valor e não tem saldo para devolver | Saldo insuficiente | Transferência original permanece válida. |
| Motivo ausente ou acima do limite | Solicitação inválida | Nenhum registro financeiro criado. |
| Operador sem permissão | Ação indisponível | Nenhum efeito ou dado protegido apresentado. |
| Nova idempotency key para uma transferência já estornada | Estorno já realizado | Compensação existente preservada. |

## 6. Dicionário de dados

| Campo | Obrigatório | Tipo de dado | Observação |
| --- | --- | --- | --- |
| Transferência original | Sim | Identificador | Deve ser transferência confirmada e elegível. |
| Motivo | Sim | Texto de 1 a 250 caracteres | Exemplo: correção de destino informado. |
| `Idempotency-Key` | Sim | Identificador do pedido | Repetir o pedido mantém o valor do cabeçalho, a transferência e o motivo normalizado. |
| Valor | Determinado pelo original | Valor em BRL | Compensação integral. |
| Identificador do estorno | Gerado | Identificador | Vinculado à transferência original. |
