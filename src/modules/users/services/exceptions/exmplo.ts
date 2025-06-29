export class ServiceException extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = new.target.name; // Dinâmico: define como "UserAlreadyExistsException"
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserAlreadyExistsException extends ServiceException {
  constructor() {
    super("Já existe um usuário com este e-mail.");
  }
}


melhorias // Exemplo de padronização:
throw new TransactionUpdateException(
  "Falha na atualização", 
  error,
  { userId, transactionId } // metadata
);