import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { TransactionResponseDTO } from "../dtos/transaction-response.dto";
import { TransactionSummaryResponseDTO } from "../dtos/transaction-response-sumary.dto";
import { UpdateTransactionDTO } from "../dtos/update-transaction.dto";
import { TransactionFilters } from "../interfaces/transaction.filters.interface";
import { ITransactionService } from "../interfaces/transaction.service.interface";
import { ITransactionRepository } from "../interfaces/transaction.repository.interface";
import { ITransactionBase, ITransactionModel } from "../interfaces/transaction.model.interface";
import { DatabaseException } from "../../../shared/exceptions/database.exception";
import { TransactionRetrievalException } from "./exceptions/transaction-retrievel.exception";
import { UnknownError } from "./exceptions/unknown-error";
import { TransactionNotFoundException } from "./exceptions/transaction-not-found.exception";
import { ITransactionAggregationResult } from "../interfaces/transcation.agregate-result.interface";
import { ServiceException } from "./exceptions/transaction.service.exception";

export class TransactionService implements ITransactionService {

    constructor(private readonly repository: ITransactionRepository) {}
    
    async createTransaction(
        userId: string, transactionDTO: CreateTransactionDTO
    ): Promise<TransactionResponseDTO> {
        try {
            const dataModel: ITransactionBase = {
                type: transactionDTO.type,
                amount: transactionDTO.amount,
                title: transactionDTO.title,
                category: transactionDTO.category,
                date: transactionDTO.date instanceof Date ? transactionDTO.date : new Date(transactionDTO.date),
            };

            const createdDocument: ITransactionModel = await this.repository.create(
                userId, dataModel
            );
            const responseDTO: TransactionResponseDTO = this.toResponseDTO(createdDocument);
            return responseDTO;

        } catch (error) {
            if (error instanceof DatabaseException) {
                throw new ServiceException(
                    `Falha ao criar a transação`, error
                );
            }
            throw new UnknownError(
                "Ocorreu um erro interno ao criar a transação. Por favor, tente novamente mais tarde.",
            );
        }
    }
    
    async getTransaction(userId: string, transactionId: string): Promise<TransactionResponseDTO> {
        try {
            const transaction: ITransactionModel | null = await this.repository.getById(userId, transactionId);

            if(!transaction) throw new TransactionNotFoundException('Transação não encontrada.');
            const response: TransactionResponseDTO = {
                id: transaction._id.toString(),
                title: transaction.title,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                date: transaction.date as Date,
            }
            return response;
        } catch (error) {
            if (error instanceof TransactionNotFoundException) { // Exceção de negócio específica, só re-lança
                throw error;
            }
            if(error instanceof DatabaseException) {
                console.error(error);
                throw new ServiceException();
            }
            throw new UnknownError('Ocorreu um erro inesperado ao tentar obter a transação.');
        }
    }

    async getAll(userId: string): Promise<TransactionResponseDTO[]> {
        try {
            const transactionList: ITransactionModel[] = await this.repository.getAll(userId);

            if (!transactionList || transactionList.length === 0) {
                return [];
            }
            const responseDTOList: TransactionResponseDTO[] = this.mapToDTO(transactionList);
            return responseDTOList;

        } catch (error) {
            if (error instanceof DatabaseException) {
                throw new DatabaseException(); // Código de status HTTP para erro interno do servidor
            }

            console.error("[Service Error] Erro inesperado ao buscar transações:", error);
            throw new ServiceException(
                "Ocorreu um erro interno ao buscar as transações. Por favor, tente novamente mais tarde.",
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
                id: updatedTransaction._id.toString(),
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
            const dataModel: ITransactionBase = {
                type: transaction.type,
                amount: transaction.amount,
                title: transaction.title,
                category: transaction.category,
                date: transaction.date instanceof Date ? transaction.date : new Date(transaction.date),
            };

            const createdDocument: ITransactionModel | null = await this.repository.replace(userId, transactionId, dataModel);

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

    async getAllByFilters(
        userId: string, filters?:TransactionFilters
    ): Promise<TransactionResponseDTO[]> {

        try {
            const transactionModelList: ITransactionModel[] = await this.repository.getByFilter(
                userId, filters
            );

            if (!transactionModelList || transactionModelList.length === 0) return [];
            
            const responseDTOList: TransactionResponseDTO [] = this.mapToDTO(transactionModelList)
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

    async getByIncome(userId: string): Promise<TransactionResponseDTO[]> {
        try {
            const transactions = await this.repository.getByFilter(userId, { type: "income" });
            return transactions.length ? this.mapToDTO(transactions) : [];
        } catch (error) {
            if(error instanceof DatabaseException) {
                console.error(error);
                throw new TransactionRetrievalException("Erro ao buscar transações de receita.");
            }
            throw new UnknownError();
        }  
    }

    async getByExpense(userId: string): Promise<TransactionResponseDTO[]> {
        try {
            const transactions = await this.repository.getByFilter(userId, { type: "expense" });
            return transactions.length ? this.mapToDTO(transactions) : [];
        } catch (error) {
            if(error instanceof DatabaseException) {
                throw new TransactionRetrievalException(
                    "Erro ao buscar transações de despesa."
                );
            }
            throw new UnknownError();
        }
    }

    //Método auxiliar para mapear os resultados para DTOs
    private mapToDTO(transactionModelList: ITransactionModel[]): TransactionResponseDTO[] {
        return transactionModelList.map(doc => ({
            id: doc._id.toString(),
            type: doc.type,
            amount: doc.amount,
            title: doc.title,
            category: doc.category,
            date: new Date(doc.date),
        }));
    }

    private toResponseDTO(model: ITransactionModel): TransactionResponseDTO {
        return this.mapToDTO([model])[0];
    }

    private parseDate(date: any): Date {
        return date instanceof Date ? date : new Date(date);
    }

}