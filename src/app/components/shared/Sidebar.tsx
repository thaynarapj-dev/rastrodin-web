import { Home, User, Settings, LogOut, Menu, X, Wallet, TrendingUp, Receipt } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobile?: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'transactions', label: 'Transações', icon: Receipt },
  { id: 'reports', label: 'Relatórios', icon: TrendingUp },
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, isMobile = false }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActivePage = (page: string) =>
    currentPage === page || (currentPage === 'categories' && page === 'settings');

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (isMobile) setIsOpen(false);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-medium text-foreground">RastroDin</h2>
                      <p className="text-xs text-muted-foreground">Menu</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePage(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Wallet className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-medium text-foreground">RastroDin</h2>
            <p className="text-sm text-muted-foreground">Financeiro</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePage(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
