import { LucideIcon } from 'lucide-react';

interface BalanceCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  type: 'income' | 'expense' | 'balance';
  balance?: number;
}

export function BalanceCard({ icon: Icon, label, value, type, balance }: BalanceCardProps) {
  const getColorClasses = () => {
    if (type === 'income') return 'bg-green-100 text-primary';
    if (type === 'expense') return 'bg-red-100 text-destructive';
    return 'bg-yellow-100 text-accent';
  };

  const getValueColor = () => {
    if (type === 'income') return 'text-primary';
    if (type === 'expense') return 'text-destructive';
    return balance !== undefined && balance >= 0 ? 'text-primary' : 'text-destructive';
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl ${getValueColor()}`}>
        R$ {value.toFixed(2)}
      </p>
    </div>
  );
}
