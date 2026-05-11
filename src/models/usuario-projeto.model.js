import knex from '../config/database.js';

export async function buscarParticipacaoDoUsuarioNoProjeto({ usuarioId, projetoId }) {
  const permissao = await knex('usuario_projeto as up')
    .select('up.nivel_acesso_id')
    .join('usuario as u', 'u.id', 'up.usuario_id')
    .join('projeto as p', 'p.id', 'up.projeto_id')
    .where('u.id', usuarioId)
    .where('u.status', true)
    .where('p.id', projetoId)
    .whereNull('p.deletado_em')
    .first();

  return permissao;
}

export async function buscarUsuarioPorDocumentoId({ usuarioId, documentoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN categoria AS c
      ON c.projeto_id = p.id
    JOIN documento AS d
      ON d.categoria_id = c.id
    WHERE up.usuario_id = ?
      AND d.id = ?
    `,
    [usuarioId, documentoId],
  );

  return resultado;
}
