import ApiError from '../../errors/ApiError.js';

export const TOKEN = process.env.AZURE_STORAGE_TOKEN;
export const CONTAINER = process.env.AZURE_STORAGE_CONTAINER;
export const ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;

if (!TOKEN || !CONTAINER || !ACCOUNT) {
  throw new ApiError('Variáveis de ambiente da Azure não definidas');
}
