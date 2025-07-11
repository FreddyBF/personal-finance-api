import { z } from 'zod';
import { TRANSACTION_CATEGORIES_LIST } from '../types/transation.category.type';

export const CreateTransactionSchema = z.object({
    type: z.enum(['income', 'expense'], {
        errorMap: () => ({ message: 'O tipo deve ser "income" ou "expense".' })
    }),

    amount: z.number()
        .positive({ message: 'O valor deve ser positivo.' }),

    title: z.string()
        .trim()
        .min(5, { message: 'O título deve ter no mínimo 5 caracteres.' })
        .max(40, { message: 'O título deve ter no máximo 40 caracteres.' }),

    category: z.enum(TRANSACTION_CATEGORIES_LIST, { // Use a constante aqui
        errorMap: () => ({
            message: 'A categoria é obrigatória e deve ser uma das opções disponíveis.'
        })
    }),

    date: z.string()
    .transform((val) => new Date(val)) // Converte para Date
    .refine((date) => !isNaN(date.getTime()), { message: 'Data inválida.' }),
});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>;
