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
