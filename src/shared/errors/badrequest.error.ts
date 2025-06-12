import { ApiError } from "./api.error";


export class BadRequestError extends ApiError {
    /**
     *
     */
    constructor(message:string = 'Bad request') {
        super(message);
    }
}