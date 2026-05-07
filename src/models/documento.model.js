import knex from '../config/database.js';

export async function obterModificadosRecentemente(usuarioId) {
  const [documentos] = await knex.raw(
    `
    SELECT
      id,
      projeto,
      categoria,
      documento,
      MAX(ultima_edicao) AS ultima_edicao
    FROM vw_documentos_recentes
    WHERE criador_id = ?
    GROUP BY id
    LIMIT 5
    `,
    [usuarioId],
  );

  return documentos;
}

export async function criar({ titulo, categoriaId, projetoId }, db = knex) {
  const [resultado] = await db.raw(
    `
    INSERT INTO documento (titulo, categoria_id)
    SELECT ?, c.id
    FROM categoria AS c
    WHERE c.id = ?
      AND c.projeto_id = ?
    `,
    [titulo, categoriaId, projetoId],
  );

  return resultado;
}

export async function obterDetalhesPorId({ documentoId, projetoId, categoriaId }) {
  const [resultado] = await knex.raw(
    `
    SELECT
      d.id,
      d.titulo,
      c.titulo AS categoria,
      p.titulo AS projeto,
      dv.conteudo,
      dv.criado_em AS ultima_alteracao
    FROM documento AS d
    JOIN categoria AS c
      ON d.categoria_id = c.id
    JOIN projeto AS p
      ON p.id = c.projeto_id
    JOIN documento_versao AS dv
      ON dv.documento_id = d.id
    WHERE d.id = ?
      AND c.id = ?
      AND p.id = ?
      AND dv.id = (
        SELECT dv2.id
        FROM documento_versao AS dv2
        WHERE dv2.documento_id = d.id
        ORDER BY dv2.criado_em DESC, dv2.id DESC
        LIMIT 1
      )
  `,
    [documentoId, categoriaId, projetoId],
  );

  const [documento] = resultado;

  return documento;
}
