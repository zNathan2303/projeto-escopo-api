import z from 'zod';
import * as usuarioModel from '../models/usuario.model.js';
import NotFoundError from '../errors/NotFoundError.js';
import bcrypt from 'bcrypt';
import BadRequestError from '../errors/BadRequestError.js';
import * as UPLOAD from './upload/controller-upload-azure.js';
import ApiError from '../errors/ApiError.js';

const senha = z
  .string({ error: 'Deve ser uma String' })
  .trim()
  .min(8, { error: 'Mínimo 8 caracteres' })
  .max(64, { error: 'Máximo 64 caracteres' });

const atualizarSenhaSchema = z.object({
  senha_atual: senha,
  senha_nova: senha,
});

const nomeSchema = z.object({
  nome: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
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

export async function atualizarFotoPerfilDoUsuario(usuarioId, foto) {
  if (!foto) {
    throw new BadRequestError('Foto não enviada');
  }

  const urlFoto = await UPLOAD.uploadFiles(foto);

  if (!urlFoto) {
    throw new ApiError('Não foi possível criar a URL da foto');
  }

  await usuarioModel.atualizarFotoPerfil(usuarioId, urlFoto);

  return { url: urlFoto };
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

export async function atualizarSenhaDoUsuario(requestBody, usuarioId, usuarioEmail) {
  const { senha_atual, senha_nova } = atualizarSenhaSchema.parse(requestBody);

  if (senha_atual === senha_nova) {
    throw new BadRequestError('A nova senha deve ser diferente da senha atual');
  }

  const usuario = await usuarioModel.obterComSenhaPorEmail(usuarioEmail);

  const senhaValida = await bcrypt.compare(senha_atual, usuario.senha);
  if (!senhaValida) {
    throw new BadRequestError('Senha atual inválida');
  }

  const senhaHash = await bcrypt.hash(senha_nova, 10);

  await usuarioModel.atualizarSenha({ senha: senhaHash, usuarioId });
}
