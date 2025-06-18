import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { TransactionResponseDTO } from "../dtos/transaction-response.dto";
import { TransactionSummaryResponseDTO } from "../dtos/transaction-response-sumary.dto";
import { UpdateTransactionDTO } from "../dtos/update-transaction.dto";
import { TransactionFilters } from "../interfaces/transaction.filters.interface";
import { ITransactionService } from "../interfaces/transaction.service.interface";
import { ITransactionRepository } from "../interfaces/transaction.repository.interface";
import { ITransactionBase, ITransactionModel } from "../interfaces/transaction.model.interface";
import { DatabaseException } from "../../../shared/exceptions/database.exception";
import { ApiError } from "../../../shared/errors/api.error";
import { TransactionRetrievalException } from "./exceptions/transaction-retrievel.exception";
import { UnknownError } from "./exceptions/unknown-error";
import { TransactionNotFoundException } from "./exceptions/transaction-not-found.exception";
import { ITransactionAggregationResult } from "../interfaces/transcation.agregate-result.interface";



export class TransactionService implements ITransactionService {

    constructor(private readonly repository: ITransactionRepository) {}
    
    async createTransaction(userId: string, transactionDTO: CreateTransactionDTO): Promise<TransactionResponseDTO> {

        try {
            const dataForRepository: ITransactionBase = {
                type: transactionDTO.type,
                amount: transactionDTO.amount,
                title: transactionDTO.title,
                category: transactionDTO.category,
                date: transactionDTO.date instanceof Date ? transactionDTO.date : new Date(transactionDTO.date),
            };

            const createdDocument: ITransactionModel = await this.repository.create(userId, dataForRepository);

            const responseDTO: TransactionResponseDTO = {
                id: (createdDocument._id as string | { toString(): string }).toString(),
                type: createdDocument.type,
                amount: createdDocument.amount,
                title: createdDocument.title,
                category: createdDocument.category,
                // Garante que a `date` no DTO de resposta seja um objeto `Date` ou outro formato desejado pelo cliente.
                date: createdDocument.date instanceof Date ? createdDocument.date : new Date(createdDocument.date),
            };
            return responseDTO;

        } catch (error) {
            if (error instanceof DatabaseException) {
                throw new ApiError(
                    "Falha ao criar a transação devido a um problema no banco de dados. Por favor, tente novamente mais tarde.",
                    500 // Código de status HTTP para erro interno do servidor
                );
            }
            throw new ApiError(
                "Ocorreu um erro interno ao criar a transação. Por favor, tente novamente mais tarde.",
                500
            );
        }
    }


    async getAll(userId: string): Promise<TransactionResponseDTO[]> {
        try {
            const transactionList: ITransactionModel[] = await this.repository.getTransactionsByUserId(userId);

            if (!transactionList || transactionList.length === 0) {
                return [];
            }

            const responseDTOList: TransactionResponseDTO[] = transactionList.map(doc => ({
                id: doc._id as string,
                type: doc.type,
                amount: doc.amount,
                title: doc.title,
                category: doc.category,
                date: doc.date instanceof Date ? doc.date : new Date(doc.date),
            }));
            return responseDTOList;

        } catch (error) {
            if (error instanceof DatabaseException) {
                throw new ApiError(
                    "Falha ao buscar as transações devido a um problema no banco de dados. Por favor, tente novamente mais tarde.",
                    500 // Código de status HTTP para erro interno do servidor
                );
            }

            console.error("[Service Error] Erro inesperado ao buscar transações:", error);
            throw new ApiError(
                "Ocorreu um erro interno ao buscar as transações. Por favor, tente novamente mais tarde.",
                500
            );
        }
    }

    
    async getAllByFilters(
        userId: string, filters?:TransactionFilters
    ): Promise<TransactionResponseDTO[]> {

        try {
            const transactionModelList: ITransactionModel[] = await this.repository.getTransactions(
                userId, filters
            );

            if (!transactionModelList || transactionModelList.length === 0) return [];
            
            const responseDTOList: TransactionResponseDTO [] = transactionModelList.map(doc =>({
                id: doc._id as string,
                type: doc.type,
                amount: doc.amount,
                title: doc.title,
                category: doc.category,
                date: doc.date instanceof Date ? doc.date : new Date(doc.date),
            }));

            return responseDTOList;
        } catch (error) {

            if(error instanceof DatabaseException) {
                console.error(
                `[TransactionService] Erro inesperado ao buscar transações para userId: ${userId}, filters: ${JSON.stringify(filters)}. 
                Erro:`, error
            );
                throw new TransactionRetrievalException(
                    "Não foi possível recuperar as transações devido a um problema interno.",
                    error
                );
            }

            throw new UnknownError(
                "Ocorreu um erro inesperado ao processar a requisição de transações.",
                error instanceof Error ? error : new Error(String(error))
            );
        }
    }
     

