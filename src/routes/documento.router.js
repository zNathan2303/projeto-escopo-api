import { Router } from 'express';
import * as documentoController from '../controllers/documento.controller.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken, validarAcesso, validarPermissao } from '../middlewares/auth.js';

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
  validarPermissao([1, 2]),
  async (req, res) => {
    const { categoriaId, projetoId } = req.params;

    await documentoController.criarDocumento(req.body, projetoId, categoriaId);

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

router.delete(
  '/projeto/:projetoId/categoria/:categoriaId/documento/:documentoId',
  validarToken,
  validarAcesso,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { categoriaId, documentoId, projetoId } = req.params;

    await documentoController.desativarDocumento(documentoId, categoriaId, projetoId);

    res.sendStatus(204);
  },
);

router.patch(
  '/projeto/:projetoId/categoria/:categoriaId/documento/:documentoId/titulo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcesso,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { categoriaId, documentoId, projetoId } = req.params;

    await documentoController.atualizarTituloDeDocumento(
      req.body,
      documentoId,
      categoriaId,
      projetoId,
    );

    res.sendStatus(204);
  },
);

router.post(
  '/projeto/:projetoId/categoria/:categoriaId/documento/:documentoId/conteudo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcesso,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { categoriaId, documentoId, projetoId } = req.params;

    await documentoController.criarNovaVersao(
      req.body,
      documentoId,
      categoriaId,
      projetoId,
      req.usuario.id,
    );

    res.sendStatus(201);
  },
);

router.get(
  '/projeto/:projetoId/categoria/:categoriaId/documento/:documentoId/historico',
  validarToken,
  validarAcesso,
  async (req, res) => {
    const { categoriaId, documentoId, projetoId } = req.params;

    const historico = await documentoController.obterHistoricoDeVersoes(
      documentoId,
      categoriaId,
      projetoId,
    );

    res.status(200).json(historico);
  },
);

export default router;
