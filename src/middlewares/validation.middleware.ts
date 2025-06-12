import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../shared/errors/api.error";

export const validateRequestBody = ( schema: AnyZodObject ) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body); //Caso de erro, o ZodError será lançado
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return next(error); 
        }
        next(new ApiError('Validation middleware internal error', 500));
    }
};


export const validarRequestId = ( schema: AnyZodObject, req: Request, res: Response, next: NextFunction ) => {
    try {
        schema.parse(req.params.id); // Valida o ID usando o esquema fornecido
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return next(error);
        }
        next(new ApiError('Validation middleware internal error', 500));
    }
};