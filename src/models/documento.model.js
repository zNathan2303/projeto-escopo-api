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

export async function criar({ titulo, categoriaID }, db = knex) {
  const [resultado] = await db.raw(
    `
    INSERT INTO documento (titulo, categoria_id)
    SELECT ?, ?
    `,
    [titulo, categoriaID],
  );

  return resultado; // Contém affectedRows e insertId
}
