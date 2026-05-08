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

export async function obterVersoesPorDocumentoId({ documentoId, projetoId, categoriaId }) {
  const [resultado] = await knex.raw(
    `
    SELECT dv.id, dv.criado_em FROM documento_versao AS dv
    JOIN documento AS d
      ON d.id = dv.documento_id
    JOIN categoria AS c
      ON c.id = d.categoria_id
    WHERE d.id = ?
      AND d.deletado_em IS NULL
      AND c.id = ?
      AND c.projeto_id = ?
    ORDER BY dv.criado_em DESC
    `,
    [documentoId, categoriaId, projetoId],
  );

  return resultado;
}

export async function obterPorId({ documentoId, projetoId, categoriaId, versaoId }) {
  const [resultado] = await knex.raw(
    `
    SELECT dv.id, dv.conteudo, dv.criado_em, d.titulo
    FROM documento_versao AS dv
    JOIN documento AS d
      ON d.id = dv.documento_id
    JOIN categoria AS c
      ON c.id = d.categoria_id
    WHERE dv.id = ?
      AND d.id = ?
      AND c.id = ?
      AND c.projeto_id = ?
    `,
    [versaoId, documentoId, categoriaId, projetoId],
  );

  const [documento] = resultado;

  return documento;
}
