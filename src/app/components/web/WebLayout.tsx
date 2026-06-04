import { useState } from 'react';
import { DollarSign, Plus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/app/interfaces/Transaction';
import { BalanceCard } from '../shared/BalanceCard';
import { CategoryFilter } from '../shared/CategoryFilter';
import { TransactionItem } from '../shared/TransactionItem';
import { TransactionForm, TransactionFormData } from '../shared/TransactionForm';

interface WebLayoutProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export function WebLayout({ transactions, onAddTransaction, onDeleteTransaction }: WebLayoutProps) {
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
      subcategory: formData.subcategory,
      subcategoryId: formData.subcategoryId,
      paymentMethod: formData.paymentMethod,
      paymentMethodId: formData.paymentMethodId,
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
      {/* Web Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <DollarSign className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-foreground">RastroDin</h1>
                <p className="text-sm text-muted-foreground">Versão Web - Rastreie seus gastos</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Web Balance Cards - Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
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
        <div className="space-y-4">
          <h2 className="text-foreground flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-primary" />
            Transações
          </h2>
          {filteredTransactions.length === 0 ? (
            <div className="bg-card rounded-xl p-12 text-center border border-border shadow-sm">
              <p className="text-muted-foreground text-lg">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={onDeleteTransaction}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Web Form Modal - Centered */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-2xl">
              <h2 className="text-card-foreground text-xl">Nova Transação</h2>
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
