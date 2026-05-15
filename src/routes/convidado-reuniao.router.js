import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as convidadoReuniaoController from '../controllers/convidado-reuniao.controller.js';
import {
  validarAcessoPorConvidadoReuniaoId,
  validarAcessoPorReuniaoId,
  validarPermissao,
  validarToken,
} from '../middlewares/auth.js';

const router = Router();

router.post(
  '/reuniao/:reuniaoId/convidado',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId } = req.params;

    await convidadoReuniaoController.criarConvidado({
      requestBody: req.body,
      reuniaoIdParam: reuniaoId,
    });

    res.sendStatus(201);
  },
);

router.put(
  '/reuniao/convidado/:convidadoReuniaoId',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorConvidadoReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { convidadoReuniaoId } = req.params;

    await convidadoReuniaoController.atualizarConvidado({
      requestBody: req.body,
      convidadoIdParam: convidadoReuniaoId,
    });

    res.sendStatus(204);
  },
);

router.delete(
  '/reuniao/convidado/:convidadoReuniaoId',
  validarToken,
  validarAcessoPorConvidadoReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { convidadoReuniaoId } = req.params;

    await convidadoReuniaoController.excluirConvidado(convidadoReuniaoId);

    res.sendStatus(204);
  },
);

export default router;
