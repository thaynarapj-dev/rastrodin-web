import { TrendingUp, PieChart, BarChart3 } from 'lucide-react';

interface ReportsProps {
  isMobile?: boolean;
}

export function Reports({ isMobile = false }: ReportsProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <h1 className="text-2xl text-foreground mb-6">Relatórios</h1>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground">Resumo Mensal</h3>
                <p className="text-sm text-muted-foreground">Maio 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Receitas</p>
                <p className="text-2xl text-primary">R$ 5.000,00</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Despesas</p>
                <p className="text-2xl text-destructive">R$ 430,50</p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground">Gastos por Categoria</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground">Alimentação</span>
                  <span className="text-foreground">R$ 250,50</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground">Transporte</span>
                  <span className="text-foreground">R$ 180,00</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground">Gráficos</h3>
            </div>

            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Gráficos em breve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
