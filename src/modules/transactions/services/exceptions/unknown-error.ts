// src/common/errors/unknown-error.ts

/**
 * @class UnknownError
 * @extends Error
 * @description Exceção genérica para erros inesperados e não classificados.
 * Deve ser usada como um fallback quando um erro não corresponde a nenhuma exceção conhecida.
 */
export class UnknownError extends Error {
    /**
     * O erro subjacente original que causou esta exceção (opcional).
     * Essencial para logging e depuração, fornecendo contexto sobre a causa raiz.
     */
    public readonly originalError?: Error;

    constructor(message: string = "Ocorreu um erro inesperado.", originalError?: Error) {
        // Chama o construtor da classe base (Error)
        super(message);

        // Define o nome da exceção
        this.name = 'UnknownError';

        // Captura o stack trace para melhor depuração
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnknownError);
        }

        // Armazena o erro original
        this.originalError = originalError;
    }
}