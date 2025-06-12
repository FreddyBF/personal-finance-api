import { Response, Request, NextFunction } from "express";
import { ApiError } from "../shared/errors/api.error";
import { ZodError } from "zod";


export const errorHandler = (
    error: Error, 
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));

        return res.status(400).json({ 
            status: 'error', 
            message: 'validation failed', 
            errors: errors
        });
    }

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }
    console.log('Unhandled error:', error);
    return res.status(500).json({
        status: error,
        message: 'Internal Server Error'
    })
};
