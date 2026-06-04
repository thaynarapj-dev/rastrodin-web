'use client';

import { useState, useEffect } from 'react';
import { Transaction } from './interfaces/Transaction';
import { Sidebar } from './components/shared/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { Transactions } from './pages/Transactions';
import { CategoriesSettings } from './pages/CategoriesSettings';
import { PaymentMethodsSettings } from './pages/PaymentMethodsSettings';
import { DollarSign } from 'lucide-react';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  sortTransactionsByOccurrence,
} from '@/app/service';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoadingTransactions(true);
        setTransactionsError(null);
        const apiTransactions = await getTransactions();
        setTransactions(sortTransactionsByOccurrence(apiTransactions));
      } catch (error) {
        setTransactionsError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as transações.',
        );
      } finally {
        setIsLoadingTransactions(false);
      }
    }

    loadTransactions();
  }, []);

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      setTransactionsError(null);
      const savedTransaction = await createTransaction(transaction);
      setTransactions((currentTransactions) =>
        sortTransactionsByOccurrence([
          savedTransaction || transaction,
          ...currentTransactions,
        ]),
      );
    } catch (error) {
      setTransactionsError(
        error instanceof Error
          ? error.message
          : 'Não foi possível adicionar a transação.',
      );
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      setTransactionsError(null);
      await deleteTransaction(id);
      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction.id !== id),
      );
    } catch (error) {
      setTransactionsError(
        error instanceof Error
          ? error.message
          : 'Não foi possível remover a transação.',
      );
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigate={setCurrentPage}
            isMobile={isMobile}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            isMobile={isMobile}
          />
        );
      case 'reports':
        return <Reports isMobile={isMobile} />;
      case 'profile':
        return <Profile isMobile={isMobile} />;
      case 'settings':
        return <Settings isMobile={isMobile} onNavigate={setCurrentPage} />;
      case 'categories':
        return (
          <CategoriesSettings
            isMobile={isMobile}
            onBack={() => setCurrentPage('settings')}
          />
        );
      case 'payment-methods':
        return (
          <PaymentMethodsSettings
            isMobile={isMobile}
            onBack={() => setCurrentPage('settings')}
          />
        );
      default:
        return (
          <Dashboard
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigate={setCurrentPage}
            isMobile={isMobile}
          />
        );
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header with Menu */}
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="px-4 py-3 flex items-center gap-3">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isMobile={true} />
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
        {transactionsError && (
          <div className="bg-destructive px-4 py-2 text-sm text-destructive-foreground">
            {transactionsError}
          </div>
        )}
        {isLoadingTransactions ? (
          <main className="p-6 text-muted-foreground">Carregando...</main>
        ) : (
          renderPage()
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex min-w-0 flex-1 flex-col">
        {transactionsError && (
          <div className="bg-destructive px-6 py-2 text-sm text-destructive-foreground">
            {transactionsError}
          </div>
        )}
        {isLoadingTransactions ? (
          <main className="p-8 text-muted-foreground">Carregando...</main>
        ) : (
          renderPage()
        )}
      </div>
    </div>
  );
}
