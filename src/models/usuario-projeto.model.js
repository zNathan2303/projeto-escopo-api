import knex from '../config/database.js';

export async function verificarPermissaoDoUsuario({ usuarioID, projetoID, niveisDeAcessoIDs }) {
  const permissao = await knex('usuario_projeto as up')
    .select(1)
    .join('usuario as u', 'u.id', 'up.usuario_id')
    .join('projeto as p', 'p.id', 'up.projeto_id')
    .where('u.id', usuarioID)
    .where('u.status', true)
    .where('p.id', projetoID)
    .whereNull('p.deletado_em')
    .whereIn('up.nivel_acesso_id', niveisDeAcessoIDs)
    .first();

  return permissao;
}

export async function verificarParticipacaoDoUsuarioNoProjeto({ usuarioID, projetoID }) {
  const permissao = await knex('usuario_projeto as up')
    .select(1)
    .join('usuario as u', 'u.id', 'up.usuario_id')
    .join('projeto as p', 'p.id', 'up.projeto_id')
    .where('u.id', usuarioID)
    .where('u.status', true)
    .where('p.id', projetoID)
    .whereNull('p.deletado_em')
    .first();

  return permissao;
}
