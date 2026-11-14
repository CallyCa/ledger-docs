---
title: Permissões por operação
---

# Permissões por operação

## 1. Ações disponíveis

| Ação | Quem pode executar | Limite de acesso |
| --- | --- | --- |
| Cadastrar conta comum | Usuário autenticado | A conta é criada em nome de quem fez o cadastro. |
| Listar contas, consultar saldo e extrato | Titular | Somente suas contas comuns. |
| Consultar comprovante | Titular de uma conta participante | A conta selecionada determina se o comprovante mostra entrada ou saída e quais campos ficam disponíveis. |
| Transferir | Titular da origem | O destino pode ser uma conta comum de outro titular. A confirmação pode repetir o ID já informado. |
| Creditar saldo de teste | Operador com permissão de crédito de teste | Apenas nos ambientes autorizados e para contas vinculadas a titulares de teste. |
| Atribuir titular a uma conta antiga | Operador com permissão de atribuição | Somente contas antigas sem titular confirmado, com a evidência da atribuição registrada. |
| Consultar auditoria ou executar conciliação | Operador autorizado para a ação | Somente no ambiente em que recebeu a permissão correspondente. |
| Aceitar recuperação e liberar operações | Responsável com permissão de recuperação | Somente no ambiente afetado e para o conjunto conferido. |
| Estornar | Operador com permissão de estorno | Somente para uma transferência elegível. A permissão cobre a compensação e a consulta da própria operação. |

### Autenticação por ambiente

| Onde o Ledger está rodando | Como o Ledger sabe quem está usando |
| --- | --- |
| Desenvolvimento no computador da equipe | A configuração de desenvolvimento pode disponibilizar os usuários de teste Ana e Bruno, cada um com seu próprio ID de usuário. |
| Testes automatizados com aplicação e banco descartáveis | A suíte configura os IDs de Ana e Bruno no ambiente criado para aquela execução. |
| Homologação e produção | A pessoa faz login no serviço de autenticação configurado para o ambiente. A API valida o token antes de identificar o usuário. A opção de selecionar os usuários de teste do ambiente local fica desativada. |

Depois de identificar o usuário, o Ledger aplica a mesma regra de titularidade em todos os ambientes. Se Ana cadastrou a conta A, o ID de usuário de Ana fica vinculado à conta. O ID da conta A serve para localizar a conta. Se Bruno informar esse ID, ele continua sem acesso ao saldo e ao extrato de A. A conta A pode receber uma transferência mesmo com Ana desconectada.

## 2. Contas de outro titular

Uma consulta comum apresenta a mesma indisponibilidade para uma conta inexistente, uma conta de outro titular ou a funding account. O resultado omite o nome, o titular e o saldo dessas contas. A [consulta ao comprovante](../consultas/comprovante.md) aplica a mesma proteção, incluindo quando a conta própria não participou da movimentação.

Ana pode transferir da conta A para o ID conhecido da conta B, de Bruno. A confirmação mostra o ID de B que Ana informou. Bruno vê a entrada no extrato de B. Se Ana tentar consultar B ou usá-la como origem, o Ledger informa indisponibilidade.

## 3. Permissões específicas por ação

Uma pessoa pode receber mais de uma permissão. Por exemplo, quem prepara créditos de teste em homologação só pode concedê-los nesse ambiente. A permissão de estorno autoriza debitar a conta de destino pelo valor da transferência original. Consultar o saldo do destinatário continua restrito ao titular.

Uma conta comum antiga fica indisponível até a [atribuição de titular](atribuir-titular.md). A atribuição preserva o saldo, o histórico e a autoria das operações anteriores. A primeira versão admite atribuição de conta sem titular. Troca de titular fica fora desse fluxo.

Ao consultar uma confirmação anterior, o Ledger verifica a autorização atual. O valor de `Idempotency-Key` é consultado no escopo do usuário e do tipo de operação. Copiar o valor usado por outra pessoa não concede acesso ao pedido dela.
