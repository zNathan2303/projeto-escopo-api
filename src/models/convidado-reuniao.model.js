import knex from '../config/database.js';

export async function criar({ nome, cargo, reuniaoId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO convidado_reuniao (nome, cargo, reuniao_id)
    VALUES (?, ?, ?)
    `,
    [nome, cargo, reuniaoId],
  );

  return resultado; // Contém affectedRows e insertId
}
