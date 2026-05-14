import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as linkController from '../controllers/link.controller.js';
import { validarAcessoPorReuniaoId, validarPermissao, validarToken } from '../middlewares/auth.js';

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

export default router;
