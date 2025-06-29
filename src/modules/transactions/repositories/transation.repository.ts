import { ITransactionRepository } from "../interfaces/transaction.repository.interface";
import { TransactionModel } from "../models/transation.model";
import { ITransactionBase } from "../interfaces/transaction.model.interface";
import { DatabaseException } from "../../../shared/exceptions/database.exception";
import { TransactionFilters } from "../interfaces/transaction.filters.interface";
import { ITransactionModel } from "../interfaces/transaction.model.interface";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { ITransactionAggregationResult } from "../interfaces/transcation.agregate-result.interface";

export class TransactionRepository implements ITransactionRepository {
    
    async create(
        userId: string, dataTransaction: ITransactionBase
    ): Promise<ITransactionModel> {
        try {
            const user_id = new Types.ObjectId(userId);

            const saved: ITransactionModel = await TransactionModel.create(
                { ...dataTransaction, userId: user_id }
            );
            return saved;
        } catch (error) {
            throw new DatabaseException(
                `Falha ao salvar transação no banco de dados.`, 
                error as Error
            );
        }
    }

    /**
     * Retorna uma lista de todas as transações para um determinado usuário.
     * @param userId O ID do usuário cujas transações serão buscadas.
     * @returns Promise<ITransactionModel[]> Uma promessa que resolve para um array de documentos de transação.
     * Retorna um array vazio se nenhuma transação for encontrada para o userId.
     */
    async getAll(userId: string): Promise<ITransactionModel[]> {
        try {
            const objectIdUserId = new mongoose.Types.ObjectId(userId);
            // O .lean() otimiza a busca, retornando objetos JavaScript puros em vez de documentos Mongoose completos.
            // Isso pode melhorar a performance para operações de leitura.
            const transactions: ITransactionModel[] = await TransactionModel.find(
                { userId: objectIdUserId }
            ).lean();
            return transactions;
        } catch (error) {
            throw new DatabaseException(
                "Failed to retrieve transactions due to a database issue.", 
                error as Error
            );
        }
    }


    async getById(userId: string, transactionId: string): Promise<ITransactionModel | null> {
        try {
            const objectIdUserId = new Types.ObjectId(userId);
            const transaction_id = new Types.ObjectId(transactionId);
            const transaction: ITransactionModel | null = await TransactionModel.findOne(
                { userId: objectIdUserId, transaction_id }
            ).lean();
            return transaction;
        } catch (error) {
            throw new DatabaseException(
                "Failed to retrieve transactions due to a database issue.", 
                error as Error
            );
        }
    }


    // Para PATCH: 'updatePartial' ou simplesmente 'update' é um bom nome,
    // pois a maioria das "atualizações" é parcial.
    async update(
        userId: string,
        transactionId: string,
        dataToUpdate: Partial<ITransactionBase>
    ): Promise<ITransactionModel | null> {
        try {
            const objectIdTransactionId = new Types.ObjectId(transactionId);
            const objectIdUserId = new Types.ObjectId(userId);

            const updatedDocument: ITransactionModel | null = await TransactionModel.findOneAndUpdate(
                { _id: objectIdTransactionId, userId: objectIdUserId },
                { $set: dataToUpdate }, // $set atualiza APENAS os campos presentes em dataToUpdate
                { new: true, runValidators: true }
            );
            return updatedDocument;
        } catch (error) {
            throw new DatabaseException(
                "Error updating transaction in database.", 
                error as Error
            );
        }
    }

    async replace(
        userId: string,
        transactionId: string,
        dataToReplace: ITransactionBase
    ): Promise<ITransactionModel | null> {
        try {
            const objectIdTransactionId = new Types.ObjectId(transactionId);
            const objectIdUserId = new Types.ObjectId(userId);

            // Atenção: replaceOne substitui o documento INTEIRO.
            // O _id e userId do documento NO BANCO DE DADOS são mantidos pelo filtro.
            // Campos NÃO incluídos em `dataToReplace` serão REMOVIDOS do documento.
            // Campos obrigatórios no seu Schema que não estiverem em dataToReplace causarão erro de validação.
            const replacedDocument: ITransactionModel | null = await TransactionModel.findOneAndReplace(
                { _id: objectIdTransactionId, userId: objectIdUserId },
                { ...dataToReplace, userId: objectIdUserId }, // Incluí userId aqui para garantir que ele esteja no documento substituído
                { new: true, runValidators: true } // Retorna o doc atualizado e roda validadores
            );

            return replacedDocument;
        } catch (error) {
            throw new DatabaseException(
                "Error replacing transaction in database.",
                error as Error
            );
        }
    }

