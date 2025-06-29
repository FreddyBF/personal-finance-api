
export class ServiceException extends Error {
    readonly originalError?: Error; // Para encapsular o erro original (pode ser uma DatabaseException ou outro)
    readonly name: string = 'ServiceException';

    constructor(
        message: string = 'A operação do serviço falhou de forma inesperada.'
        ,originalError?: Error
    ) {
        super(message);
        this.originalError = originalError;
        Object.setPrototypeOf(this, ServiceException.prototype);
    }
}