    async updateOne(
        userId: string, transactionId: string, transaction: UpdateTransactionDTO
    ): Promise<TransactionResponseDTO> {

        try {
            const transctionToupdate: Partial<ITransactionBase> = {...transaction};

            const updatedTransaction: ITransactionModel | null = await this.repository.update(userId, transactionId, transctionToupdate);

            if(!updatedTransaction) throw new TransactionNotFoundException();

            const response: TransactionResponseDTO = {
                id: updatedTransaction._id  as string,
                type: updatedTransaction.type,
                amount: updatedTransaction.amount,
                title: updatedTransaction.title,
                category: updatedTransaction.category,
                date: updatedTransaction.date instanceof Date ? updatedTransaction.date : new Date(updatedTransaction.date)
            };

            return response;
        } catch (error) {
            if(error instanceof DatabaseException) {
                console.error(
                    `[TransactionService] Erro de banco de dados ao atualizar transação para userId: ${userId}, transactionId: ${transactionId}. Erro:`,
                    error
                );
                throw new TransactionRetrievalException( // Consider renaming this to TransactionUpdateException or similar
                "Não foi possível atualizar a transação devido a um problema interno no banco de dados.",
                 error
                );
            }
            throw new UnknownError('Yhaa');
        }
    }
    
    async replaceOne(userId: string, transactionId: string, transaction: CreateTransactionDTO): Promise<TransactionResponseDTO> {

        try {
            const dataForRepository: ITransactionBase = {
                type: transaction.type,
                amount: transaction.amount,
                title: transaction.title,
                category: transaction.category,
                date: transaction.date instanceof Date ? transaction.date : new Date(transaction.date),
            };

            const createdDocument: ITransactionModel | null = await this.repository.replace(userId, transactionId, dataForRepository);

            if(!createdDocument) throw new TransactionNotFoundException();

            const responseDTO: TransactionResponseDTO = {
                id: (createdDocument._id as string | { toString(): string }).toString(),
                type: createdDocument.type,
                amount: createdDocument.amount,
                title: createdDocument.title,
                category: createdDocument.category,
                date: createdDocument.date instanceof Date ? createdDocument.date : new Date(createdDocument.date),
            };
            return responseDTO;

        } catch (error) {
            if(error instanceof DatabaseException) {
                console.error(
                    `[TransactionService] Erro de banco de dados ao atualizar transação para userId: ${userId}, transactionId: ${transactionId}. Erro:`,
                    error
                );
                throw new TransactionRetrievalException( // Consider renaming this to TransactionUpdateException or similar
                "Não foi possível atualizar a transação devido a um problema interno no banco de dados.",
                 error
                );
            }
            throw new UnknownError('Yhaa');
        }

    }
    

    async deleteOne(userId: string, transactionId: string): Promise<TransactionResponseDTO> {

        try {
            const deletedTransaction:ITransactionModel | null = await this.repository.delete(userId,transactionId);

            if(!deletedTransaction) throw new TransactionNotFoundException();

            const responseDTO: TransactionResponseDTO = {
                id: (deletedTransaction._id as string | { toString(): string }).toString(),
                type: deletedTransaction.type,
                amount: deletedTransaction.amount,
                title: deletedTransaction.title,
                category: deletedTransaction.category,
                date: deletedTransaction.date instanceof Date ? deletedTransaction.date : new Date(deletedTransaction.date),
            };

            return responseDTO;
        } catch (error) {
            if(error instanceof DatabaseException) {
                console.error(
                    `[TransactionService] Erro de banco de dados ao atualizar transação para userId: ${userId}, transactionId: ${transactionId}. Erro:`,
                    error
                );
                throw new TransactionRetrievalException(
                    "Não foi possível atualizar a transação devido a um problema interno no banco de dados.",
                    error
                );
            }
            throw new UnknownError('Yhaa');
        }
    }
    
    async getFinancialSummary(userId: string): Promise<TransactionSummaryResponseDTO> {
        try {
            const dataSummry: ITransactionAggregationResult = await this.repository.getSummary(userId);
            const responseDTO: TransactionSummaryResponseDTO = {
                income: dataSummry.totalIncome,
                expenses: dataSummry.totalExpense,
                balance: dataSummry.balance
            }
            return responseDTO;
        } catch (error) {
            if(error instanceof DatabaseException) {
                console.error(error);
                throw new TransactionRetrievalException('');
            }
            throw new UnknownError();
        }
    }
}