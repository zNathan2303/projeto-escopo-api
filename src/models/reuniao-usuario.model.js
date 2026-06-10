import knex from '../config/database.js';

export async function criar({ reuniaoId, usuarioId, cargo }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO reuniao_usuario (usuario_id, reuniao_id, cargo)
    SELECT ?, ?, ? FROM usuario
    WHERE id = ?
    `,
    [usuarioId, reuniaoId, cargo, usuarioId],
  );

  return resultado;
}

export async function excluir({ reuniaoId, usuarioId }) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM reuniao_usuario
    WHERE reuniao_id = ?
      AND usuario_id = ?
    `,
    [reuniaoId, usuarioId],
  );

  return resultado;
}
