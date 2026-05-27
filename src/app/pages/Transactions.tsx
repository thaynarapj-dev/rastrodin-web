import { Receipt, Search } from 'lucide-react';
import { useState } from 'react';
import { Expense } from '../components/shared/types';
import { ExpenseItem } from '../components/shared/ExpenseItem';
import { CategoryFilter } from '../components/shared/CategoryFilter';

interface TransactionsProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  isMobile?: boolean;
}

export function Transactions({ expenses, onDeleteExpense, isMobile = false }: TransactionsProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <h1 className="text-2xl text-foreground mb-6">Todas as Transações</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-12 pr-4 py-3 text-foreground"
            />
          </div>
        </div>

        {/* Filter */}
        <CategoryFilter selected={filterCategory} onSelect={setFilterCategory} />

        {/* Transactions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              {filteredExpenses.length} Transações
            </h2>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="bg-card rounded-xl p-12 text-center border border-border shadow-sm">
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          ) : (
            filteredExpenses.map(expense => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={onDeleteExpense}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
