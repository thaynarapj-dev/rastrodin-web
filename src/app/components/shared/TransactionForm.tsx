import { createElement, useEffect, useState } from 'react';
import { Category } from '@/app/interfaces/Categories';
import { PaymentMethod, PaymentMethodTypeEnum } from '@/app/interfaces/PaymentMethods';
import { getCategories, getPaymentMethods } from '@/app/service';
import {
  getCategoryIcon,
  getPaymentMethodIcon,
  translatePaymentMethodType,
} from './icons';

export interface TransactionFormData {
  description: string;
  amount: string;
  category: string;
  categoryId: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
  subcategory: string;
  subcategoryId: string | null;
  subcategoryIcon: string | null;
  subcategoryColor: string | null;
  paymentMethod: string;
  paymentMethodId: string | null;
  paymentMethodType: PaymentMethodTypeEnum | null;
  date: string;
  type: 'income' | 'expense';
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    category: 'Sem categoria',
    categoryId: null,
    categoryIcon: null,
    categoryColor: null,
    subcategory: '',
    subcategoryId: null,
    subcategoryIcon: null,
    subcategoryColor: null,
    paymentMethod: 'Sem forma de pagamento',
    paymentMethodId: null,
    paymentMethodType: null,
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  useEffect(() => {
    getCategories()
      .then((apiCategories) => {
        setCategories(apiCategories);
        setFormData((currentFormData) => {
          const firstParentCategory = apiCategories.find(
            (category) => category.type === currentFormData.type && !category.parent_id,
          );

          if (!firstParentCategory) {
            setSelectedParentCategoryId(null);
            setSelectedSubcategoryId(null);
            return currentFormData;
          }

          setSelectedParentCategoryId(firstParentCategory.id);
          setSelectedSubcategoryId(null);

          return {
            ...currentFormData,
            category: firstParentCategory.name,
            categoryId: firstParentCategory.id,
            categoryIcon: firstParentCategory.icon,
            categoryColor: firstParentCategory.color,
            subcategory: '',
            subcategoryId: null,
            subcategoryIcon: null,
            subcategoryColor: null,
          };
        });
      })
      .catch(() => setCategories([]));

    getPaymentMethods()
      .then((apiPaymentMethods) => {
        const activePaymentMethods = apiPaymentMethods.filter((paymentMethod) => paymentMethod.active);
        setPaymentMethods(activePaymentMethods);
        setFormData((currentFormData) => {
          const firstPaymentMethod = activePaymentMethods[0];

          if (!firstPaymentMethod) {
            return currentFormData;
          }

          return {
            ...currentFormData,
            paymentMethod: firstPaymentMethod.name,
            paymentMethodId: firstPaymentMethod.id,
            paymentMethodType: firstPaymentMethod.type,
          };
        });
      })
      .catch(() => setPaymentMethods([]));
  }, []);

  const parentCategories = categories.filter(
    (category) => category.type === formData.type && !category.parent_id,
  );
  const subcategories = selectedParentCategoryId
    ? categories.filter((category) => category.parent_id === selectedParentCategoryId)
    : [];

  const handleTypeChange = (type: TransactionFormData['type']) => {
    const firstParentCategory = categories.find(
      (category) => category.type === type && !category.parent_id,
    );

    setSelectedParentCategoryId(firstParentCategory?.id ?? null);
    setSelectedSubcategoryId(null);

    setFormData({
      ...formData,
      type,
      category: firstParentCategory?.name ?? 'Sem categoria',
      categoryId: firstParentCategory?.id ?? null,
      categoryIcon: firstParentCategory?.icon ?? null,
      categoryColor: firstParentCategory?.color ?? null,
      subcategory: '',
      subcategoryId: null,
      subcategoryIcon: null,
      subcategoryColor: null,
    });
  };

  const handleParentCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find((category) => category.id === categoryId);

