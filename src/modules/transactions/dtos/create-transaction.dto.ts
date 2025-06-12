import { z } from 'zod';

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

    category: z.enum([
        "Alimentação",
        "Transporte",
        "Lazer",
        "Saúde",
        "Educação",
        "Investimentos",
        "Moradia",
        "Salário",
        "Outros"
    ], {
        errorMap: () => ({ 
            message: 'A categoria é obrigatória e deve ser uma das opções disponíveis.' 
        })
    }),

    date: z.string()
    .transform((val) => new Date(val)) // Converte para Date
    .refine((date) => !isNaN(date.getTime()), { message: 'Data inválida.' }),

    date: z.string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), { message: 'Data inválida.' })
    .refine((date) => date.getFullYear() < 2025, { message: 'A data não pode ser a partir de 2025.' }) // Exemplo: Valida o ano
    .refine((date) => date.getMonth() === 0, { message: 'A data deve ser de Janeiro.' }) // Exemplo: Valida o mês (0-11)
    .refine((date) => date.getDate() >= 1 && date.getDate() <= 31, { message: 'Dia inválido.' }) // Exemplo: Valida o dia
    // Ou para garantir que não é uma data futura:
    .refine((date) => date <= new Date(), { message: 'A data não pode ser no futuro.' })
});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>;
