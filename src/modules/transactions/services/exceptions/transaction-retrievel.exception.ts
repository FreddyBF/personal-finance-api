// src/domain/errors/transaction-retrieval-error.ts

/**
 * @class TransactionRetrievalError
 * @extends Error
 * @description Exceção de domínio lançada quando ocorre um erro ao recuperar transações.
 * Encapsula o erro original para fins de depuração, mas apresenta uma
 * mensagem amigável para a camada superior.
 */
export class TransactionRetrievalException extends Error {
    /**
     * O erro subjacente que causou esta exceção (opcional).
     * Útil para logging e depuração.
     */
    public readonly originalError?: Error;
    constructor(message: string, originalError?: Error) {
        // Chama o construtor da classe base (Error)
        super(message);
        // Define o nome da exceção (útil para depuração e identificação)
        this.name = 'TransactionRetrievalError';
        // Captura o stack trace para melhor depuração
        // Isso é importante para ambientes como Node.js
        if (Error.captureStackTrace) 
            Error.captureStackTrace(this, TransactionRetrievalException);
        // Armazena o erro original que causou esta exceção
        this.originalError = originalError;
    }
}