
export class UserAlreadyExistsException extends Error {
    public readonly name: string = 'UserAlreadyExistsException';
    constructor(message: string = 'User with this email already exists.') {
        super(message);
        Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
    }
}