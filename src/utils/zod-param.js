import z from 'zod';

export const projetoId = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

export const categoriaId = z.coerce
  .number({ error: 'O ID de categoria deve ser um número' })
  .positive({ error: 'O ID de categoria deve ser positivo' });

export const registroId = z.coerce
  .number({ error: 'O ID de registro deve ser um número' })
  .positive({ error: 'O ID de registro deve ser positivo' });
