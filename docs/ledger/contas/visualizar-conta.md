---
title: Visualizar conta
---

# Visualizar conta

## 1. Breadcrumb

Ledger > Contas > **Visualização**

## 2. Cabeçalho

**Título**\
Nome da conta

**Descrição**\
Identificador e moeda da conta

## 3. Componentes

- Nome e ID da conta.
- Moeda e saldo confirmado.
- Acesso ao [extrato por período](../consultas/extrato.md).
- Acesso à [transferência](../movimentacoes/transferencia.md) a partir da conta, quando a pessoa tiver permissão e a transferência estiver disponível.

## 4. Regras

### 4.1 Abrir a conta

- O identificador deve recuperar a mesma conta depois de reiniciar a aplicação. A consulta deve apresentar nome, moeda e saldo confirmado somente quando a política de titularidade permitir.
- Para uma conta inexistente, uma funding account, uma conta sem titular ou uma conta de outra pessoa, a consulta comum deve apresentar a mesma indisponibilidade. Dados da conta e ações sobre ela não devem ficar disponíveis.
- Conta sem histórico deve apresentar saldo zero. Falha ao obter o saldo deve indicar indisponibilidade de consulta. Um valor anterior eventualmente exibido precisa estar identificado como desatualizado.
- As ações de consulta e transferência devem preservar o ID da conta visualizada. A disponibilidade da ação de transferir não garante que o saldo será suficiente no momento da confirmação.

## 5. Dicionário de dados

| Campo | Origem | Observação |
| --- | --- | --- |
| Nome | Cadastro | Nomes iguais não identificam uma conta. |
| Identificador | Cadastro | Permanece estável após reinício. |
| Moeda | Conta | BRL. |
| Saldo | Movimentações confirmadas | Deve refletir o estado da consulta. |
