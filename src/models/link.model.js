import knex from '../config/database.js';

export async function criar({ url, nome, tipoLinkId, reuniaoId }) {
  const [resultado] = await knex.raw(
    `
    INSERT INTO link (url, nome, tipo_link_id, reuniao_id)
    VALUES (?, ?, ?, ?)
    `,
    [url, nome, tipoLinkId, reuniaoId],
  );

  return resultado; // Contém affectedRows e insertId
}

export async function atualizarCampos({ url, nome, linkId }) {
  const [resultado] = await knex.raw(
    `
    UPDATE link
    SET url = ?, nome = ?
    WHERE id = ?
    `,
    [url, nome, linkId],
  );

  return resultado; // Contém affectedRows
}
