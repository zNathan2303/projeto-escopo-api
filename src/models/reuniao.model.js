import knex from '../config/database.js';

export async function obterPorProjetoId(projetoId) {
  const [resultado] = await knex.raw(
    `
    SELECT id, titulo, criado_em, foto_usuarios
    FROM vw_reunioes_com_usuarios
    WHERE projeto_id = ?
    `,
    [projetoId],
  );

  return resultado;
}

export async function criar({ titulo, projetoId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO reuniao (titulo, projeto_id)
    VALUES (?, ?)
    `,
    [titulo, projetoId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function atualizarTitulo({ titulo, reuniaoId }) {
  const [resultado] = await knex.raw(
    `
    UPDATE reuniao
    SET titulo = ?
    WHERE id = ?
    `,
    [titulo, reuniaoId],
  );

  return resultado; // Contém affectedRows
}

export async function atualizarTranscricao({ transcricao, reuniaoId }) {
  const [resultado] = await knex.raw(
    `
    UPDATE reuniao
    SET transcricao = ?
    WHERE id = ?
    `,
    [transcricao, reuniaoId],
  );

  return resultado; // Contém affectedRows
}

export async function obterDetalhesPorId(reuniaoId) {
  const [resultado] = await knex.raw(
    `
    SELECT * FROM vw_reuniao_detalhes
    WHERE id = ?
    `,
    [reuniaoId],
  );

  const [reuniao] = resultado;

  return reuniao;
}

export async function excluir(reuniaoId) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM reuniao
    WHERE id = ?
    `,
    [reuniaoId],
  );

  return resultado;
}
