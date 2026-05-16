import NotFoundError from '../../errors/NotFoundError.js';
import * as zodParam from '../../utils/zod-param.js';
import * as conviteModel from '../../models/convite.model.js';

export async function obterDadosPorConviteId(req, res, next) {
  const conviteId = zodParam.conviteId.parse(req.params.conviteId);

  const convite = await conviteModel.obterPorConviteId(conviteId);

  if (!convite) {
    throw new NotFoundError('Não foi encontrado o convite com o ID informado');
  }

  req.convite = convite;

  next();
}
