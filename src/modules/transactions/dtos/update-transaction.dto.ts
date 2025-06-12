import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from 'zod';

export const UpdateTransactionSchema = CreateTransactionSchema.partial()
    .refine(data => Object.keys(data).length > 0, {
        message: 'Pelo menos um campo deve ser informado para atualização'
    });

/**
 * Tipo inferido do esquema de atualização do usuário.
 * 
 * Utiliza `z.infer<>` para garantir que o objeto de entrada siga as regras 
 * definidas no `UpdateTrasactionSchema`, permitindo atualizações parciais.
 */

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionSchema>;
