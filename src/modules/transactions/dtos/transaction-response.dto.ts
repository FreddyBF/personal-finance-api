import { z } from 'zod';
import mongoose from 'mongoose';
import { CreateTransactionSchema } from './create-transaction.dto';

export const TransactionResponseSchema = z.object({
    id: z.string(),

    type: CreateTransactionSchema.shape.type,

    amount: CreateTransactionSchema.shape.amount,

    title: CreateTransactionSchema.shape.title,

    category: CreateTransactionSchema.shape.category,
    
    date: CreateTransactionSchema.shape.date,
}).strict();

export type TransactionResponseDTO = z.infer<typeof TransactionResponseSchema>;
