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
