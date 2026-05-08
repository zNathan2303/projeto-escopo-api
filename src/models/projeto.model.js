import knex from '../config/database.js';

export async function criar({ titulo, descricao, criadorId }, db = knex) {
  const [resultado] = await db.raw(
    `
    INSERT INTO projeto (titulo, descricao, criador_id)
    VALUES (?, ?, ?)
    `,
    [titulo, descricao, criadorId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function obterTodosQueUsuarioParticipa(usuarioId) {
  const [projetos] = await knex.raw(
    `
    SELECT * FROM vw_projetos_com_usuarios
    WHERE id IN(
      SELECT projeto_id
      FROM usuario_projeto
      WHERE usuario_id = ?
    )`,
    [usuarioId],
  );

  return projetos;
}

export async function obterDetalhes(projetoId, usuarioId) {
  const [resultado] = await knex.raw(
    `
    SELECT
      vw.*,
      up.nivel_acesso_id
    FROM vw_projetos_detalhes AS vw
    JOIN usuario_projeto AS up
      ON vw.id = up.projeto_id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    JOIN projeto AS p
      ON p.id = vw.id
    WHERE vw.id = ?
      AND up.usuario_id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [projetoId, usuarioId],
  );

  const [projeto] = resultado;

  return projeto;
}

export async function atualizar({ titulo, descricao, id }, usuarioId, db = knex) {
  const [resultado] = await db.raw(
    `
    UPDATE projeto
      SET titulo = ?, descricao = ?
    WHERE id = ?
      AND deletado_em IS NULL
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto AS up
      JOIN usuario AS u
        ON u.id = up.usuario_id
      WHERE up.projeto_id = ?
        AND up.usuario_id = ?
        AND up.nivel_acesso_id IN (1)
        AND u.status = true
    )`,
    [titulo, descricao, id, id, usuarioId],
  );

  return resultado; // Contém affectedRows
}

export async function excluir(projetoId, usuarioId, db = knex) {
  const horarioAtual = new Date();

  const [resultado] = await db.raw(
    `
    UPDATE projeto SET deletado_em = ?
    WHERE id = ?
      AND deletado_em IS NULL
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto AS up
      JOIN usuario AS u
        ON u.id = up.usuario_id
      WHERE up.projeto_id = ?
        AND up.usuario_id = ?
        AND up.nivel_acesso_id IN (1)
        AND u.status = true
    )`,
    [horarioAtual, projetoId, projetoId, usuarioId],
  );

  return resultado; // Contém affectedRows
}
