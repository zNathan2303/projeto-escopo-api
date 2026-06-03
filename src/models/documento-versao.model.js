import knex from '../config/database.js';

export async function criar({ conteudo, criadorId, documentoId }, db = knex) {
  const [resultado] = await db.raw(
    `
    INSERT INTO documento_versao (conteudo, criador_id, documento_id)
    VALUES (?, ?, ?)
    `,
    [conteudo, criadorId, documentoId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function obterVersoesPorDocumentoId(documentoId) {
  const [resultado] = await knex.raw(
    `
    SELECT dv.id, dv.criado_em FROM documento_versao AS dv
    JOIN documento AS d
      ON d.id = dv.documento_id
    WHERE d.id = ?
    ORDER BY dv.criado_em DESC
    `,
    [documentoId],
  );

  return resultado;
}

export async function obterPorId(versaoId) {
  const [resultado] = await knex.raw(
    `
    SELECT dv.id, dv.conteudo, dv.criado_em, d.titulo
    FROM documento_versao AS dv
    JOIN documento AS d
      ON d.id = dv.documento_id
    WHERE dv.id = ?
    `,
    [versaoId],
  );

  const [documento] = resultado;

  return documento;
}
