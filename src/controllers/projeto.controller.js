import z from 'zod';
import * as projetoModel from '../models/projeto.model.js';
import * as conviteController from '../controllers/convite.controller.js';

const projetoSchema = z.object({
  titulo: z
    .string('Deve ser uma String')
    .trim()
    .min(1, 'Mínimo 1 caractere')
    .max(100, 'Máximo 100 caracteres'),
  descricao: z.preprocess((e) => {
    if (e === undefined || e === null) {
      return null;
    }

    if (typeof e === 'string') {
      const trimmed = e.trim();
      return trimmed === '' ? null : trimmed;
    }

    return e;
  }, z.string('Deve ser uma String').nullable()),
  integrantes: z.array(
    z.object({
      id: z.number('Deve ser um número'),
      nivel_acesso_id: z.number('Deve ser um número'),
    }),
  ),
});

export async function criarProjeto(requestBody, usuario) {
  const projeto = projetoSchema.parse(requestBody);

  const projetoId = await projetoModel.criar({
    titulo: projeto.titulo,
    descricao: projeto.descricao,
    criador_id: usuario.id,
  });

  for (const integrante of projeto.integrantes) {
    await conviteController.criarConvite({
      destinatario_id: integrante.id,
      nivel_acesso_id: integrante.nivel_acesso_id,
      projeto_id: projetoId,
      remetente_id: usuario.id,
    });
  }

  return { projetoId, ...projeto };
}
