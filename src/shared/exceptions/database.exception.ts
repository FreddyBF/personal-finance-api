
export class DatabaseException extends Error {
    readonly originalError?: Error; // Para encapsular o erro original do driver do BD
    readonly name: string = 'DatabaseException';
    constructor(message: string = 'A database operation failed.', originalError?: Error) {
        super(message);
        this.originalError = originalError;
        Object.setPrototypeOf(this, DatabaseException.prototype);
    }
}