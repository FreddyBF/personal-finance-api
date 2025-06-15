export interface TransactionFilters {
    type?: 'income' | 'expense'; // Exemplo de tipo literal
    category?: string;
    amount?: { $gte?: number; $lte?: number; }; // Range de valores
    date?: { $gte?: Date; $lte?: Date; }; // Range de datas
    // Adicione quaisquer outros campos que possam ser filtrados
}

export interface TransactionPagination {
    page?: number; // Página atual
    limit?: number; // Número de itens por página
    sortBy?: string; // Campo para ordenar
    sortOrder?: 'asc' | 'desc'; // Direção da ordenação
}