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

export async function criar({ titulo, categoriaID }, projetoID, usuarioID, db = knex) {
  const [resultado] = await db.raw(
    `
    INSERT INTO documento (titulo, categoria_id)
    SELECT ?, ?
    WHERE EXISTS (
      SELECT 1
      FROM usuario_projeto AS up
      JOIN usuario AS u
        ON u.id = up.usuario_id
      WHERE up.projeto_id = ?
        AND up.usuario_id = ?
        AND up.nivel_acesso_id IN (1, 2)
        AND u.status = true
    )`,
    [titulo, categoriaID, projetoID, usuarioID],
  );

  return resultado; // Contém affectedRows e insertId
}
