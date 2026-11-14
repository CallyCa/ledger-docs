---
title: Atribuir titular a conta antiga
---

# Atribuir titular a conta antiga

## 1. Breadcrumb

Ledger > Acesso > **Atribuição de titular**

## 2. Cabeçalho

**Título**\
Atribuir titular a conta antiga

## 3. Componentes

- ID da conta sem titular.
- ID do usuário que será titular da conta.
- Justificativa e evidência da atribuição.
- Resultado e referência do registro de auditoria.

## 4. Regras

- A atribuição deve estar disponível somente a operador com permissão específica no ambiente. A conta deve ser comum, existir e estar sem titular. O ID informado deve corresponder a um usuário válido no ambiente em que a conta existe.
- O operador deve informar a justificativa e a evidência que sustentam o vínculo. A confirmação deve associar a titularidade e registrar autoria, data e justificativa. Saldos, lançamentos e autoria das movimentações anteriores devem ser preservados.
- Se duas solicitações concorrerem pela mesma conta, somente a primeira atribuição confirmada deve produzir efeito. A segunda deve informar que a conta já possui titular. A ação não pode ser usada para transferir conta entre pessoas.
- Após a confirmação, consultas e novas operações devem aplicar a titularidade atribuída. O registro de operações anteriores continua associado a quem executou cada ação.
- Se os dados de titularidade estiverem em conferência após [restauração](../operacao/validar-recuperacao.md), a atribuição permanece suspensa até a liberação autorizada.

## 5. Resultados

| Condição | Resultado | Efeito |
| --- | --- | --- |
| Conta comum sem titular, ID de usuário válido e evidência registrada | Titularidade atribuída | Conta torna-se acessível ao titular, com o mesmo histórico. |
| Conta já atribuída, inclusive por operação concorrente | Atribuição indisponível | Vínculo existente preservado. |
| Funding account, ID de usuário inválido ou falta de evidência | Solicitação rejeitada | Conta e histórico preservados. |
| Pessoa sem permissão para atribuir titular | Acesso indisponível | A ação não produz alterações. |
