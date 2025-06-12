import { ApiError } from "./api.error";

export class UnauthorizedError extends ApiError {
    constructor(message: string = "Unauthorized acess") {
        super(message, 401);
    }
}