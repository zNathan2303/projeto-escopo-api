import knex from '../config/database.js';

export async function criar({ titulo, descricao, criador_id }, db = knex) {
  const resultado = await db('projeto').insert({
    titulo,
    descricao,
    criador_id,
  });

  const [id] = resultado;

  return id;
}

export async function obterTodosQueUsuarioParticipa(usuarioId) {
  const projetos = await knex('vw_projetos_com_usuarios').whereIn('id', (subQuery) => {
    subQuery.select('projeto_id').from('usuario_projeto').where('usuario_id', usuarioId);
  });

  return projetos;
}

export async function obterDetalhes(projetoId, usuarioId) {
  const resultado = await knex('vw_projetos_detalhes as vw')
    .select(
      'vw.id',
      'vw.titulo',
      'descricao',
      'vw.status',
      'vw.data_criacao',
      'vw.criador_id',
      'vw.nome_responsavel',
      'vw.ultima_atualizacao',
      'usuario_projeto.nivel_acesso_id',
    )
    .join('usuario_projeto', 'vw.id', 'usuario_projeto.projeto_id')
    .where('projeto_id', projetoId)
    .andWhere('usuario_id', usuarioId);

  const [projeto] = resultado;

  return projeto;
}

export async function atualizar({ titulo, descricao, id }, usuarioId, db = knex) {
  const linhasAfetadas = await db('projeto')
    .update({ titulo, descricao })
    .where('id', id)
    .whereExists((subQuery) => {
      subQuery
        .select('*')
        .from('usuario_projeto')
        .whereRaw('projeto.id = usuario_projeto.projeto_id')
        .andWhere('usuario_id', usuarioId)
        .andWhere('nivel_acesso_id', 1);
    });

  return linhasAfetadas; // Pode ser 1 ou 0, que significa que o usuário conseguiu ou não
}

export async function excluir(projetoId, usuarioId, db = knex) {
  const horarioAtual = new Date();

  const [resultado] = await db.raw(
    `
    UPDATE projeto SET deletado_em = ?
    WHERE id = ?
      AND deletado_em IS NULL
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto AS up
      JOIN usuario AS u
        ON u.id = ?
      WHERE up.projeto_id = ?
        AND up.usuario_id = ?
        AND up.nivel_acesso_id IN (1)
        AND u.status = true
    )`,
    [horarioAtual, projetoId, usuarioId, projetoId, usuarioId],
  );

  return resultado; // Contém affectedRows
}
