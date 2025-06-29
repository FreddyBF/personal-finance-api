import { TransactionCategoryType } from "../types/transation.category.type";
import { TransactionType } from "../types/transaction.type";
import mongoose, { Document, ObjectId } from "mongoose";

export interface ITransactionBase { // Ou ITransactionData, ITransactionCore
    type: TransactionType;
    amount: number;
    title: string;
    category: TransactionCategoryType;
    date: Date | string; // Permite Date ou string, dependendo de onde é usado
}

export interface ITransactionModel extends ITransactionBase, Document {
    _id: ObjectId;
    userId?: mongoose.Types.ObjectId; // Identificador único do utilizador associado à transação
}

