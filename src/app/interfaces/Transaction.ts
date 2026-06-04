export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  categoryId?: string | null;
  subcategory: string;
  subcategoryId?: string | null;
  paymentMethod: string;
  paymentMethodId?: string | null;
  date: string;
  type: 'income' | 'expense';
}
