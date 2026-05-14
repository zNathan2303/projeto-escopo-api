import { Router } from 'express';
import * as reuniaoController from '../controllers/reuniao.controller.js';
import {
  validarAcessoPorProjetoId,
  validarAcessoPorReuniaoId,
  validarPermissao,
  validarToken,
} from '../middlewares/auth.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';

const router = Router();

router.get(
  '/projeto/:projetoId/reunioes',
  validarToken,
  validarAcessoPorProjetoId,
  async (req, res) => {
    const { projetoId } = req.params;

    const reunioes = await reuniaoController.obterReunioesPorProjetoId(projetoId);

    res.status(200).json(reunioes);
  },
);

router.post(
  '/projeto/:projetoId/reuniao',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorProjetoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { projetoId } = req.params;

    await reuniaoController.criarReuniao({ projetoIdParam: projetoId, requestBody: req.body });

    res.sendStatus(201);
  },
);

router.patch(
  '/reuniao/:reuniaoId/titulo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId } = req.params;

    await reuniaoController.atualizarTitulo({ requestBody: req.body, reuniaoIdParam: reuniaoId });

    res.sendStatus(204);
  },
);

router.patch(
  '/reuniao/:reuniaoId/transcricao',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorReuniaoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { reuniaoId } = req.params;

    await reuniaoController.atualizarTranscricao({
      requestBody: req.body,
      reuniaoIdParam: reuniaoId,
    });

    res.sendStatus(204);
  },
);

export default router;
