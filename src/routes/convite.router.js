import { Router } from 'express';
import { validarToken, validarAcessoPorConviteId } from '../middlewares/auth.js';
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

export default router;
