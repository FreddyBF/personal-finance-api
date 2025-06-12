import { ApiError } from "./api.error";

export class NotFoundError extends ApiError {
    constructor(message:string = 'Resource not found') {
        super(message, 400);   
    }
}