    /**
    * Deleta uma transação específica de um usuário.
    * @param userId O ID do usuário proprietário da transação.
         * @param transactionId O ID da transação a ser deletada.
         * @returns Promise<ITransactionModel | null> Uma promessa que resolve para o documento deletado, ou null se não for encontrado.
         * @throws DatabaseException Se ocorrer um erro no banco de dados.
         */
    async delete(userId: string, transactionId: string): Promise<ITransactionModel | null> {
        try {
            const objectIdUserId = new Types.ObjectId(userId);
            const objectIdTransactionId = new Types.ObjectId(transactionId);
    
            // findOneAndDelete encontra um documento pelo filtro e o remove.
            // Retorna o documento removido, ou null se não encontrar.
            const deletedDocument: ITransactionModel | null = await TransactionModel.findOneAndDelete(
                { _id: objectIdTransactionId, userId: objectIdUserId}
            ).lean(); // Usar .lean() também para operações de escrita que retornam o documento
    
            return deletedDocument; // Retorna o documento que foi deletado, ou null
        } catch (error) {
            throw new DatabaseException(
                'Failed to delete transaction due to a database issue.',
                error as Error
            );
        }
    }
    
    
    async getByFilter(userId: string, filters?: TransactionFilters): Promise<ITransactionModel[]> {
        try {
            const objectIdUserId = new Types.ObjectId(userId);

            // Constrói o objeto de consulta com o userId obrigatório e os filtros opcionais.
            const query = {
                userId: objectIdUserId,
                ...filters, // Aplica os filtros recebidos (ex: {type: 'income', date: { $gte: ... }})
            };

            const transactions: ITransactionModel[] = await TransactionModel.find(query).lean();

            return transactions; // Retorna um array de documentos ou um array vazio.
        } catch (error) {
            throw new DatabaseException("Ocorreu um erro inesperado ao processar a requisição de transações.");
        }
    }

    /**
     * Calcula e retorna um resumo financeiro para um usuário (saldo, total de rendas, total de despesas).
     * @param userId O ID do usuário.
     * @returns Promise<{ totalIncome: number; totalExpense: number; balance: number; }> Um promessa que resolve para um objeto de resumo.
     * @throws DatabaseException Se ocorrer um erro no banco de dados.
     */
    
    async getSummary(userId: string): Promise<ITransactionAggregationResult> {
        try {
            const objectIdUserId = new Types.ObjectId(userId);

            // Pipeline de agregação para calcular o resumo.
            const summary = await TransactionModel.aggregate([
                { $match: { userId: objectIdUserId } }, // Filtra as transações pelo usuário
                {
                    $group: {
                        _id: null, // Agrupa todos os documentos em um único grupo
                        totalIncome: {
                            $sum: {
                                $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
                            },
                        },
                        totalExpense: {
                            $sum: {
                                $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0, // Exclui o _id do grupo
                        totalIncome: 1,
                        totalExpense: 1,
                        balance: { $subtract: ['$totalIncome', '$totalExpense'] },
                    },
                },
            ]);

            // Se o usuário não tiver transações, o pipeline de agregação retorna um array vazio.
            // Neste caso, o resumo deve ser zeros.
            if (summary.length === 0) {
                return { totalIncome: 0, totalExpense: 0, balance: 0 };
            }

            return summary[0]; // O resultado da agregação é um array, pegamos o primeiro (e único) elemento
        } catch (error) {
            throw new DatabaseException(
                'Failed to calculate summary due to a database issue.',
                error as Error
            );
        }
    }
    
}