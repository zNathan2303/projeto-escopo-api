import { Router } from 'express';
import { verificarSeRequestTemBody } from '../middlewares/request-body.js';
import { validarToken } from '../middlewares/auth.js';
import * as documentoController from '../controllers/documento.controller.js';

const router = Router();

router.get('/projeto/:projetoId/categorias/documentos', validarToken, async (req, res) => {
  const { projetoId } = req.params;

  const documentos = await documentoController.obterDocumentosDeCadaCategoria(
    projetoId,
    req.usuario,
  );

  res.status(200).json(documentos);
});

export default router;
