import * as reuniaoUsuarioController from '../controllers/reuniao-usuario.controller.js';
import { Router } from 'express';
import { validarAcessoPorReuniaoId, validarPermissao, validarToken } from '../middlewares/auth.js';
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

    const reuniaoUsuario = await reuniaoUsuarioController.criarRelacaoEmReuniaoUsuario({
      requestBody: req.body,
      reuniaoIdParam: reuniaoId,
    });

    res.status(201).json(reuniaoUsuario);
  },
);

router.delete(
  '/reuniao/:reuniaoId/usuario/:usuarioId',
  validarToken,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId, usuarioId } = req.params;

    await reuniaoUsuarioController.excluirReuniaoUsuario({
      reuniaoIdParam: reuniaoId,
      usuarioIdParam: usuarioId,
    });

    res.sendStatus(204);
  },
);

export default router;
