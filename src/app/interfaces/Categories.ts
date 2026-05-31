export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
    parent_id?: string;
    active: boolean;
}