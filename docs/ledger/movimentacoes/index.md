---
title: Movimentações
---

# Movimentações

## 1. Objetivo

O módulo registra alterações de saldo com contrapartida. Cada operação tem condições de confirmação e resultados de rejeição próprios.

## 2. Operações

| Operação | Finalidade |
| --- | --- |
| [Valores e integridade](valores-e-integridade.md) | Regras comuns sobre moeda, precisão, limites e soma dos lançamentos. |
| [Crédito de teste](credito-de-teste.md) | Preparar uma conta com saldo de simulação e origem identificável. |
| [Transferência](transferencia.md) | Movimentar valor entre contas comuns. |
| [Reenviar uma movimentação](repeticao.md) | Recuperar uma confirmação após perda de resposta. |
| [Estorno integral](estorno.md) | Compensar uma transferência mantendo o registro original. |

## 3. Confirmação da movimentação

| Situação | Resultado observável |
| --- | --- |
| Pedido confirmado | Uma movimentação e seus dois lançamentos ficam disponíveis juntos. |
| Pedido rejeitado | A pessoa recebe o resultado de rejeição permitido pela política de acesso. Saldos e extrato permanecem iguais. |
| Resposta indisponível | A pessoa pode consultar ou reenviar o mesmo pedido conforme as regras da operação. Em restore, um pedido em conferência aguarda liberação. |
| Transferência estornada | A transferência original permanece no histórico e pode ser associada à movimentação compensatória. |

A confirmação fica disponível quando os dois lançamentos forem registrados. Se a resposta se perder, veja como [reenviar o mesmo pedido](repeticao.md).
