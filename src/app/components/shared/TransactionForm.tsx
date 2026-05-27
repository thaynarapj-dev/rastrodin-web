import { useState } from 'react';
import { categories } from './types';

export interface TransactionFormData {
  description: string;
  amount: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    category: 'Alimentação',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'expense' })}
          className={`flex-1 py-3 rounded-lg transition-colors ${
            formData.type === 'expense'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'income' })}
          className={`flex-1 py-3 rounded-lg transition-colors ${
            formData.type === 'income'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Receita
        </button>
      </div>

      <div>
        <label className="block text-card-foreground mb-2">Descrição</label>
        <input
          type="text"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
          placeholder="Ex: Supermercado"
        />
      </div>

      <div>
        <label className="block text-card-foreground mb-2">Valor</label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
          placeholder="0,00"
        />
      </div>

      <div>
        <label className="block text-card-foreground mb-2">Categoria</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-card-foreground mb-2">Data</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-secondary transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
