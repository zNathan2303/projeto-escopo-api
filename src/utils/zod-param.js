import z from 'zod';

export const projetoID = z.coerce
  .number({ error: 'O ID de projeto deve ser um número' })
  .positive({ error: 'O ID de projeto deve ser positivo' });

export const categoriaID = z.coerce
  .number({ error: 'O ID de categoria deve ser um número' })
  .positive({ error: 'O ID de categoria deve ser positivo' });

export const registroID = z.coerce
  .number({ error: 'O ID de registro deve ser um número' })
  .positive({ error: 'O ID de registro deve ser positivo' });
