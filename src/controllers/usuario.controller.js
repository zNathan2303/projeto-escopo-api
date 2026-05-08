import z from 'zod';
import * as usuarioModel from '../models/usuario.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import { transformarUndefinedOuStringVaziaEmNull } from '../utils/formatacoes.js';
import bcrypt from 'bcrypt';

const atualizarSenhaSchema = z.object({
  senha: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(8, { error: 'Mínimo 8 caracteres' })
    .max(64, { error: 'Máximo 64 caracteres' }),
});

const nomeSchema = z.object({
  nome: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
});

const fotoPerfilSchema = z.object({
  foto_perfil: z.preprocess(
    transformarUndefinedOuStringVaziaEmNull,
    z
      .string({ error: 'Deve ser uma String' })
      .max(512, { error: 'Máximo 512 caracteres' })
      .nullable(),
  ),
});

const emailCampo = z
  .string({ error: 'Deve ser uma String' })
  .trim()
  .min(6, { error: 'Mínimo 6 caracteres' })
  .max(150, { error: 'Máximo 150 caracteres' })
  .toLowerCase()
  .email({ error: 'Deve ser um e-mail válido' });

export async function atualizarNomeDoUsuario(usuario, requestBody) {
  const { nome } = nomeSchema.parse(requestBody);

  await usuarioModel.atualizarNome(usuario.id, nome);
}

export async function atualizarFotoPerfilDoUsuario(usuario, requestBody) {
  const { foto_perfil } = fotoPerfilSchema.parse(requestBody);

  await usuarioModel.atualizarFotoPerfil(usuario.id, foto_perfil);
}

export async function desativarUsuario(usuario) {
  await usuarioModel.desativar(usuario.id);
}

export async function obter5UsuariosQueEmailContemValor(valor) {
  const usuarios = await usuarioModel.obter5QueEmailContemValor(valor);

  return usuarios;
}

export async function obterUsuarioPorEmail(email) {
  const emailValidado = emailCampo.parse(email);

  const usuario = await usuarioModel.obterPorEmail(emailValidado);

  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return usuario;
}

export async function atualizarSenhaDoUsuario(requestBody, usuarioId) {
  const { senha } = atualizarSenhaSchema.parse(requestBody);

  const senhaHash = await bcrypt.hash(senha, 10);

  await usuarioModel.atualizarSenha({ senha: senhaHash, usuarioId });
}
