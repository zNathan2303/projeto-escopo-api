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
    )
    `,
    [titulo, projetoId, projetoId, usuarioId],
  );

  return resultado; // Contém affectedRows e insertId
}
