import { Router } from 'express';
import * as documentoController from '../controllers/documento.controller.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken, validarAcesso } from '../middlewares/auth.js';

const router = Router();

router.get('/projeto/:projetoId/categorias/documentos', validarToken, async (req, res) => {
  const { projetoId } = req.params;

  const documentos = await documentoController.obterDocumentosDeCadaCategoria(
    projetoId,
    req.usuario.id,
  );

  res.status(200).json(documentos);
});

router.post(
  '/projeto/:projetoId/categoria/:categoriaId/documento',
  validarToken,
  verificarSeRequestTemBody,
  validarAcesso,
  async (req, res) => {
    const { categoriaId, projetoId } = req.params;

    await documentoController.criarDocumento(req.body, projetoId, categoriaId, req.usuario.id);

    res.sendStatus(201);
  },
);

router.get(
  '/projeto/:projetoId/categoria/:categoriaId/documento/:documentoId',
  validarToken,
  validarAcesso,
  async (req, res) => {
    const { categoriaId, documentoId, projetoId } = req.params;

    const documento = await documentoController.obterDetalhesDeDocumento(
      documentoId,
      categoriaId,
      projetoId,
    );

    res.status(200).json(documento);
  },
);

export default router;
