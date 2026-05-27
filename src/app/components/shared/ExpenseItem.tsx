import { Tag, Trash2 } from 'lucide-react';
import { Expense } from './types';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">{expense.category}</span>
        </div>
        <p className="text-card-foreground truncate">{expense.description}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(expense.date).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <p className={`font-medium whitespace-nowrap ${
          expense.type === 'income' ? 'text-primary' : 'text-destructive'
        }`}>
          {expense.type === 'income' ? '+' : '-'} R$ {expense.amount.toFixed(2)}
        </p>
        <button
          onClick={() => onDelete(expense.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>
    </div>
  );
}
