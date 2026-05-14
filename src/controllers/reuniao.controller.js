import * as reuniaoModel from '../models/reuniao.model.js';
import * as zodParam from '../utils/zod-param.js';

export async function obterReunioesPorProjetoId(projetoIdParam) {
  const projetoId = zodParam.projetoId.parse(projetoIdParam);

  const reunioes = await reuniaoModel.obterPorProjetoId(projetoId);

  return reunioes;
}
