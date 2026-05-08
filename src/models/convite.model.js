import knex from '../config/database.js';

export async function criarVarios(convites, db = knex) {
  // Utiliza o Query Builder para facilitar, devido os convites serem um Array
  const IDs = await db('convite').insert(convites);

  return IDs;
}

export async function enviarDinamicamentePorProcedure(
  { projetoId, destinatarioId, nivelAcessoId, remetenteId },
  db = knex,
) {
  await db.raw(
    `
    CALL enviar_convite(?, ?, ?, ?)
    `,
    [projetoId, destinatarioId, nivelAcessoId, remetenteId],
  );
}

export async function obterAtivosDeUsuario(usuarioId) {
  const [convites] = await knex.raw(
    `
    SELECT * FROM convite
    WHERE convite_status_id IN (?, ?)
      AND destinatario_id = ?
    ORDER BY criado_em DESC
    `,
    [1, 4, usuarioId],
  );

  return convites;
}
