import { z } from 'zod';

/**
 * Esquema de validação para criação de usuário.
 * Define as regras de validação para cada campo necessário.
 */

export const CreateUserSchema = z.object({
    /**
     * O nome do usuário.
     * - Deve ter no mínimo 4 caracteres.
     * - Deve ter no máximo 50 caracteres.
     * - Remove espaços extras antes e depois.
     */
    name: z.string()
        .min(4, 'O nome deve ter no mínimo 4 caracteres')
        .max(50, 'O nome deve ter no máximo 50 caracteres')
        .trim(),

    /**
     * O email do usuário.
     * - Deve ser um email válido.
     * - Não pode estar vazio.
     * - Remove espaços extras antes e depois.
     */
    email: z.string()
        .email('Email com formato inválido')
        .min(1, 'O email é obrigatório')
        .trim(),

    /**
     * A senha do usuário.
     * - Deve ter pelo menos 6 caracteres.
     * - Remove espaços extras antes e depois para evitar problemas na autenticação.
     */
    password: z.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .trim(),
});

/**
 * Tipo inferido do esquema de criação de usuário.
 * Pode ser utilizado para garantir que os dados sigam as regras definidas no esquema.
 */
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
