import * as reuniaoUsuarioController from '../controllers/reuniao-usuario.controller.js';
import { Router } from 'express';
import {
  validarAcessoPorReuniaoId,
  validarAcessoPorReuniaoUsuarioId,
  validarPermissao,
  validarToken,
} from '../middlewares/auth.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';

const router = Router();

router.post(
  '/reuniao/:reuniaoId/usuario',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId } = req.params;

    await reuniaoUsuarioController.criarRelacaoEmReuniaoUsuario({
      requestBody: req.body,
      reuniaoIdParam: reuniaoId,
    });

    res.sendStatus(201);
  },
);

router.delete(
  '/reuniao/usuario/:reuniaoUsuarioId',
  validarToken,
  validarAcessoPorReuniaoUsuarioId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoUsuarioId } = req.params;

    await reuniaoUsuarioController.excluirReuniaoUsuario(reuniaoUsuarioId);

    res.sendStatus(204);
  },
);

export default router;
