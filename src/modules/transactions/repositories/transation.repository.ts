import { ITransactionRepository } from "../interfaces/transaction.repository.interface";
import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { UpdateTransactionDTO } from "../dtos/update-transaction.dto";
import { TransactionResponseDTO } from "../dtos/transaction-response.dto";
import { Transaction } from "../models/transation.model";
import { ApiError } from "../../../shared/errors/api.error";
import { NotFoundError } from "../../../shared/errors/notfound.error";
import { DatabaseException } from "../../../shared/exceptions/database.exception";
import { TransactionNotFoundException } from "../exceptions/transaction-not-found.exception";


export class TransactionRepository implements ITransactionRepository {

    async createTransaction(
        userId: string, dataTransaction: CreateTransactionDTO
    ): Promise<TransactionResponseDTO> {
        try {
            const saved = await Transaction.create({ ...dataTransaction, userId });;
            const parsedDate = saved.date instanceof Date ? saved.date : new Date(saved.date);

            return {
                id: saved._id.toString(),
                type: saved.type,
                amount: saved.amount,
                title: saved.title,
                category: saved.category,
                date: parsedDate, // Garantir que é sempre Date
            };
        } catch (error) {
            throw new ApiError("Failed to create transaction", 500);
        }
    }


    async updateTransaction(
        userId: string, transactionId: string, dataTransaction: UpdateTransactionDTO
    ): Promise<TransactionResponseDTO> {
        try {
            const updatedTransaction = await Transaction.findOneAndUpdate(
                { _id: transactionId, userId },
                { $set: dataTransaction },
                { new: true, runValidators: true }
            );

            if (!updatedTransaction) 
                throw new NotFoundError('Transaction not found'); // Lança exceção de domínio

            //const parsedDate = updatedTransaction.date instanceof Date ? updatedTransaction.date : new Date(updatedTransaction.date);
            const parsedDate2 = new Date(updatedTransaction.date);
            return {
                id: updatedTransaction._id.toString(),
                type: updatedTransaction.type,
                amount: updatedTransaction.amount,
                title: updatedTransaction.title,
                category: updatedTransaction.category,
                // Remova a formatação de data aqui!
                date: parsedDate2, // Retorne o objeto Date
            };
        } catch (error) { 
            throw new ApiError(
                'Failed to update transaction due to an internal server error. Please try again later.', 500
            );
        }
    }

    /**
     * Deletes a transaction for a specific user.
     * Throws TransactionNotFoundException if the transaction is not found or doesn't belong to the user.
     * Throws DatabaseException for any underlying database errors.
     *
     * @param userId The ID of the user performing the deletion.
     * @param transactionId The ID of the transaction to delete.
     */
    async deleteTransaction(userId: string, transactionId: string): Promise<void> {
        try {
            const deletedTransaction = await Transaction.findOneAndDelete({
                _id: transactionId,
                userId: userId,
            });
            if (!deletedTransaction) 
                throw new TransactionNotFoundException();
        } catch (error) {
            throw new DatabaseException();
        }
    }
        
    async getTransactions(userId: string, filters: any): Promise<TransactionResponseDTO[]> {

    }


    async getSummary(userId: string):Promise<void> {

    }
}