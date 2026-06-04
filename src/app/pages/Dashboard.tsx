import { useState } from 'react';
import { DollarSign, Plus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../interfaces/Transaction';
import { BalanceCard } from '../components/shared/BalanceCard';
import { TransactionItem } from '../components/shared/TransactionItem';
import { TransactionForm, TransactionFormData } from '../components/shared/TransactionForm';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onNavigate?: (page: string) => void;
  isMobile?: boolean;
}

export function Dashboard({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onNavigate,
  isMobile = false,
}: DashboardProps) {
  const [showForm, setShowForm] = useState(false);

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

  const recentTransactions = transactions.slice(0, 10);

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

        {/* Transactions */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Últimas transações
            </h2>
            <button
              onClick={() => onNavigate?.('transactions')}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-card-foreground transition-colors hover:bg-secondary"
            >
              Ver todas
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="bg-card rounded-xl p-8 text-center border border-border shadow-sm">
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          ) : (
            recentTransactions.map(transaction => (
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
