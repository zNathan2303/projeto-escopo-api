import knex from '../config/database.js';

export async function obterTodasPorUsuarioId(usuarioId) {
  const [notificacoes] = await knex.raw(
    `
    SELECT
      n.id, n.descricao, n.data, n.aberto, n.comentario_id, c.documento_id
    FROM notificacao AS n
    JOIN comentario AS c
      ON n.comentario_id = c.id
    JOIN documento
     ON documento.id = c.documento_id
    WHERE n.usuario_id = ?
      AND documento.deletado_em IS NULL
    `,
    [usuarioId],
  );
  return notificacoes;
}

export async function abrirNotificacao({ notificacaoId }) {
  const [resultado] = await knex.raw(
    `
    UPDATE notificacao
    SET aberto = 1
    WHERE id = ?`,
    [notificacaoId],
  );
  return resultado; // Contém affectedRows
}

export async function verificarUsuarioPorNotificacaoId({ usuarioId, notificacaoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT COUNT(id) FROM notificacao
    WHERE notificacao.usuario_id = ?
    AND notificacao.id = ?
    `,
    [usuarioId, notificacaoId],
  );

  return resultado[0];
}
