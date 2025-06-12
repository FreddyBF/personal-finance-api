import { TransactionCategory } from "../types/transation.category.type";
import { TransactionType } from "../types/transaction.type";
import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
    //id: string; // Identificador único da transação
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId; // Identificador único do utilizador associado à transação
    type: TransactionType; // Tipo da transação: renda ou despesa
    amount: number; // Valor da transação (positivo)
    title: string; 
    category: TransactionCategory; // Categoria associada à transação
    date: Date | string; // Permite tanto Date quanto ISO string
}

