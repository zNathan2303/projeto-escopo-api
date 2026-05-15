import * as usuarioConvidadoController from '../controllers/usuario-convidado.controller.js';
import { Router } from 'express';
import { validarAcessoPorReuniaoId, validarPermissao, validarToken } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/reuniao/:reuniaoId/usuario',
  validarToken,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId } = req.params;

    await usuarioConvidadoController.criarUsuarioConvidado({
      requestBody: req.body,
      reuniaoIdParam: reuniaoId,
    });

    res.sendStatus(201);
  },
);

export default router;
