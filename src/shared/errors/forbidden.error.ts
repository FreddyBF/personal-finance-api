import { ApiError } from "./api.error";


export class ForbiddenError extends ApiError {
    constructor(message: string = "Forbidden access") {
        super(message, 403);
    }
}