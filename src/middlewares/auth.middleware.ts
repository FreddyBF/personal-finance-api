import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedError } from '../shared/errors/unauthorized.error';
import { ForbiddenError } from '../shared/errors/forbidden.error';
import { ApiError } from '../shared/errors/api.error';

dotenv.config();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Token de autenticação não fornecido.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded !== 'object' || !('sub' in decoded)) {
      throw new ForbiddenError('Token inválido ou malformado.');
    }

    req.userId = decoded.sub as string;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      const err = new ForbiddenError('Token inválido ou expirado.');
      res.status(err.statusCode).json({ status: 'error', message: err.message });
      return;
    }

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: 'error', message: error.message });
      return;
    }
    res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
  }
};
