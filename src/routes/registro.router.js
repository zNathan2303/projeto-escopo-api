import { Router } from 'express';
import { validarToken } from '../middlewares/auth.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import * as registroController from '../controllers/registro.controller.js';

const router = Router();

router.get('/projeto/:projetoId/registros', validarToken, async (req, res) => {
  const { projetoId } = req.params;

  const registros = await registroController.obterRegistrosDeUmProjeto(projetoId, req.usuario);

  res.status(200).json(registros);
});

router.post(
  '/projeto/:projetoId/registro',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { projetoId } = req.params;

    await registroController.criarRegistro(req.body, projetoId, req.usuario);

    res.sendStatus(201);
  },
);

router.patch(
  '/projeto/:projetoId/registro/:registroId/titulo',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { projetoId, registroId } = req.params;

    await registroController.atualizarTituloDeRegistro(
      req.body,
      projetoId,
      registroId,
      req.usuario,
    );

    res.sendStatus(204);
  },
);

router.patch(
  '/projeto/:projetoId/registro/:registroId/conteudo',
  validarToken,
  verificarSeRequestTemBody,
  async (req, res) => {
    const { projetoId, registroId } = req.params;

    await registroController.atualizarTituloDeRegistro(
      req.body,
      projetoId,
      registroId,
      req.usuario,
    );

    res.sendStatus(204);
  },
);

export default router;
