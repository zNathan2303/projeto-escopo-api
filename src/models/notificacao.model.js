import knex from '../config/database.js';

export async function obterTodasPorUsuarioId(usuarioId) {
  const [notificacoes] = await knex.raw(
    `SELECT 
        notificacao.id, notificacao.descricao, notificacao.data, notificacao.aberto, notificacao.comentario_id, comentario.documento_id
        FROM notificacao
        JOIN comentario ON notificacao.comentario_id = comentario.id
        WHERE usuario_id = ?
        `,
    [usuarioId],
  );
  return notificacoes;
}

export async function abrirNotificacao({ notificacaoId }) {
  const [resultado] = await knex.raw(
    `UPDATE notificacao SET aberto = 1
    WHERE id = ?`,
    [notificacaoId],
  );
  return resultado; // Contém affectedRows
}

export async function verificarRemetentePorNotificacaoId({ usuarioId, notificacaoId }) {
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
