import knex from '../config/database.js';

export async function criarVarios(convites, db = knex) {
  const IDs = await db('convite').insert(convites);

  return IDs;
}

export async function enviarDinamicamentePorProcedure(
  { projetoID, destinatarioID, nivelAcessoID, remetenteID },
  db = knex,
) {
  await db.raw('CALL enviar_convite(?, ?, ?, ?)', [
    projetoID,
    destinatarioID,
    nivelAcessoID,
    remetenteID,
  ]);
}

export async function obterAtivosDeUsuario(usuarioId) {
  const convites = await knex('convite')
    .whereIn('convite_status_id', [1, 4])
    .andWhere('destinatario_id', usuarioId)
    .orderBy('criado_em', 'desc');

  return convites;
}
