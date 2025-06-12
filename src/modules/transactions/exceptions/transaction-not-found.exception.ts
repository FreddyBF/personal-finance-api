export class TransactionNotFoundException extends Error {
    readonly name: string = 'TransactionNotFoundException';
    constructor(message: string = 'Transaction not found.') {
        super(message);
        Object.setPrototypeOf(this, TransactionNotFoundException.prototype);
    }
}