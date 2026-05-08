import knex from '../config/database.js';

export async function buscarParticipacaoDoUsuarioNoProjeto({ usuarioId, projetoId }) {
  const permissao = await knex('usuario_projeto as up')
    .select('up.nivel_acesso_id')
    .join('usuario as u', 'u.id', 'up.usuario_id')
    .join('projeto as p', 'p.id', 'up.projeto_id')
    .where('u.id', usuarioId)
    .where('u.status', true)
    .where('p.id', projetoId)
    .whereNull('p.deletado_em')
    .first();

  return permissao;
}
