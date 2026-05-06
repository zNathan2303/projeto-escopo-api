import knex from '../config/database.js';

export async function criar({ titulo }, projetoId, usuarioId) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO categoria (titulo, projeto_id)
    SELECT ?, ?
    WHERE EXISTS (
      SELECT 1
      FROM usuario_projeto AS up
      JOIN projeto AS p
        ON p.id = up.projeto_id
      JOIN usuario AS u
        ON u.id = up.usuario_id
      WHERE up.projeto_id = ?
        AND up.usuario_id = ?
        AND up.nivel_acesso_id IN (1, 2)
        AND u.status = true
        AND p.deletado_em IS NULL
    )`,
    [titulo, projetoId, projetoId, usuarioId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function excluir(categoriaId, projetoId, usuarioId) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM categoria
    WHERE id = ?
      AND projeto_id = ?
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto AS up
      JOIN projeto AS p
        ON p.id = up.projeto_id
      JOIN usuario AS u
        ON u.id = up.usuario_id
      WHERE up.projeto_id = ?
        AND up.usuario_id = ?
        AND up.nivel_acesso_id IN (1, 2)
        AND u.status = true
        AND p.deletado_em IS NULL
    )`,
    [categoriaId, projetoId, projetoId, usuarioId],
  );

  return resultado; // Contém affectedRows
}

export async function obterComDocumentos(projetoId, usuarioId) {
  const [resultado] = await knex.raw(
    `
    SELECT vw.projeto
    FROM vw_projeto_com_categorias_documentos vw
    JOIN usuario_projeto up
      ON up.projeto_id = vw.projeto_id
    JOIN usuario u
      ON u.id = up.usuario_id
    JOIN projeto p
      ON p.id = up.projeto_id
    WHERE vw.projeto_id = ?
      AND up.usuario_id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [projetoId, usuarioId],
  );

  const [projetoComCategoriasEDocumentos] = resultado;

  return projetoComCategoriasEDocumentos;
}
