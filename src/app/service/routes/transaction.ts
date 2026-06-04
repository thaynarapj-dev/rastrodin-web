import { Transaction } from '@/app/interfaces/Transaction';
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
  } | null;
  subcategory?: {
    name?: string | null;
  } | null;
  payment_method_id?: string | null;
  payments_methods?: {
    name?: string | null;
  } | null;
  occurred_at: string;
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
    subcategory: row.subcategory?.name ?? fallbackSubcategoryName,
    subcategoryId,
    paymentMethod: row.payments_methods?.name ?? fallbackPaymentMethodName,
    paymentMethodId,
    date: row.occurred_at,
    type: row.type,
  };
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
        '*,category:categories!transactions_category_id_fkey(name),subcategory:categories!transactions_subcategory_id_fkey(name),payments_methods(name)',
    },
  });

  return data.map((transaction) => serializeTransaction(transaction));
}

export async function createTransaction(transaction: TransactionPayload) {
  const { data } = await api.post<TransactionRow[]>(
    transactionsRoute,
    serializeTransactionPayload(transaction),
    {
      params: {
        select:
          '*,category:categories!transactions_category_id_fkey(name),subcategory:categories!transactions_subcategory_id_fkey(name),payments_methods(name)',
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
