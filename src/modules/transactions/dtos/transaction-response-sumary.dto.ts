export interface TransactionSummaryResponseDTO {
    income: number;
    expenses: number; // Ou 'totalExpenses', 'totalExpenditures'
    balance: number;  // Ou 'netBalance', 'currentBalance'
    // Outros campos de resumo, se houver (ex: 'currency', 'period')
}