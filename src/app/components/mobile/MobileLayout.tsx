import { useState } from 'react';
import { DollarSign, Plus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/app/interfaces/Transaction';
import { BalanceCard } from '../shared/BalanceCard';
import { CategoryFilter } from '../shared/CategoryFilter';
import { TransactionItem } from '../shared/TransactionItem';
import { TransactionForm, TransactionFormData } from '../shared/TransactionForm';

interface MobileLayoutProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export function MobileLayout({ transactions, onAddTransaction, onDeleteTransaction }: MobileLayoutProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all');

  const handleSubmit = (formData: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      categoryId: formData.categoryId,
      categoryIcon: formData.categoryIcon,
      categoryColor: formData.categoryColor,
      subcategory: formData.subcategory,
      subcategoryId: formData.subcategoryId,
      subcategoryIcon: formData.subcategoryIcon,
      subcategoryColor: formData.subcategoryColor,
      paymentMethod: formData.paymentMethod,
      paymentMethodId: formData.paymentMethodId,
      paymentMethodType: formData.paymentMethodType,
      date: formData.date,
      type: formData.type
    };
    onAddTransaction(newTransaction);
    setShowForm(false);
  };

  const filteredTransactions = filterCategory === 'all'
    ? transactions
    : transactions.filter((transaction) =>
        filterSubcategory === 'all'
          ? transaction.categoryId === filterCategory
          : transaction.subcategoryId === filterSubcategory,
      );

  const totalIncome = transactions
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOutcome = transactions
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalOutcome;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg text-foreground">RastroDin</h1>
              <p className="text-xs text-muted-foreground">Mobile</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-24">
        {/* Mobile Balance Cards - Stacked */}
        <div className="space-y-3 mb-6">
          <BalanceCard
            icon={TrendingUp}
            label="Receitas"
            value={totalIncome}
            type="income"
          />
          <BalanceCard
            icon={TrendingDown}
            label="Despesas"
            value={totalOutcome}
            type="expense"
          />
          <BalanceCard
            icon={DollarSign}
            label="Saldo"
            value={balance}
            type="balance"
            balance={balance}
          />
        </div>

        {/* Filter */}
        <CategoryFilter
          selected={filterCategory}
          selectedSubcategory={filterSubcategory}
          onSelect={setFilterCategory}
          onSelectSubcategory={setFilterSubcategory}
        />

        {/* Transactions */}
        <div className="space-y-3">
          <h2 className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Transações
          </h2>
          {filteredTransactions.length === 0 ? (
            <div className="bg-card rounded-xl p-8 text-center border border-border shadow-sm">
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDeleteTransaction}
              />
            ))
          )}
        </div>
      </main>

      {/* Mobile Add Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Form Modal - Slides from Bottom */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-30">
          <div className="bg-card rounded-t-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-card border-b border-border p-4">
              <h2 className="text-card-foreground">Nova Transação</h2>
            </div>
            <TransactionForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
