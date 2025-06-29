import { NextFunction, Request, Response } from 'express';
import { ITransactionService } from '../interfaces/transaction.service.interface';
import { CreateTransactionDTO } from '../dtos/create-transaction.dto';
import { TransactionResponseDTO } from '../dtos/transaction-response.dto';
import { ServiceException } from '../services/exceptions/transaction.service.exception';
import { UpdateTransactionDTO } from '../dtos/update-transaction.dto';

export class TransactionController {
    constructor(private readonly service: ITransactionService) {};

    async createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            const validatedData: CreateTransactionDTO = req.body;
            const newTransaction: TransactionResponseDTO = await this.service.createTransaction(
                userId as string,
                validatedData
            );
            res.status(201).json(newTransaction);
        } catch (error) {
           next(error);
        }
    }

    async getAllTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId; 
            const listTransaction: TransactionResponseDTO[] = await this.service.getAll(userId as string);
            res.status(200).json(listTransaction);
        } catch (error) {
            next(error);
        }    
    }

    async getTransaction(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            const transactionId  = req.params.id;
            const transaction = await this.service.getTransaction(
                userId as string,transactionId
            );
            res.status(200).json(transaction);
        } catch (error) {
            if(error instanceof ServiceException) {

            }  
        }
    }

    async updateTransaction(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            const userId = req.userId;
            const transactionId  = req.params.id;
            const validatedData: UpdateTransactionDTO = req.body;
            const transaction = await this.service.updateOne(
                userId as string,transactionId, validatedData
            );
            res.status(200).json(transaction);
        } catch (error) {
            if(error instanceof ServiceException) {

            }  
        }
    }

    async deleteTransaction(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            const userId = req.userId;
             if (!userId) {
              throw new Error("User ID not found");
  }
            const transactionId  = req.params.id;
            const transaction = await this.service.deleteOne(
                userId as string,transactionId
            );
            res.status(200).json(transaction);
        } catch (error) {
            if(error instanceof ServiceException) {

            }  
        }
    }

}

