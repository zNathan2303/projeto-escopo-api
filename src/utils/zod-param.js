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

export const documentoId = z.coerce
  .number({ error: 'O ID de documento deve ser um número' })
  .positive({ error: 'O ID de documento deve ser positivo' });

export const documentoVersaoId = z.coerce
  .number({ error: 'O ID de versão de documento deve ser um número' })
  .positive({ error: 'O ID de versão de documento deve ser positivo' });

export const conviteId = z.coerce
  .number({ error: 'O ID de convite deve ser um número' })
  .positive({ error: 'O ID de convite deve ser positivo' });

export const conviteStatusId = z.coerce
  .number({ error: 'O ID de convite status deve ser um número' })
  .positive({ error: 'O ID de convite status deve ser positivo' });
export const usuarioId = z.coerce
  .number({ error: 'O ID de usuário deve ser um número' })
  .positive({ error: 'O ID de usuário deve ser positivo' });

export const notificacaoId = z.coerce
  .number({ error: 'O ID de notificação deve ser um número' })
  .positive({ error: 'O ID de notificação deve ser positivo' });
