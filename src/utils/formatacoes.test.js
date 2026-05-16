import { describe, expect, test } from 'vitest';
import {
  formatarErrosZod,
  transformarUndefinedEmNull,
  transformarUndefinedOuStringVaziaEmNull,
} from './formatacoes.js';
import z from 'zod';

describe('formatarErrosZod', () => {
  const nomeMensagemErro = 'Deve ser uma String';
  const emailMensagemErro = 'Deve ser um e-mail válido';

  const nomeCampo = z.string({ error: nomeMensagemErro });
  const emailCampo = z.email({ error: emailMensagemErro });

  const usuarioSchema = z.object({
    nome: nomeCampo,
    email: emailCampo,
  });

  test('Deve retornar um array de JSON que contenha o campo e a mensagens de erro', () => {
    let zodError;

    try {
      usuarioSchema.parse({ nome: 123, email: 456 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        zodError = error;
      }
    }

    expect(formatarErrosZod(zodError.issues)).toStrictEqual([
      { campo: 'nome', mensagem: nomeMensagemErro },
      { campo: 'email', mensagem: emailMensagemErro },
    ]);
  });

  test('Deve retornar um array com um JSON que contém a mensagem de erro', () => {
    let zodError;

    try {
      nomeCampo.parse(123);
    } catch (error) {
      if (error instanceof z.ZodError) {
        zodError = error;
      }
    }

    expect(formatarErrosZod(zodError.issues)).toEqual([{ mensagem: nomeMensagemErro }]);
  });

  test('Deve retornar um TypeError por passar a classe ZodError em vez das issues dela', () => {
    let zodError;

    try {
      usuarioSchema.parse({ nome: 123, email: 456 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        zodError = error;
      }
    }

    expect(() => formatarErrosZod(zodError)).toThrow(TypeError);
  });
});

describe('transformarUndefinedEmNull', () => {
  test('deve retornar null', () => {
    expect(transformarUndefinedEmNull(undefined)).toBeNull();
    expect(transformarUndefinedEmNull(null)).toBeNull();
  });

  test('Deve retornar o valor sem transformá-lo', () => {
    expect(transformarUndefinedEmNull(345)).toBe(345);
    expect(transformarUndefinedEmNull(-678)).toBe(-678);
    expect(transformarUndefinedEmNull(true)).toBe(true);
    expect(transformarUndefinedEmNull(false)).toBe(false);
    expect(transformarUndefinedEmNull('testando 123')).toBe('testando 123');
    expect(transformarUndefinedEmNull('   testando 456   ')).toBe('   testando 456   ');
  });
});

describe('transformarUndefinedOuStringVaziaEmNull', () => {
  test('Deve retornar null', () => {
    expect(transformarUndefinedOuStringVaziaEmNull(undefined)).toBeNull();
    expect(transformarUndefinedOuStringVaziaEmNull(null)).toBeNull();
    expect(transformarUndefinedOuStringVaziaEmNull('')).toBeNull();
    expect(transformarUndefinedOuStringVaziaEmNull('  ')).toBeNull();
  });

  test('Deve retornar o valor sem transformá-lo', () => {
    expect(transformarUndefinedOuStringVaziaEmNull(345)).toBe(345);
    expect(transformarUndefinedOuStringVaziaEmNull(-678)).toBe(-678);
    expect(transformarUndefinedOuStringVaziaEmNull(true)).toBe(true);
    expect(transformarUndefinedOuStringVaziaEmNull(false)).toBe(false);
    expect(transformarUndefinedOuStringVaziaEmNull('testando 123')).toBe('testando 123');
  });

  test('Deve retornar a String sem espaços vazios no começo e fim', () => {
    expect(transformarUndefinedOuStringVaziaEmNull('testando 123')).toBe('testando 123');
    expect(transformarUndefinedOuStringVaziaEmNull('  testando 456')).toBe('testando 456');
    expect(transformarUndefinedOuStringVaziaEmNull('testando 789    ')).toBe('testando 789');
    expect(transformarUndefinedOuStringVaziaEmNull('    testando 000    ')).toBe('testando 000');
  });
});