    setSelectedParentCategoryId(selectedCategory?.id ?? null);
    setSelectedSubcategoryId(null);
    setFormData({
      ...formData,
      category: selectedCategory?.name ?? 'Sem categoria',
      categoryId: selectedCategory?.id ?? null,
      categoryIcon: selectedCategory?.icon ?? null,
      categoryColor: selectedCategory?.color ?? null,
      subcategory: '',
      subcategoryId: null,
      subcategoryIcon: null,
      subcategoryColor: null,
    });
  };

  const handleSubcategoryChange = (categoryId: string) => {
    const selectedParentCategory = categories.find(
      (category) => category.id === selectedParentCategoryId,
    );
    const selectedSubcategory = categories.find((category) => category.id === categoryId);

    setSelectedSubcategoryId(selectedSubcategory?.id ?? null);
    setFormData({
      ...formData,
      category: selectedParentCategory?.name ?? 'Sem categoria',
      categoryId: selectedParentCategory?.id ?? null,
      categoryIcon: selectedParentCategory?.icon ?? null,
      categoryColor: selectedParentCategory?.color ?? null,
      subcategory: selectedSubcategory?.name ?? '',
      subcategoryId: selectedSubcategory?.id ?? null,
      subcategoryIcon: selectedSubcategory?.icon ?? null,
      subcategoryColor: selectedSubcategory?.color ?? null,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedParentCategory = parentCategories.find(
    (category) => category.id === selectedParentCategoryId,
  );
  const selectedSubcategory = subcategories.find(
    (category) => category.id === selectedSubcategoryId,
  );
  const selectedPaymentMethod = paymentMethods.find(
    (paymentMethod) => paymentMethod.id === formData.paymentMethodId,
  );
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
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
          onClick={() => handleTypeChange('income')}
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
          value={selectedParentCategoryId ?? ''}
          onChange={(e) => handleParentCategoryChange(e.target.value)}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
        >
          <option value="">Sem categoria</option>
          {parentCategories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {selectedParentCategory && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: selectedParentCategory.color ?? '#1a4d2e' }}
            >
              {createElement(getCategoryIcon(selectedParentCategory.icon), {
                className: 'h-4 w-4',
              })}
            </span>
            <span className="truncate">{selectedParentCategory.name}</span>
          </div>
        )}
      </div>

      {subcategories.length > 0 && (
        <div>
          <label className="block text-card-foreground mb-2">Subcategoria</label>
          <select
            value={selectedSubcategoryId ?? ''}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
          >
            <option value="">Nenhuma, usar categoria principal</option>
            {subcategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {selectedSubcategory && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: selectedSubcategory.color ?? '#1a4d2e' }}
              >
                {createElement(getCategoryIcon(selectedSubcategory.icon), {
                  className: 'h-4 w-4',
                })}
              </span>
              <span className="truncate">{selectedSubcategory.name}</span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-card-foreground mb-2">Forma de pagamento</label>
        <select
          value={formData.paymentMethodId ?? ''}
          onChange={(e) => {
            const selectedPaymentMethod = paymentMethods.find(
              (paymentMethod) => paymentMethod.id === e.target.value,
            );

            setFormData({
              ...formData,
              paymentMethod: selectedPaymentMethod?.name ?? 'Sem forma de pagamento',
              paymentMethodId: selectedPaymentMethod?.id ?? null,
              paymentMethodType: selectedPaymentMethod?.type ?? null,
            });
          }}
          className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground"
        >
          <option value="">Sem forma de pagamento</option>
          {paymentMethods.map(paymentMethod => (
            <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name}</option>
          ))}
        </select>
        {selectedPaymentMethod && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {createElement(getPaymentMethodIcon(selectedPaymentMethod.type), {
                className: 'h-4 w-4',
              })}
            </span>
            <span className="truncate">
              {selectedPaymentMethod.name} • {translatePaymentMethodType(selectedPaymentMethod.type)}
            </span>
          </div>
        )}
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
