
import { z } from 'zod';
import { ObjectId } from 'mongodb';
export const objectIdSchema = z.string().refine(
    (val) => ObjectId.isValid(val),
    {
        message: "ID inválido"
    }
);

export type MongoId = z.infer<typeof objectIdSchema>;

export const IdParamSchema = z.object({
    id: objectIdSchema, // Renamed key to 'id' to be more generic
});

export type IdParamDTO = z.infer<typeof IdParamSchema>; // Renamed DTO type

