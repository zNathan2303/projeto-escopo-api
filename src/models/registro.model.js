import knex from '../config/database.js';

export async function obterTodosDeUmProjeto(projetoId, usuarioId) {
  const registros = await knex('registro as r')
    .select('r.id', 'r.titulo', 'r.conteudo', 'r.atualizado_em', 'r.criado_em')
    .where('r.projeto_id', projetoId)
    .join('usuario_projeto as up', 'up.projeto_id', 'r.projeto_id')
    .where('up.usuario_id', usuarioId);

  return registros;
}

export async function criar({ titulo, conteudo, projeto_id, criador_id }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO registro (titulo, conteudo, criador_id, projeto_id)
    SELECT ?, ?, ?, ?
    WHERE EXISTS (
      SELECT 1
      FROM usuario_projeto
      WHERE projeto_id = ?
        AND usuario_id = ?
        AND nivel_acesso_id IN (1, 2)
    )
    `,
    [titulo, conteudo, criador_id, projeto_id, projeto_id, criador_id],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function atualizarTitulo({ titulo, registro_id, projeto_id, usuario_id }) {
  const [resultado] = await knex.raw(
    `
    UPDATE registro SET titulo = ?
    WHERE id = ?
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto
      WHERE projeto_id = ?
        AND usuario_id = ?
        AND nivel_acesso_id IN (1, 2)
    )`,
    [titulo, registro_id, projeto_id, usuario_id],
  );

  return resultado; // Contém affectedRows
}

export async function atualizarConteudo({ conteudo, registro_id, projeto_id, usuario_id }) {
  const [resultado] = await knex.raw(
    `
    UPDATE registro SET conteudo = ?
    WHERE id = ?
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto
      WHERE projeto_id = ?
        AND usuario_id = ?
        AND nivel_acesso_id IN (1, 2)
    )`,
    [conteudo, registro_id, projeto_id, usuario_id],
  );

  return resultado; // Contém affectedRows
}

export async function obterDetalhesDeUm(registro_id, projeto_id, usuario_id) {
  const [resultado] = await knex.raw(
    `
    SELECT id, titulo, conteudo, atualizado_em, criado_em FROM registro
    WHERE id = ?
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto
      WHERE projeto_id = ?
        AND usuario_id = ?
        AND nivel_acesso_id IN (1, 2)
    )`,
    [registro_id, projeto_id, usuario_id],
  );

  return resultado;
}

export async function excluir(registro_id, projeto_id, usuario_id) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM registro
    WHERE id = ?
    AND EXISTS (
      SELECT 1
      FROM usuario_projeto
      WHERE projeto_id = ?
        AND usuario_id = ?
        AND nivel_acesso_id IN (1, 2)
    )`,
    [registro_id, projeto_id, usuario_id],
  );

  return resultado; // Contém affectedRows
}
