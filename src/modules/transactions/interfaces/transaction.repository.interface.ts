import { ITransactionBase, ITransactionModel } from "./transaction.model.interface";
import { TransactionFilters } from "./transaction.filters.interface";
import { ITransactionAggregationResult } from "./transcation.agregate-result.interface";

export interface ITransactionRepository {

    create(
        userId: string, dataTransaction: ITransactionBase
    ): Promise<ITransactionModel>;

    getAll(userId: string): Promise<ITransactionModel[]>;

    getById(
        userId: string, 
        transactionId: string
    ): Promise<ITransactionModel | null>;

    update(
        userId: string,
        transactionId: string,
        dataToUpdate: Partial<ITransactionBase>
    ): Promise<ITransactionModel | null>;

    replace(
        userId: string,
        transactionId: string,
        dataToReplace: ITransactionBase
    ): Promise<ITransactionModel | null>;

    
    delete(
        userId: string, transactionId: string
    ): Promise<ITransactionModel | null>;





    getByFilter(userId: string, filters?: TransactionFilters): Promise<ITransactionModel[]>;

    getSummary(userId: string): Promise<ITransactionAggregationResult>;
}