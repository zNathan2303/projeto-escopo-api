import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as linkController from '../controllers/link.controller.js';
import {
  validarAcessoPorLinkId,
  validarAcessoPorReuniaoId,
  validarPermissao,
  validarToken,
} from '../middlewares/auth.js';

const router = Router();

router.post(
  '/reuniao/:reuniaoId/link',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId } = req.params;

    await linkController.criarLink({ requestBody: req.body, reuniaoIdParam: reuniaoId });

    res.sendStatus(201);
  },
);

router.patch(
  '/reuniao/link/:linkId',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorLinkId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { linkId } = req.params;

    await linkController.atualizarLink({ linkIdParam: linkId, requestBody: req.body });

    res.sendStatus(204);
  },
);

export default router;
