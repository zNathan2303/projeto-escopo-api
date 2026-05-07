import { Router } from 'express';
import * as documentoController from '../controllers/documento.controller.js';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken, validarAcesso } from '../middlewares/auth.js';

const router = Router();

router.get('/projeto/:projetoID/categorias/documentos', validarToken, async (req, res) => {
  const { projetoID } = req.params;

  const documentos = await documentoController.obterDocumentosDeCadaCategoria(
    projetoID,
    req.usuario,
  );

  res.status(200).json(documentos);
});

router.post(
  '/projeto/:projetoID/categoria/:categoriaID/documento',
  validarToken,
  verificarSeRequestTemBody,
  validarAcesso,
  async (req, res) => {
    const { categoriaID, projetoID } = req.params;

    await documentoController.criarDocumento(req.body, projetoID, categoriaID, req.usuario.id);

    res.sendStatus(201);
  },
);

export default router;
