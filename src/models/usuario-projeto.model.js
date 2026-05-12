import knex from '../config/database.js';

export async function verificarParticipacaoPorProjetoId({ usuarioId, projetoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT up.nivel_acesso_id
    FROM usuario_projeto AS up
    JOIN projeto AS p
      ON p.id = up.projeto_id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND p.id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [usuarioId, projetoId],
  );

  return resultado[0];
}

export async function verificarParticipacaoPorDocumentoId({ usuarioId, documentoId }) {
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
    JOIN usuario AS u
      ON u.id = up.usuario_id
    WHERE up.usuario_id = ?
      AND d.id = ?
    `,
    [usuarioId, documentoId],
  );

  return resultado[0];
}
