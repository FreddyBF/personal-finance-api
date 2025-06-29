// src/transactions/exceptions/transaction.exceptions.ts

import { ServiceException } from '../../shared/exceptions/service.exception'; // Sua exceção de serviço base

export class TransactionCreationException extends ServiceException {
    private name: string;
    constructor(message: string = 'Falha ao criar a transação.', rootError?: Error) {
        super(message, rootError);
        this.name = 'TransactionCreationException';
    }
}

export class TransactionRetrievalException extends ServiceException {
    private readonly name;
    constructor(message: string = 'Falha ao recuperar a transação(ões).', rootError?: Error) {
        super(message, rootError);
        this.name = 'TransactionRetrievalException';
    }
}

export class TransactionUpdateException extends ServiceException {
    private readonly name;
    constructor(message: string = 'Falha ao atualizar a transação.', rootError?: Error) {
        super(message, rootError);
        this.name = 'TransactionUpdateException';
    }
}

export class TransactionDeletionException extends ServiceException {
    private readonly name;
    constructor(message: string = 'Falha ao excluir a transação.', rootError?: Error) {
        super(message, rootError);
        this.name = 'TransactionDeletionException';
    }
}