export interface TransactionResponseDTO {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    title: string;
    category: string;
    date: Date; 
}
