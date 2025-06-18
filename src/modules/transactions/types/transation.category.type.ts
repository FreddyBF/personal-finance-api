
export const TRANSACTION_CATEGORIES_LIST = [
    "Alimentação",
    "Transporte",
    "Lazer",
    "Saúde",
    "Educação",
    "Investimentos",
    "Moradia",
    "Salário",
    "Outros"
] as const; // O 'as const' é crucial para inferir um tupla de strings literais.

export type TransactionCategoryType = typeof TRANSACTION_CATEGORIES_LIST[number];