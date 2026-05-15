import * as usuarioConvidadoController from '../controllers/usuario-convidado.controller.js';
import { Router } from 'express';
import {
  validarAcessoPorReuniaoId,
  validarAcessoPorUsuarioReuniaoId,
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

    await usuarioConvidadoController.criarUsuarioConvidado({
      requestBody: req.body,
      reuniaoIdParam: reuniaoId,
    });

    res.sendStatus(201);
  },
);

router.delete(
  '/reuniao/usuario/:usuarioReuniaoId',
  validarToken,
  validarAcessoPorUsuarioReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { usuarioReuniaoId } = req.params;

    await usuarioConvidadoController.excluirUsuarioConvidado(usuarioReuniaoId);

    res.sendStatus(204);
  },
);

export default router;
