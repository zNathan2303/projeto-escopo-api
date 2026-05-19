import { Router } from 'express';
import {
  validarToken,
  validarAcessoPorProjetoId,
  validarAcessoPorRegistroId,
  validarPermissao,
} from '../middlewares/auth.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as registroController from '../controllers/registro.controller.js';

const router = Router();

router.get(
  '/projeto/:projetoId/registros',
  validarToken,
  validarAcessoPorProjetoId,
  async (req, res) => {
    const { projetoId } = req.params;

    const registros = await registroController.obterRegistrosPorProjetoId(projetoId);

    res.status(200).json(registros);
  },
);

router.post(
  '/projeto/:projetoId/registro',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorProjetoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { projetoId } = req.params;

    const registro = await registroController.criarRegistro({
      projetoIdParam: projetoId,
      requestBody: req.body,
      usuarioId: req.usuario.id,
    });

    res.status(201).json(registro);
  },
);

router.patch(
  '/registro/:registroId/titulo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorRegistroId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { registroId } = req.params;

    await registroController.atualizarTituloDeRegistro({
      registroIdParam: registroId,
      requestBody: req.body,
    });

    res.sendStatus(204);
  },
);

router.patch(
  '/registro/:registroId/conteudo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorRegistroId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { registroId } = req.params;

    await registroController.atualizarConteudoDeRegistro({
      registroIdParam: registroId,
      requestBody: req.body,
    });

    res.sendStatus(204);
  },
);

router.get('/registro/:registroId', validarToken, validarAcessoPorRegistroId, async (req, res) => {
  const { registroId } = req.params;

  const registro = await registroController.obterDetalhesDeUmRegistro(registroId);

  res.status(200).json(registro);
});

router.delete(
  '/registro/:registroId',
  validarToken,
  validarAcessoPorRegistroId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { registroId } = req.params;

    await registroController.excluirRegistro(registroId);

    res.sendStatus(204);
  },
);

export default router;
