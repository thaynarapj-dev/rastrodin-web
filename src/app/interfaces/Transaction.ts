import { PaymentMethodTypeEnum } from './PaymentMethods';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  categoryId?: string | null;
  categoryIcon?: string | null;
  categoryColor?: string | null;
  subcategory: string;
  subcategoryId?: string | null;
  subcategoryIcon?: string | null;
  subcategoryColor?: string | null;
  paymentMethod: string;
  paymentMethodId?: string | null;
  paymentMethodType?: PaymentMethodTypeEnum | null;
  date: string;
  createdAt?: string | null;
  type: 'income' | 'expense';
}
