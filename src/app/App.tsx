'use client';

import { useState, useEffect } from 'react';
import { Expense } from './components/shared/types';
import { Sidebar } from './components/shared/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { Transactions } from './pages/Transactions';
import { DollarSign } from 'lucide-react';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Supermercado',
      amount: 250.50,
      category: 'Alimentação',
      date: '2026-05-27',
      type: 'expense'
    },
    {
      id: '2',
      description: 'Salário',
      amount: 5000,
      category: 'Outros',
      date: '2026-05-01',
      type: 'income'
    },
    {
      id: '3',
      description: 'Gasolina',
      amount: 180,
      category: 'Transporte',
      date: '2026-05-25',
      type: 'expense'
    }
  ]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            isMobile={isMobile}
          />
        );
      case 'transactions':
        return (
          <Transactions
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            isMobile={isMobile}
          />
        );
      case 'reports':
        return <Reports isMobile={isMobile} />;
      case 'profile':
        return <Profile isMobile={isMobile} />;
      case 'settings':
        return <Settings isMobile={isMobile} />;
      default:
        return (
          <Dashboard
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
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
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg text-foreground">RastroDin</h1>
                <p className="text-xs text-muted-foreground">Mobile</p>
              </div>
            </div>
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} isMobile={true} />
          </div>
        </header>
        {renderPage()}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
