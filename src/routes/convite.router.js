import { Router } from 'express';
import { validarToken, validarAcessoPorConviteId, validarPermissao } from '../middlewares/auth.js';
import { obterDadosPorConviteId } from '../middlewares/entities/convite.middleware.js';
import { validarAcessoPorProjetoIdDeConvite } from '../middlewares/entities/projeto.middleware.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as conviteController from '../controllers/convite.controller.js';

const router = Router();

router.patch(
  '/convite/:conviteId',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorConviteId,
  async (req, res) => {
    const { conviteId } = req.params;

    await conviteController.atualizarConviteStatus({
      conviteIdParam: conviteId,
      requestBody: req.body,
      usuarioId: req.usuario.id,
      statusAtualId: req.conviteStatusAtualId,
    });

    res.sendStatus(204);
  },
);

router.delete(
  '/convite/:conviteId',
  validarToken,
  obterDadosPorConviteId,
  validarAcessoPorProjetoIdDeConvite,
  validarPermissao([1]),
  async (req, res) => {
    const { conviteId } = req.params;

    await conviteController.deletarConvite(conviteId);

    res.sendStatus(204);
  },
);

export default router;
