import { z } from 'zod';
import { CreateUserSchema } from './create-user.dto';

/**
 * Esquema de atualização do usuário.
 * 
 * Este esquema permite que os campos do `CreateUserSchema` sejam opcionais,
 * garantindo que as regras de validação do esquema original sejam mantidas.
 * No entanto, pelo menos um campo deve ser fornecido na atualização.
 */

export const UpdateUserSchema = CreateUserSchema.partial()
    .refine((data) => Object.keys(data).length > 0, 
        {
            message: 'Pelo menos um campo deve ser informado para atualização'
        }
    );
      
/**
 * Tipo inferido do esquema de atualização do usuário.
 * 
 * Utiliza `z.infer<>` para garantir que o objeto de entrada siga as regras 
 * definidas no `UpdateUserSchema`, permitindo atualizações parciais.
 */
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
