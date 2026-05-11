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
    INSERT INTO comentario (
      conteudo, parent_id, registro_referencia_id,
      criador_id, documento_id, comentario_tipo_id
    )
    SELECT ?, ?, ?, ?, ?, ?
    `,
    [conteudo, parentId, registroReferenciaId, criadorId, documentoId, tipoComentarioId],
  );

  return resultado; // Contém affectedRows e insertId
}
