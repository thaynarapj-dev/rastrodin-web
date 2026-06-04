import {
  Bell,
  ChevronRight,
  CreditCard,
  Database,
  Lock,
  Moon,
  Palette,
  Shield,
  Tags,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories, getPaymentMethods } from '../service';

interface SettingsProps {
  isMobile?: boolean;
  onNavigate?: (page: string) => void;
}

export function Settings({ isMobile = false, onNavigate }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [paymentMethodsCount, setPaymentMethodsCount] = useState(0);

  useEffect(() => {
    getCategories()
      .then((categories) => setCategoriesCount(categories.length))
      .catch(() => setCategoriesCount(0));

    getPaymentMethods()
      .then((paymentMethods) => setPaymentMethodsCount(paymentMethods.length))
      .catch(() => setPaymentMethodsCount(0));
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <h1 className="text-2xl text-foreground mb-6">Configurações</h1>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">Notificações</h3>
                  <p className="text-sm text-muted-foreground">Gerencie suas notificações</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="text-foreground">Ativar notificações</span>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">Aparência</h3>
                  <p className="text-sm text-muted-foreground">Personalize a interface</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="text-foreground">Modo escuro</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      darkMode ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personalization */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">Personalização</h3>
                  <p className="text-sm text-muted-foreground">Organize suas preferências</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onNavigate?.('categories')}
                  className="w-full flex items-center justify-between gap-3 p-3 bg-background rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Tags className="w-5 h-5 shrink-0 text-primary" />
                    <div className="min-w-0 text-left">
                      <span className="block text-foreground">Categorias</span>
                      <span className="block text-sm text-muted-foreground">
                        {categoriesCount} categorias cadastradas
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground" />
                </button>

                <button
                  onClick={() => onNavigate?.('payment-methods')}
                  className="w-full flex items-center justify-between gap-3 p-3 bg-background rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CreditCard className="w-5 h-5 shrink-0 text-primary" />
                    <div className="min-w-0 text-left">
                      <span className="block text-foreground">Formas de pagamento</span>
                      <span className="block text-sm text-muted-foreground">
                        {paymentMethodsCount} formas cadastradas
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">Segurança</h3>
                  <p className="text-sm text-muted-foreground">Proteja sua conta</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Alterar senha</span>
                  </div>
                </button>

                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Autenticação em 2 fatores</span>
                  </div>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      twoFactor ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      twoFactor ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground">Dados</h3>
                  <p className="text-sm text-muted-foreground">Gerencie seus dados</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-background rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-foreground">Exportar dados</span>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <span className="text-destructive">Excluir conta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
