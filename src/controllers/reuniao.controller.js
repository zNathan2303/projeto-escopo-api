import z from 'zod';
import * as reuniaoModel from '../models/reuniao.model.js';
import * as zodParam from '../utils/zod-param.js';
import ApiError from '../errors/ApiError.js';

const tituloReuniaoCampo = z
  .string({ error: 'Deve ser uma String' })
  .min(1, { error: 'Mínimo 1 caractere' })
  .max(150, { error: 'Máximo 150 caracteres' });

const transcricaoReuniaoCampo = z
  .string({ error: 'Deve ser uma String' })
  .min(1, { error: 'Mínimo 1 caractere' })
  .max(10000, { error: 'Máximo 10000 caracteres' });

const criarReuniaoSchema = z.object({
  titulo: tituloReuniaoCampo,
});

const atualizarTituloReuniaoSchema = z.object({
  titulo: tituloReuniaoCampo,
});

const atualizarTranscricaoReuniaoSchema = z.object({
  transcricao: transcricaoReuniaoCampo,
});

export async function obterReunioesPorProjetoId(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const reunioes = await reuniaoModel.obterPorProjetoId(projetoId);

  return reunioes;
}

export async function criarReuniao({ requestBody, projetoIdParam }) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);
  const { titulo } = criarReuniaoSchema.parse(requestBody);

  const resultadoBanco = await reuniaoModel.criar({ projetoId, titulo });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível criar a reunião');
  }
}

export async function atualizarTitulo({ requestBody, reuniaoIdParam }) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);
  const { titulo } = atualizarTituloReuniaoSchema.parse(requestBody);

  const resultadoBanco = await reuniaoModel.atualizarTitulo({ reuniaoId, titulo });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar o título da reunião');
  }
}

export async function atualizarTranscricao({ requestBody, reuniaoIdParam }) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);
  const { transcricao } = atualizarTranscricaoReuniaoSchema.parse(requestBody);

  const resultadoBanco = await reuniaoModel.atualizarTranscricao({ reuniaoId, transcricao });

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível atualizar a transcrição da reunião');
  }
}

export async function obterDetalhesPorId(reuniaoIdParam) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);

  const reuniao = await reuniaoModel.obterDetalhesPorId(reuniaoId);

  return reuniao;
}

export async function excluirReuniao(reuniaoIdParam) {
  const reuniaoId = zodParam.reuniaoId.parse(reuniaoIdParam);

  const resultadoBanco = await reuniaoModel.excluir(reuniaoId);

  if (resultadoBanco.affectedRows === 0) {
    throw new ApiError('Não foi possível excluir a reunião');
  }
}
