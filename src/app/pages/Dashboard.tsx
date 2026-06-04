import { useState } from 'react';
import { DollarSign, Plus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../interfaces/Transaction';
import { BalanceCard } from '../components/shared/BalanceCard';
import { CategoryFilter } from '../components/shared/CategoryFilter';
import { TransactionItem } from '../components/shared/TransactionItem';
import { TransactionForm, TransactionFormData } from '../components/shared/TransactionForm';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  isMobile?: boolean;
}

export function Dashboard({ transactions, onAddTransaction, onDeleteTransaction, isMobile = false }: DashboardProps) {
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
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'} pb-24`}>
        {/* Balance Cards */}
        <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-3 gap-6'} mb-6`}>
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
            Transações Recentes
          </h2>
          {filteredTransactions.length === 0 ? (
            <div className="bg-card rounded-xl p-8 text-center border border-border shadow-sm">
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          ) : (
            filteredTransactions.slice(0, 10).map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDeleteTransaction}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className={`fixed inset-0 bg-black/50 flex ${isMobile ? 'items-end' : 'items-center'} justify-center z-30 p-4`}>
          <div className={`bg-card ${isMobile ? 'rounded-t-2xl' : 'rounded-2xl'} w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl`}>
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
