import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { validarToken } from '../middlewares/auth.js';

const router = Router();

router.get('/dashboard', validarToken, async (req, res) => {
  const dadosDashboard = await dashboardController.obterDadosDashboard(req.usuario.id);

  res.status(200).json(dadosDashboard);
});

export default router;
