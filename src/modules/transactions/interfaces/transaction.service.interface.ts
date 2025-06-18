import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { TransactionSummaryResponseDTO } from "../dtos/transaction-response-sumary.dto";
import { TransactionResponseDTO } from "../dtos/transaction-response.dto";
import { UpdateTransactionDTO } from "../dtos/update-transaction.dto";
import { TransactionFilters } from "./transaction.filters.interface";
import { ITransactionBase } from "./transaction.model.interface";

export interface ITransactionService  {

    createTransaction(userId:string, transaction: CreateTransactionDTO): Promise<TransactionResponseDTO>;

    getAll(userId: string): Promise<TransactionResponseDTO[]>;

    getAllByFilters(
        userId: string, filters?:TransactionFilters
    ): Promise<TransactionResponseDTO[]>;

    updateOne(
        userId: string, transactionId: string, transaction: UpdateTransactionDTO
    ): Promise<TransactionResponseDTO>;

    replaceOne(userId: string, idTransaction: string, transaction: CreateTransactionDTO): Promise<TransactionResponseDTO>;

    deleteOne(userId: string, transactionId: string): Promise<TransactionResponseDTO>;

    getFinancialSummary(userId: string): Promise<TransactionSummaryResponseDTO>;
}
