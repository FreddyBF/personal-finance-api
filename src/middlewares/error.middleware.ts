import { Response, Request, NextFunction } from "express";
import { ApiError } from "../shared/errors/api.error"; // Sua classe ApiError
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction // Mantido por conveniência, mas geralmente não é chamado no final
) => {
    // --- 3. Tratamento de ApiError ---
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

    // --- 4. Tratamento de Erros Não Capturados / Inesperados ---
    console.log('Erro não tratado:', error); // Melhorar para console.error em produção
    return res.status(500).json({
        status: 'error', // Corrigido de 'error' para a string 'error'
        message: 'Ocorreu um erro interno do servidor.' // Mensagem genérica e segura
    });
};
