export enum CategoryTypeEnum {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export interface Category {
    id: string;
    name: string;
    type: CategoryTypeEnum;
    color: string | null;
    icon: string | null;
    parent_id?: string;
    active: boolean;
}
