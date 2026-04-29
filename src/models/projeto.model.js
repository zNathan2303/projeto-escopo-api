import knex from '../config/database.js';

export async function criar({ titulo, descricao, criador_id }, db = knex) {
  const [id] = await db('projeto').insert({
    titulo,
    descricao,
    criador_id,
  });

  return id;
}

export async function obterTodosQueUsuarioEsta(usuarioId) {
  const projetosComDuplicatas = await knex('projeto')
    .join('usuario_projeto as up_user', 'projeto.id', 'up_user.projeto_id')
    .where('up_user.usuario_id', usuarioId)
    .join('usuario_projeto as up', 'projeto.id', 'up.projeto_id')
    .join('usuario', 'usuario.id', 'up.usuario_id')
    .where('usuario.status', true)
    .select(
      'projeto.id',
      'projeto.titulo',
      'projeto.descricao',
      'usuario.foto_perfil',
      'up.id as up_id',
    )
    .orderBy('up.id');

  const projetosMap = new Map();

  for (const linha of projetosComDuplicatas) {
    if (!projetosMap.has(linha.id)) {
      projetosMap.set(linha.id, {
        id: linha.id,
        titulo: linha.titulo,
        descricao: linha.descricao,
        foto_usuarios: [],
      });
    }

    const projeto = projetosMap.get(linha.id);

    if (projeto.foto_usuarios.length < 5) {
      projeto.foto_usuarios.push(linha.foto_perfil);
    }
  }

  return Array.from(projetosMap.values());
}

export async function obterDetalhes(projetoId, usuarioId) {
  const projeto = await knex('projeto as p')
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
    )
    .first();

  return projeto;
}
