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

export async function atualizar({ convidadoId, nome, cargo }) {
  const [resultado] = await knex.raw(
    `
    UPDATE convidado_reuniao
    SET nome = ?, cargo = ?
    WHERE id = ?
    `,
    [nome, cargo, convidadoId],
  );

  return resultado;
}

export async function excluir(convidadoId) {
  const [resultado] = await knex.raw(
    `
    DELETE FROM convidado_reuniao
    WHERE id = ?
    `,
    [convidadoId],
  );

  return resultado;
}
