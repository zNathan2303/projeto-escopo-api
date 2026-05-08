import knex from '../config/database.js';

export async function criar({ conteudo, criadorId, documentoId, projetoId, categoriaId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO documento_versao (conteudo, criador_id, documento_id)
    SELECT ?, ?, d.id
    FROM documento AS d
    JOIN categoria AS c
      ON c.id = d.categoria_id
    WHERE d.id = ?
      AND d.deletado_em IS NULL
      AND c.id = ?
      AND c.projeto_id = ?
    `,
    [conteudo, criadorId, documentoId, categoriaId, projetoId],
  );

  return resultado; // Contém affectedRows e insertId
}
