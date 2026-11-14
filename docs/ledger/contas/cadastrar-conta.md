---
title: Cadastrar conta
---

# Cadastrar conta

## 1. Breadcrumb

Ledger > Contas > **Cadastro**

## 2. Cabeçalho

**Título**\
Cadastro de conta

**Ação**\
Cadastrar conta

## 3. Componentes

- Campo **Nome**, editável.
- Informação **Moeda**, apresentada como BRL.
- Ação **Cadastrar conta**.
- Resultado do cadastro, com identificador, nome, moeda e saldo inicial.
- Acesso à [visualização da conta](visualizar-conta.md) após confirmação.

## 4. Regras

### 4.1 Disponibilidade

- Em homologação e produção, é preciso fazer login para cadastrar uma conta. A API obtém o ID do usuário pela sessão e o vincula à conta criada. A confirmação mostra o ID da conta, o nome, a moeda e o saldo inicial.
- Cada cadastro confirmado deve gerar uma conta própria. O mesmo nome pode ser usado em contas diferentes. Se a resposta se perder, cadastrar de novo pode criar outra conta.

### 4.2 Preencher os dados

- Remova os espaços das extremidades e preserve os espaços internos, os acentos e a capitalização. O nome deve ter de 1 a 100 caracteres visíveis após essa remoção. Em `  Conta A  `, o nome exibido é `Conta A`. A letra `a` seguida do acento agudo combinante conta como um caractere.
- Moeda e saldo inicial são definidos pelo Ledger. A pessoa só informa o nome. Quem cadastra é o titular da conta. Ao preparar um cenário de teste autorizado, o operador informa quem será o titular.

### 4.3 Cadastrar

- Ao confirmar o cadastro, deve ser gerado um identificador único e permanente. A nova conta deve ter saldo de R&#36; 0,00, sem movimentação ou lançamento de abertura. A conta recém-cadastrada só pode enviar valor após receber saldo confirmado. Em ambientes autorizados, o operador pode [creditar saldo de teste](../movimentacoes/credito-de-teste.md).
- Nome ausente, vazio após remoção de espaços ou acima de 100 caracteres deve impedir o cadastro. O nome informado deve ficar disponível para correção e o resultado deve indicar a condição que falhou.
- A confirmação deve ficar disponível quando o cadastro puder ser consultado pelo identificador gerado. Se o resultado ficar desconhecido por falha de comunicação, a interface deve manter o nome digitado, avisar que um novo envio pode criar outra conta e permitir consultar a [lista de contas próprias](listar-contas.md) quando disponível. A presença do mesmo nome na lista é insuficiente para identificar o resultado da tentativa.
- Se os registros de conta ou titularidade estiverem em conferência após [restauração](../operacao/validar-recuperacao.md), o cadastro deve informar indisponibilidade temporária quando estiver suspenso.

| Condição | Resultado apresentado | Efeito |
| --- | --- | --- |
| Nome válido e usuário autorizado | Conta cadastrada | Uma conta comum criada, saldo zero e extrato vazio. |
| Nome igual ao de outra conta | Conta cadastrada | Identificador próprio. A conta anterior permanece igual. |
| Nome ausente ou fora dos limites | Indicação junto ao nome | Nenhuma conta ou movimentação criada. |
| Pessoa sem login em homologação ou produção | Autenticação necessária | Cadastro não realizado. |
| Resposta indisponível | Resultado do cadastro desconhecido | O resultado precisa ser confirmado. A interface não envia outro cadastro automaticamente. |

## 5. Dicionário de dados

| Campo | Obrigatório | Tamanho ou faixa | Tipo de dado | Observação |
| --- | --- | --- | --- | --- |
| Nome | Sim | 1 a 100 caracteres | Texto | Exemplo: Conta A. |
| ID da conta | Gerado | Único no ambiente | ID | Exibido após confirmação. |
| Titular | Determinado pela sessão | Um por conta comum nova | ID do usuário | No cadastro comum, corresponde à pessoa autenticada. |
| Moeda | Gerado | BRL | Moeda | O Ledger define BRL. O campo não é editável. |
| Saldo inicial | Gerado | R&#36; 0,00 | Valor monetário | Cadastro não produz lançamento. |
