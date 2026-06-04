import { Trash2 } from 'lucide-react';
import { createElement } from 'react';
import { Transaction } from '@/app/interfaces/Transaction';
import { getCategoryIcon, getPaymentMethodIcon } from './icons';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const categoryColor =
    transaction.subcategoryColor ?? transaction.categoryColor ?? '#1a4d2e';

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {createElement(
              getCategoryIcon(transaction.subcategoryIcon ?? transaction.categoryIcon),
              { className: 'h-4 w-4' },
            )}
          </span>
          <span className="min-w-0 text-sm text-muted-foreground truncate">
            {transaction.category}
            {transaction.subcategory ? ` > ${transaction.subcategory}` : ''}
          </span>
          {transaction.paymentMethod && (
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary sm:inline-flex">
              {createElement(getPaymentMethodIcon(transaction.paymentMethodType), {
                className: 'h-3 w-3',
              })}
              {transaction.paymentMethod}
            </span>
          )}
        </div>
        {transaction.paymentMethod && (
          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
            {createElement(getPaymentMethodIcon(transaction.paymentMethodType), {
              className: 'h-3 w-3 text-primary',
            })}
            <span className="truncate">{transaction.paymentMethod}</span>
          </div>
        )}
        <p className="text-card-foreground truncate">{transaction.description}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(transaction.date).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <p className={`font-medium whitespace-nowrap ${
          transaction.type === 'income' ? 'text-primary' : 'text-destructive'
        }`}>
          {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
        </p>
        <button
          onClick={() => onDelete(transaction.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>
    </div>
  );
}
