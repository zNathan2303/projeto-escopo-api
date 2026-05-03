import * as z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuario.model.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import ConflictError from '../errors/ConflictError.js';

const campoEmail = z
  .string({ error: 'Deve ser uma String' })
  .trim()
  .min(6, { error: 'Mínimo 6 caracteres' })
  .max(150, { error: 'Máximo 150 caracteres' })
  .toLowerCase()
  .email({ error: 'Deve ser um e-mail válido' });

const campoSenha = z
  .string({ error: 'Deve ser uma String' })
  .trim()
  .min(8, { error: 'Mínimo 8 caracteres' })
  .max(64, { error: 'Máximo 64 caracteres' });

const cadastroSchema = z.object({
  nome: z
    .string({ error: 'Deve ser uma String' })
    .trim()
    .min(1, { error: 'Mínimo 1 caractere' })
    .max(100, { error: 'Máximo 100 caracteres' }),
  email: campoEmail,
  senha: campoSenha,
});

const loginSchema = z.object({
  email: campoEmail,
  senha: campoSenha,
});

export async function cadastrarUsuario(cadastroBody) {
  const { email, nome, senha } = cadastroSchema.parse(cadastroBody);

  const salt = 10;
  const senhaHash = await bcrypt.hash(senha, salt);

  try {
    const id = await usuarioModel.cadastrar({ email, nome, senha: senhaHash });

    return { id, nome, email };
  } catch (error) {
    if (error.sqlState === '45000') {
      throw new ConflictError('Não é possível utilizar o e-mail informado para cadastro');
    }

    throw error;
  }
}

export async function logarUsuario(loginBody) {
  const { email, senha } = loginSchema.parse(loginBody);

  const usuario = await usuarioModel.obterComSenhaPorEmail(email);
  if (!usuario) {
    throw new UnauthorizedError('E-mail ou senha incorretos');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw new UnauthorizedError('E-mail ou senha incorretos');
  }

  const payload = {
    id: usuario.id,
    email: usuario.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  };
}
