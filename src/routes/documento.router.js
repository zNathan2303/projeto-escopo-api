import { Router } from 'express';
import * as documentoController from '../controllers/documento.controller.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import {
  validarToken,
  validarPermissao,
  validarAcessoPorProjetoId,
  validarAcessoPorCategoriaId,
  validarAcessoPorDocumentoId,
  validarAcessoPorDocumentoVersaoId,
} from '../middlewares/auth.js';

const router = Router();

router.get(
  '/projeto/:projetoId/categorias/documentos',
  validarToken,
  validarAcessoPorProjetoId,
  async (req, res) => {
    const { projetoId } = req.params;

    const documentos = await documentoController.obterDocumentosDeCadaCategoria(
      projetoId,
      req.usuario.id,
    );

    res.status(200).json(documentos);
  },
);

router.post(
  '/categoria/:categoriaId/documento',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorCategoriaId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { categoriaId } = req.params;

    const documento = await documentoController.criarDocumento({
      categoriaIdParam: categoriaId,
      requestBody: req.body,
    });

    res.status(201).json(documento);
  },
);

router.get(
  '/documento/:documentoId',
  validarToken,
  validarAcessoPorDocumentoId,
  async (req, res) => {
    const { documentoId } = req.params;

    const documento = await documentoController.obterDetalhesDeDocumento(documentoId);

    res.status(200).json(documento);
  },
);

router.delete(
  '/documento/:documentoId',
  validarToken,
  validarAcessoPorDocumentoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { documentoId } = req.params;

    await documentoController.desativarDocumento(documentoId);

    res.sendStatus(204);
  },
);

router.patch(
  '/documento/:documentoId/titulo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorDocumentoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { documentoId } = req.params;

    await documentoController.atualizarTituloDeDocumento({
      documentoIdParam: documentoId,
      requestBody: req.body,
    });

    res.sendStatus(204);
  },
);

router.post(
  '/documento/:documentoId/conteudo',
  validarToken,
  verificarSeRequestTemBody,
  validarAcessoPorDocumentoId,
  validarPermissao([1, 2]),
  async (req, res) => {
    const { documentoId } = req.params;

    const documento = await documentoController.criarNovaVersao({
      documentoIdParam: documentoId,
      requestBody: req.body,
      usuarioId: req.usuario.id,
    });

    res.status(200).json(documento);
  },
);

router.get(
  '/documento/:documentoId/versoes',
  validarToken,
  validarAcessoPorDocumentoId,
  async (req, res) => {
    const { documentoId } = req.params;

    const historico = await documentoController.obterHistoricoDeVersoes(documentoId);

    res.status(200).json(historico);
  },
);

router.get(
  '/documento/versao/:documentoVersaoId',
  validarToken,
  validarAcessoPorDocumentoVersaoId,
  async (req, res) => {
    const { documentoVersaoId } = req.params;

    const documento = await documentoController.obterVersaoPorId(documentoVersaoId);

    res.status(200).json(documento);
  },
);

export default router;
