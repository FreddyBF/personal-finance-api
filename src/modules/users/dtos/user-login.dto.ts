import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string()
        .email("Email inválido")
        .min(1, "O email é obrigatório")
        .trim(),
    
    password: z.string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .trim(),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
