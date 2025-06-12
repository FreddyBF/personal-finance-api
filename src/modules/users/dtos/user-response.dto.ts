import { z } from 'zod';

export const UserResponseSchema = z.object({
    name: z.string()
    .min(4, 'O nome deve ter no mínimo 4 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .trim(),

    email: z.string()
    .email('Email com formato inválido')
    .min(1, 'O email é obrigatório')
    .trim(),
});

export type UserResponseDTO = z.infer<typeof UserResponseSchema>;