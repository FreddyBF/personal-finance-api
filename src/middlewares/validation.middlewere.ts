import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

type SourceType = 'body' | 'params' | 'query' | 'headers';

export const validate = (schema: ZodTypeAny, source: SourceType = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
        const formattedErrors = result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));
        res.status(400).json({
        message: 'Dados de entrada inválidos.',
        errors: formattedErrors
      });
      return;
    }
    next();
  };
