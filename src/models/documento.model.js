import knex from '../config/database.js';

export async function obterModificadosRecentemente(usuarioId) {
  const documentos = await knex('vw_documentos_recentes')
    .select('id', 'projeto', 'categoria', 'documento')
    .max('ultima_edicao as ultima_edicao')
    .where('criador_id', usuarioId)
    .groupBy('id')
    .limit(5);

  return documentos;
}
