import knex from '../config/database.js';

export async function criar({ conteudo, criadorId, documentoId, projetoId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO documento_versao (conteudo, criador_id, documento_id)
    SELECT ?, ?, ?
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
    [conteudo, criadorId, documentoId, projetoId, criadorId],
  );

  return resultado; // Contém affectedRows e insertId
}
