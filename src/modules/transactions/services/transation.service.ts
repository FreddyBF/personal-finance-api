

import TransactionModel from '../models/TransactionModel';
import { CreateTransactionDTO } from '../dto/TransactionDTO';

class TransactionService {
    async createTransaction(userId: string, data: CreateTransactionDTO) {
        if (data.amount <= 0) throw new Error('O valor deve ser positivo.');
        if (new Date(data.date) > new Date()) throw new Error('A data não pode ser futura.');

        const transaction = await TransactionModel.create({ ...data, userId });
        return transaction;
    }

    async updateTransaction(userId: string, transactionId: string, data: Partial<CreateTransactionDTO>) {
        const transaction = await TransactionModel.findById(transactionId);
        if (!transaction || transaction.userId !== userId) throw new Error('Transação não encontrada ou acesso negado.');

        if (data.date && new Date(data.date) > new Date()) throw new Error('A data não pode ser futura.');

        await transaction.updateOne(data);
        return transaction;
    }

    async deleteTransaction(userId: string, transactionId: string) {
        const transaction = await TransactionModel.findById(transactionId);
        if (!transaction || transaction.userId !== userId) throw new Error('Transação não encontrada ou acesso negado.');

        await transaction.deleteOne();
        return { message: 'Transação removida com sucesso.' };
    }

    async getTransactions(userId: string, filters = {}) {
        return await TransactionModel.find({ userId, ...filters }).sort({ date: -1 });
    }

    async getSummary(userId: string) {
        const income = await TransactionModel.aggregate(
            [{ $match: { userId, type: 'income' } }, { $group: { _id: null, total: { $sum: "$amount" } } }
                
            ]);
        const expense = await TransactionModel.aggregate([{ $match: { userId, type: 'expense' } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

        return {
            totalIncome: income[0]?.total || 0,
            totalExpense: expense[0]?.total || 0,
            balance: (income[0]?.total || 0) - (expense[0]?.total || 0)
        };
    }
}

export default new TransactionService();
