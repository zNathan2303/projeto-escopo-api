import knex from '../config/database.js';

export async function obterTodosPorProjetoId(projetoId) {
  const [registros] = await knex.raw(
    `
    SELECT id, titulo, conteudo, atualizado_em, criado_em
    FROM registro
    WHERE projeto_id = ?
    `,
    [projetoId],
  );

  return registros;
}

export async function criar({ titulo, conteudo, projetoId, criadorId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO registro (titulo, conteudo, criador_id, projeto_id)
    VALUES (?, ?, ?, ?)
    `,
    [titulo, conteudo, criadorId, projetoId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function atualizarTitulo({ titulo, registroId }) {
  const [resultado] = await knex.raw(
    `
    UPDATE registro SET titulo = ?
    WHERE id = ?
    `,
    [titulo, registroId],
  );

  return resultado; // Contém affectedRows
}

export async function atualizarConteudo({ conteudo, registroId }) {
  const [resultado] = await knex.raw(
    `
    UPDATE registro SET conteudo = ?
    WHERE id = ?
    `,
    [conteudo, registroId],
  );

  return resultado; // Contém affectedRows
}

export async function obterDetalhesPorRegistroId(registroId) {
  const [resultado] = await knex.raw(
    `
    SELECT id, titulo, conteudo, atualizado_em, criado_em
    FROM registro
    WHERE id = ?
    `,
    [registroId],
  );

  return resultado;
}

export async function excluir(registroId) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM registro
    WHERE id = ?
    `,
    [registroId],
  );

  return resultado; // Contém affectedRows
}
