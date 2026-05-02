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
  const [projeto] = await knex('projeto as p')
    .where('p.id', projetoId)
    .andWhere('p.criador_id', usuarioId)
    .join('usuario as u', 'u.id', 'p.criador_id')
    .select(
      'p.id',
      'p.titulo',
      'p.descricao',
      'p.status',
      'p.data_criacao',
      'u.nome as nome_responsavel',
      knex.raw(`
        (
          SELECT MAX(dv.criado_em)
          FROM categoria c
          JOIN documento d ON d.categoria_id = c.id
          JOIN documento_versao dv ON dv.documento_id = d.id
          WHERE c.projeto_id = p.id
        ) as ultima_atualizacao
      `),
    );

  return projeto;
}
