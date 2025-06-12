

export class ApiError extends Error {
    readonly statusCode: number;
    constructor(message:string, statusCode:number = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
        
    }
}