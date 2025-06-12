import { ApiError } from "./api.error";

export class InternalServerError extends ApiError {
    /**
     *
     */
    constructor(message:string = 'internal server error') {
        super(message, 500);
        
    }
}