import knex from '../config/database.js';

export async function cadastrar({ email, nome, senha }) {
  const resultado = await knex.raw('CALL criar_usuario(?, ?, ?)', [nome, email, senha]);

  const { id } = resultado[0][0][0];

  return id;
}

export async function obterComSenhaPorEmail(email) {
  const [usuario] = await knex('usuario')
    .where({ email, status: true })
    .select('id', 'nome', 'email', 'senha');

  return usuario;
}

export async function atualizarNome(id, nome) {
  await knex('usuario').where({ id, status: true }).update({ nome });
}

export async function desativar(id) {
  await knex('usuario').where({ id, status: true }).update({ status: false });
}

export async function obterPorEmail(email) {
  const [usuario] = await knex('usuario')
    .where({ email, status: true })
    .select('id', 'nome', 'email', 'foto_perfil');

  return usuario;
}
