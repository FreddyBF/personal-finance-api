export interface TransactionResponseDTO {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    title: string;
    category: string;
    date: string; // Freqüentemente, datas são enviadas como strings ISO para o cliente
}
