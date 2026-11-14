---
title: Cadastro e consulta de contas
---

# Cadastro e consulta de contas

## 1. Objetivo

Uma pessoa pode cadastrar mais de uma conta em BRL, consultar as contas que possui e transferir saldo entre contas comuns.

## 2. Operações

| Operação | Disponibilidade | Resultado |
| --- | --- | --- |
| [Cadastrar conta](cadastrar-conta.md) | Usuário autenticado | Conta comum em BRL, com saldo zero. |
| [Listar contas próprias](listar-contas.md) | Usuário autenticado | Lista de contas comuns do usuário. |
| [Visualizar conta](visualizar-conta.md) | Titular da conta consultada | Nome, ID, moeda e saldo, com acesso ao extrato. |
| [Atribuir titular a conta antiga](../acesso/atribuir-titular.md) | Operador com permissão específica | Conta antiga vinculada ao ID do usuário escolhido. O histórico continua disponível ao novo titular. |

## 3. Tipos de conta

Cada conta comum tem um titular. A funding account fornece a contrapartida do crédito de teste e aparece na conciliação de saldos e lançamentos, disponível a quem tem permissão.

- A funding account deve ser preparada no ambiente autorizado para [crédito de teste](../movimentacoes/credito-de-teste.md). Ela deve ficar fora do cadastro, da consulta e da transferência comuns.
- O escopo inicial permite cadastrar e consultar contas. A listagem das próprias contas acompanha a interface. Renomear, fechar, excluir, listar publicamente e trocar a titularidade pelo fluxo comum ficam fora do escopo.
