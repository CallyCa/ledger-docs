const category = (label, id, items) => ({
  type: 'category',
  label,
  link: {type: 'doc', id},
  items,
});

export default {
  ledger: [
    'ledger/index',
    {type: 'doc', id: 'ledger/api/index', label: 'API'},
    category('Geral', 'ledger/geral/index', [
      'ledger/geral/glossario',
      'ledger/geral/resultados-das-acoes',
      'ledger/geral/referencias',
    ]),
    category('Contas', 'ledger/contas/index', [
      'ledger/contas/cadastro-e-consulta',
      'ledger/contas/cadastrar-conta',
      'ledger/contas/listar-contas',
      'ledger/contas/visualizar-conta',
    ]),
    category('Movimentações', 'ledger/movimentacoes/index', [
      'ledger/movimentacoes/valores-e-integridade',
      'ledger/movimentacoes/credito-de-teste',
      'ledger/movimentacoes/transferencia',
      'ledger/movimentacoes/repeticao',
      'ledger/movimentacoes/estorno',
    ]),
    category('Consultas', 'ledger/consultas/index', [
      'ledger/consultas/saldo',
      'ledger/consultas/extrato',
      'ledger/consultas/comprovante',
    ]),
    category('Acesso', 'ledger/acesso/index', [
      'ledger/acesso/permissoes',
      'ledger/acesso/atribuir-titular',
    ]),
    category('Operação', 'ledger/operacao/index', [
      'ledger/operacao/auditoria',
      'ledger/operacao/conciliar',
      'ledger/operacao/validar-recuperacao',
    ]),
  ],
};
