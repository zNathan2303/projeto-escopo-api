import * as AZURE from './config-upload-azure.js';

export async function uploadFiles(file) {
  const fileName = Date.now() + file.originalname;

  // URL para enviar para o banco de dados
  const urlFile = `https://${AZURE.ACCOUNT}.blob.core.windows.net/${AZURE.CONTAINER}/${fileName}`;

  // URL para enviar o arquivo para o container da AZURE
  const urlFileToken = `${urlFile}?${AZURE.TOKEN}`;

  const response = await fetch(urlFileToken, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': 'application/octet-stream',
    },
    body: file.buffer,
  });

  if (response.status === 201) {
    return urlFile;
  } else {
    return false;
  }
}
