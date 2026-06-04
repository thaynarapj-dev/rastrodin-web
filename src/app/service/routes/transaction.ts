import { Transaction } from '@/app/interfaces/Transaction';
import { PaymentMethodTypeEnum } from '@/app/interfaces/PaymentMethods';
import { api } from '../api';

const transactionsRoute = '/transactions';

type TransactionPayload = Omit<Transaction, 'id'> & Partial<Pick<Transaction, 'id'>>;

type TransactionRow = {
  id: string;
  title: string;
  amount: number | string;
  category_id?: string | null;
  subcategory_id?: string | null;
  category?: {
    name?: string | null;
    icon?: string | null;
    color?: string | null;
  } | null;
  subcategory?: {
    name?: string | null;
    icon?: string | null;
    color?: string | null;
  } | null;
  payment_method_id?: string | null;
  payments_methods?: {
    name?: string | null;
    type?: PaymentMethodTypeEnum | null;
  } | null;
  occurred_at: string;
  created_at?: string | null;
  type: Transaction['type'];
};

function isUuid(value: string | null | undefined) {
  return Boolean(
    value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
  );
}

function serializeTransaction(
  row: TransactionRow,
  fallbackCategoryName = 'Sem categoria',
  fallbackSubcategoryName = '',
  fallbackPaymentMethodName = 'Sem forma de pagamento',
  fallbackVisualData: Partial<Transaction> = {},
): Transaction {
  const categoryId = row.category_id ?? null;
  const subcategoryId = row.subcategory_id ?? null;
  const paymentMethodId = row.payment_method_id ?? null;

  return {
    id: row.id,
    description: row.title,
    amount: Number(row.amount),
    category: row.category?.name ?? fallbackCategoryName,
    categoryId,
    categoryIcon: row.category?.icon ?? fallbackVisualData.categoryIcon ?? null,
    categoryColor: row.category?.color ?? fallbackVisualData.categoryColor ?? null,
    subcategory: row.subcategory?.name ?? fallbackSubcategoryName,
    subcategoryId,
    subcategoryIcon: row.subcategory?.icon ?? fallbackVisualData.subcategoryIcon ?? null,
    subcategoryColor: row.subcategory?.color ?? fallbackVisualData.subcategoryColor ?? null,
    paymentMethod: row.payments_methods?.name ?? fallbackPaymentMethodName,
    paymentMethodId,
    paymentMethodType: row.payments_methods?.type ?? fallbackVisualData.paymentMethodType ?? null,
    date: row.occurred_at,
    createdAt: row.created_at ?? fallbackVisualData.createdAt ?? null,
    type: row.type,
  };
}

export function sortTransactionsByOccurrence(transactions: Transaction[]) {
  return [...transactions].sort((currentTransaction, nextTransaction) => {
    const currentOccurredAt = new Date(currentTransaction.date).getTime();
    const nextOccurredAt = new Date(nextTransaction.date).getTime();

    if (currentOccurredAt !== nextOccurredAt) {
      return nextOccurredAt - currentOccurredAt;
    }

    const currentCreatedAt = currentTransaction.createdAt
      ? new Date(currentTransaction.createdAt).getTime()
      : 0;
    const nextCreatedAt = nextTransaction.createdAt
      ? new Date(nextTransaction.createdAt).getTime()
      : 0;

    return nextCreatedAt - currentCreatedAt;
  });
}

function serializeTransactionPayload(transaction: TransactionPayload) {
  return {
    type: transaction.type,
    title: transaction.description,
    amount: transaction.amount,
    category_id: isUuid(transaction.categoryId) ? transaction.categoryId : null,
    subcategory_id: isUuid(transaction.subcategoryId) ? transaction.subcategoryId : null,
    payment_method_id: isUuid(transaction.paymentMethodId) ? transaction.paymentMethodId : null,
    occurred_at: transaction.date,
  };
}

export async function getTransactions() {
  const { data } = await api.get<TransactionRow[]>(transactionsRoute, {
    params: {
      select:
        '*,category:categories!transactions_category_id_fkey(name,icon,color),subcategory:categories!transactions_subcategory_id_fkey(name,icon,color),payments_methods(name,type)',
      order: 'occurred_at.desc,created_at.desc',
    },
  });

  return sortTransactionsByOccurrence(data.map((transaction) => serializeTransaction(transaction)));
}

export async function createTransaction(transaction: TransactionPayload) {
  const { data } = await api.post<TransactionRow[]>(
    transactionsRoute,
    serializeTransactionPayload(transaction),
    {
      params: {
        select:
          '*,category:categories!transactions_category_id_fkey(name,icon,color),subcategory:categories!transactions_subcategory_id_fkey(name,icon,color),payments_methods(name,type)',
      },
      headers: {
        Prefer: 'return=representation',
      },
    },
  );

  return serializeTransaction(
    data[0],
    transaction.category,
    transaction.subcategory,
    transaction.paymentMethod,
    transaction,
  );
}

export async function deleteTransaction(id: string) {
  await api.delete(transactionsRoute, {
    params: {
      id: `eq.${id}`,
    },
  });
}

export const transactionRoutes = {
  list: transactionsRoute,
};
