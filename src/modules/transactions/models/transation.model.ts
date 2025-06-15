import mongoose, { Schema } from "mongoose";
import { ITransactionModel } from "../interfaces/transaction.model.interface";
import { TransactionCategory } from "../types/transation.category.type";

// Esquema Mongoose para a transação
export const TransactionSchema = new Schema<ITransactionModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, // Garante que cada transação tenha um utilizador associado
        },
        type: {
            type: String,
            enum: ["income", "expense"], // Define os valores aceitos
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0, // Garante que seja positivo
        },
        title: {
            type: String,
            trim: true, // Remove espaços extras
        },

        category: { 
            type: String, 
            enum: Object.values(TransactionCategory), 
            required: true ,
        },

        date: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // Adiciona automaticamente `createdAt` e `updatedAt`
    }
);

// Criação do modelo Mongoose
export const TransactionModel = mongoose.model<ITransactionModel>("Transaction", TransactionSchema);
