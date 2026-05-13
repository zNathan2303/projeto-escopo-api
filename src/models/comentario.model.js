import knex from '../config/database.js';

export async function criar({
  conteudo,
  parentId,
  registroReferenciaId,
  criadorId,
  documentoId,
  tipoComentarioId,
}) {
  const [resultado] = await knex.raw(
    `
    CALL criar_comentario(?, ?, ?, ?, ?, ?)
    `,
    [conteudo, parentId, registroReferenciaId, criadorId, documentoId, tipoComentarioId],
  );

  return resultado;
}

export async function obterPorDocumentoId(documentoId) {
  const [resultado] = await knex.raw(`SELECT * FROM vw_comentarios WHERE documento_id = ?`, [
    documentoId,
  ]);

  return resultado;
}
