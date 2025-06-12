import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../shared/errors/unauthorized.error';
import { ForbiddenError } from '../shared/errors/forbidden.error';
import { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../shared/errors/api.error';

interface CustomRequest extends Request {
    user?: string | JwtPayload;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    try {
        if (!token) {
            const err = new UnauthorizedError('No token provided');
            return res.status(err.statusCode).json({ message: err.message });
        }
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                const err = new ForbiddenError();
               return res.status(err.statusCode).json({ message: err.message });
            }
            req.user = decoded; // Attach user info to request object
            next();
        });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ 
                status: 'error',
                message: error.message
             });
        }
    }
}