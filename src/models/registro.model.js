import knex from '../config/database.js';

export async function obterTodosDeUmProjeto(projetoId, usuarioId) {
  const [registros] = await knex.raw(
    `
    SELECT
      r.id, r.titulo, r.conteudo, r.atualizado_em, r.criado_em
    FROM registro AS r
    JOIN usuario_projeto AS up
      ON up.projeto_id = r.projeto_id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    JOIN projeto AS p
      ON p.id = up.projeto_id
    WHERE r.projeto_id = ?
      AND up.usuario_id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [projetoId, usuarioId],
  );

  return registros;
}

export async function criar({ titulo, conteudo, projeto_id, criador_id }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO registro (titulo, conteudo, criador_id, projeto_id)
    SELECT ?, ?, ?, ?
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
    [titulo, conteudo, criador_id, projeto_id, projeto_id, criador_id],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function atualizarTitulo({ titulo, registro_id, projeto_id, usuario_id }) {
  const [resultado] = await knex.raw(
    `
    UPDATE registro SET titulo = ?
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
    [titulo, registro_id, projeto_id, projeto_id, usuario_id],
  );

  return resultado; // Contém affectedRows
}

export async function atualizarConteudo({ conteudo, registro_id, projeto_id, usuario_id }) {
  const [resultado] = await knex.raw(
    `
    UPDATE registro SET conteudo = ?
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
    [conteudo, registro_id, projeto_id, projeto_id, usuario_id],
  );

  return resultado; // Contém affectedRows
}

export async function obterDetalhesDeUm(registro_id, projeto_id, usuario_id) {
  const [resultado] = await knex.raw(
    `
    SELECT r.id, r.titulo, r.conteudo, r.atualizado_em, r.criado_em
    FROM registro AS r
    JOIN usuario_projeto AS up
      ON up.projeto_id = r.projeto_id
    JOIN usuario AS u
      ON u.id = up.usuario_id
    JOIN projeto AS p
      ON p.id = up.projeto_id
    WHERE r.id = ?
      AND r.projeto_id = ?
      AND up.usuario_id = ?
      AND u.status = true
      AND p.deletado_em IS NULL
    `,
    [registro_id, projeto_id, usuario_id],
  );

  return resultado;
}

export async function excluir(registro_id, projeto_id, usuario_id) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM registro
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
    [registro_id, projeto_id, projeto_id, usuario_id],
  );

  return resultado; // Contém affectedRows
}
