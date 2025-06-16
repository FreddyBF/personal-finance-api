import { ITransactionModel } from "./transaction.model.interface";
import { TransactionFilters } from "./transaction.filters.interface";
import { ITransactionAggregationResult } from "./transcation.agregate-result.interface";

export interface ITransactionRepository {

    getTransactionsByUserId(userId: string): Promise<ITransactionModel[]>;

    create(
        userId: string, dataTransaction: Omit<ITransactionModel, 'userId' | 'createdAt' | 'updatedAt'>
    ): Promise<ITransactionModel>;

    update(
        userId: string,
        transactionId: string,
        dataToUpdate: Partial<Omit<ITransactionModel, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
    ): Promise<ITransactionModel | null>;

    replace(
            userId: string,
            transactionId: string,
            // Recebe um objeto COMPLETO. Todos os campos, exceto _id, userId, timestamps, são esperados.
            // Se um campo obrigatório não for fornecido, o Mongoose validará e lançará um erro.
            dataToReplace: Omit<ITransactionModel, '_id' | 'userId' | 'createdAt' | 'updatedAt'>
        ): Promise<ITransactionModel | null>;

    
    delete(userId: string, transactionId: string): Promise<ITransactionModel | null>;

    getTransactions(userId: string, filters?: TransactionFilters): Promise<ITransactionModel[]>;

    getSummary(userId: string): Promise<ITransactionAggregationResult>;
}