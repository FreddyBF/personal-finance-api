export class UserAlreadyExistsException extends Error {
    public readonly name: string = 'UserAlreadyExistsException';
    constructor(message: string = 'Utilizador com este email já existe.') {
        super(message);
        Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
    }
}