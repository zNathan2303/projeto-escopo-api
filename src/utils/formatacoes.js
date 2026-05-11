export function formatarErrosZod(errosZod) {
  return errosZod.map((erro) => ({
    campo: erro.path[0],
    mensagem: erro.message,
  }));
}

export function transformarUndefinedOuStringVaziaEmNull(elemento) {
  if (elemento === undefined || elemento === null) {
    return null;
  }

  if (typeof elemento === 'string') {
    const trimmed = elemento.trim();
    return trimmed === '' ? null : trimmed;
  }

  return elemento;
}

export function transformarUndefinedEmNull(elemento) {
  if (elemento === undefined || elemento === null) {
    return null;
  }

  return elemento;
}
