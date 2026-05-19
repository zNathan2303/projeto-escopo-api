import { afterEach, describe, expect, test, vi } from 'vitest';
import * as usuarioModel from '../models/usuario.model.js';
import { obterUsuarioPorEmail } from './usuario.controller.js';
import NotFoundError from '../errors/NotFoundError.js';
import { ZodError } from 'zod';

vi.mock('../models/usuario.model.js');

afterEach(() => {
  vi.clearAllMocks();
});

describe('obterUsuarioPorEmail', () => {
  const email = 'nathan@email.com';

  const usuarioInfo = {
    id: 1,
    nome: 'Nathan',
    email,
    foto_perfil: 'foto-perfil-url',
  };

  test('Deve retornar um usuário', async () => {
    usuarioModel.obterPorEmail.mockResolvedValue(usuarioInfo);

    const usuario = await obterUsuarioPorEmail(email);

    expect(usuario).toEqual(usuarioInfo);
    expect(usuarioModel.obterPorEmail).toHaveBeenCalledWith(email);
  });

  test('Deve retornar um NotFoundError', async () => {
    usuarioModel.obterPorEmail.mockResolvedValue(undefined);

    await expect(obterUsuarioPorEmail(email)).rejects.toThrow(NotFoundError);
    expect(usuarioModel.obterPorEmail).toHaveBeenCalledWith(email);
  });

  test.each([123, true, null, undefined, '', 'a', 'a@'])(
    'Deve lançar ZodError para email inválido',
    async (emailInvalido) => {
      await expect(obterUsuarioPorEmail(emailInvalido)).rejects.toThrow(ZodError);

      expect(usuarioModel.obterPorEmail).not.toHaveBeenCalled();
    },
  );
});
