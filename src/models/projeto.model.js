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

export async function obterDetalhes({ projetoId, usuarioId }) {
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

export async function atualizar({ titulo, descricao, projetoId }, db = knex) {
  const [resultado] = await db.raw(
    `
    UPDATE projeto
      SET titulo = ?, descricao = ?
    WHERE id = ?
    `,
    [titulo, descricao, projetoId],
  );

  return resultado; // Contém affectedRows
}

export async function desativar(projetoId, db = knex) {
  const horarioAtual = new Date();

  const [resultado] = await db.raw(
    `
    UPDATE projeto SET deletado_em = ?
    WHERE id = ?
    `,
    [horarioAtual, projetoId],
  );

  return resultado; // Contém affectedRows
}
