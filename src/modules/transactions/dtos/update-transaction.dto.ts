import { CreateTransactionSchema } from "./create-transaction.dto";
import { TRANSACTION_CATEGORIES_LIST } from "../types/transation.category.type";
import { z } from 'zod';

export const UpdateTransactionSchema = z
  .object({})
  .merge(CreateTransactionSchema.partial())
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser informado para actualização',
  });

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionSchema>;





const BaseUpdateSchema = z.object({
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({
      message: 'O tipo deve ser "income" ou "expense".'
    }),
  }).optional(),

  amount: z.number({
    invalid_type_error: 'O valor deve ser numérico.',
  })
  .positive({ message: 'O valor deve ser positivo.' })
  .optional(),

  title: z.string()
    .trim()
    .min(5, { message: 'O título deve ter no mínimo 5 caracteres.' })
    .max(40, { message: 'O título deve ter no máximo 40 caracteres.' })
    .optional(),

  category: z.enum(TRANSACTION_CATEGORIES_LIST, {
    errorMap: () => ({
      message: 'A categoria fornecida não é válida.'
    }),
  }).optional(),

  date: z.string()
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: 'A data deve estar no formato YYYY-MM-DD.',
    })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Data inválida.',
    })
    .optional(),
});


export const UpdateTransactionSchema2 = BaseUpdateSchema.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'Pelo menos um campo deve ser fornecido para atualização.',
  }
);

export type UpdateTransactionDTO2 = z.infer<typeof UpdateTransactionSchema2>;

