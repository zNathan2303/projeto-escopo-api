import knex from '../config/database.js';

export async function criar({ titulo, descricao, criador_id }, db = knex) {
  const [id] = await db('projeto').insert({
    titulo,
    descricao,
    criador_id,
  });

  return id;
}

export async function obterTodosQueUsuarioParticipa(usuarioId) {
  const projetos = await knex('vw_projetos_com_usuarios').whereIn('id', (subQuery) => {
    subQuery.select('projeto_id').from('usuario_projeto').where('usuario_id', usuarioId);
  });

  return projetos;
}

export async function obterDetalhes(projetoId, usuarioId) {
  const resultado = await knex('vw_projetos_detalhes as vw')
    .select(
      'vw.id',
      'vw.titulo',
      'descricao',
      'vw.status',
      'vw.data_criacao',
      'vw.criador_id',
      'vw.nome_responsavel',
      'vw.ultima_atualizacao',
      'usuario_projeto.nivel_acesso_id',
    )
    .join('usuario_projeto', 'vw.id', 'usuario_projeto.projeto_id')
    .where('projeto_id', projetoId)
    .andWhere('usuario_id', usuarioId);

  const [projeto] = resultado;

  return projeto;
}
