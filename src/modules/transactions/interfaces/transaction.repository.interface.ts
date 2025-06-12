import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { UpdateTransactionDTO } from "../dtos/update-transaction.dto";
import { TransactionResponseDTO } from "../dtos/transaction-response.dto";
import { ITransaction } from "./transaction.model.interface";

export interface ITransactionRepository {
    createTransaction(userId: string, data: CreateTransactionDTO): Promise<TransactionResponseDTO>;
    updateTransaction(
        userId: string, transactionId: string, data: UpdateTransactionDTO
    ): Promise<TransactionResponseDTO>;
    
    deleteTransaction(userId: string, transactionId: string): Promise<void>;
    
    getTransactions(userId: string, filters: any): Promise<TransactionResponseDTO[]>;
    getSummary(userId: string):Promise<void>;
}