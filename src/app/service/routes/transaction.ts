import { Transaction } from '@/app/interfaces/Transaction';
import { api } from '../api';

const transactionsRoute = '/transactions';

type TransactionPayload = Omit<Transaction, 'id'> & Partial<Pick<Transaction, 'id'>>;

export async function getTransactions() {
  const { data } = await api.get<Transaction[]>(transactionsRoute, {});

  return data;
}

export async function createTransaction(transaction: TransactionPayload) {
  const { data } = await api.post<Transaction[]>(transactionsRoute, transaction, {
    headers: {
      Prefer: 'return=representation',
    },
  });

  return data[0];
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
