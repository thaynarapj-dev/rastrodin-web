import {
  ArrowLeft,
  Banknote,
  Briefcase,
  Car,
  CircleDollarSign,
  Film,
  Home,
  Pencil,
  Plus,
  Save,
  Tag,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Category, CategoryTypeEnum } from '../interfaces/Categories';
import { categories as defaultCategoryNames } from '../components/shared/types';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type CategoryPayload,
} from '../service';

interface CategoriesSettingsProps {
  isMobile?: boolean;
  onBack: () => void;
}

const categoryColors = ['#1a4d2e', '#2d6a4f', '#52b788', '#f4c430', '#e76f51', '#457b9d'];

const categoryIcons = [
  { id: 'tag', label: 'Tag', icon: Tag },
  { id: 'utensils', label: 'Alimentação', icon: Utensils },
  { id: 'car', label: 'Transporte', icon: Car },
  { id: 'home', label: 'Moradia', icon: Home },
  { id: 'film', label: 'Lazer', icon: Film },
  { id: 'briefcase', label: 'Trabalho', icon: Briefcase },
  { id: 'banknote', label: 'Receita', icon: Banknote },
];

const categoryIconMap = {
  tag: Tag,
  utensils: Utensils,
  car: Car,
  home: Home,
  film: Film,
  briefcase: Briefcase,
  banknote: Banknote,
} as const;

const initialForm: CategoryPayload = {
  name: '',
  type: CategoryTypeEnum.EXPENSE,
  color: categoryColors[0],
  icon: 'tag',
  active: true,
};

const fallbackIncomeCategories = ['Salário', 'Investimentos'];

const fallbackIconByName: Record<string, string> = {
  Alimentação: 'utensils',
  Transporte: 'car',
  Moradia: 'home',
  Lazer: 'film',
  Salário: 'banknote',
  Investimentos: 'briefcase',
};

const fallbackCategories: Category[] = [
  ...defaultCategoryNames.map((name, index) => ({
    id: `fallback-expense-${name}`,
    name,
    type: CategoryTypeEnum.EXPENSE,
    color: categoryColors[index % categoryColors.length],
    icon: fallbackIconByName[name] ?? 'tag',
    active: true,
  })),
  ...fallbackIncomeCategories.map((name, index) => ({
    id: `fallback-income-${name}`,
    name,
    type: CategoryTypeEnum.INCOME,
    color: categoryColors[(index + 2) % categoryColors.length],
    icon: fallbackIconByName[name] ?? 'banknote',
    active: true,
  })),
];

function getCategoryIcon(icon: string | null) {
  if (!icon) return Tag;

  return categoryIconMap[icon as keyof typeof categoryIconMap] ?? Tag;
}

function translateType(type: Category['type']) {
  return type === CategoryTypeEnum.INCOME ? 'Receita' : 'Despesa';
}

export function CategoriesSettings({ isMobile = false, onBack }: CategoriesSettingsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<Category['type']>(CategoryTypeEnum.EXPENSE);
  const [formData, setFormData] = useState<CategoryPayload>(initialForm);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const apiCategories = await getCategories();
        setCategories(apiCategories);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Não foi possível carregar as categorias.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  const filteredCategories = useMemo(
    () => {
      const availableCategories = categories.length > 0 ? categories : fallbackCategories;

      return availableCategories.filter((category) => category.type === selectedType);
    },
    [categories, selectedType],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError('Informe o nome da categoria.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const categoryPayload = {
        ...formData,
        name: formData.name.trim(),
      };
      const savedCategory = editingCategoryId
        ? await updateCategory(editingCategoryId, categoryPayload)
        : await createCategory(categoryPayload);

      setCategories((currentCategories) =>
        editingCategoryId
          ? currentCategories.map((category) =>
              category.id === editingCategoryId ? savedCategory : category,
            )
          : [...currentCategories, savedCategory],
      );
      setSelectedType(savedCategory.type);
      setFormData({ ...initialForm, type: savedCategory.type });
      setEditingCategoryId(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Não foi possível salvar a categoria.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setSelectedType(category.type);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color ?? categoryColors[0],
      icon: category.icon ?? 'tag',
      active: category.active,
    });
    setError(null);
  };

  const handleDeleteCategory = async (category: Category) => {
    const confirmed = window.confirm(`Excluir a categoria "${category.name}"?`);

    if (!confirmed) return;

    try {
      setDeletingCategoryId(category.id);
      setError(null);
      await deleteCategory(category.id);
      setCategories((currentCategories) =>
        currentCategories.filter((currentCategory) => currentCategory.id !== category.id),
      );

      if (editingCategoryId === category.id) {
        setEditingCategoryId(null);
        setFormData({ ...initialForm, type: selectedType });
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Não foi possível excluir a categoria.',
      );
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const resetForm = () => {
    setEditingCategoryId(null);
    setFormData({ ...initialForm, type: selectedType });
    setError(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={onBack}
              className="mb-2 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Configurações / Personalização
            </button>
            <h1 className="text-2xl text-foreground">Categorias</h1>
          </div>

          <button
            onClick={resetForm}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            Nova categoria
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-red-50 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_360px]'}`}>
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4">
              <div className="flex w-full rounded-lg bg-background p-1">
                {([CategoryTypeEnum.EXPENSE, CategoryTypeEnum.INCOME] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                      selectedType === type
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type === CategoryTypeEnum.EXPENSE ? 'Despesas' : 'Receitas'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-foreground">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  {filteredCategories.length} categorias
                </h2>
                <span className="text-sm text-muted-foreground">{translateType(selectedType)}</span>
              </div>

              {isLoading ? (
                <div className="rounded-lg bg-background p-8 text-center text-muted-foreground">
                  Carregando categorias...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="rounded-lg bg-background p-8 text-center text-muted-foreground">
                  Nenhuma categoria cadastrada
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCategories.map((category) => {
                    const Icon = getCategoryIcon(category.icon);
                    const isFallbackCategory = category.id.startsWith('fallback-');

                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-background p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: category.color ?? categoryColors[0] }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-foreground">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {isFallbackCategory ? 'Sugestão padrão' : translateType(category.type)}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => handleEditCategory(category)}
                            disabled={isFallbackCategory}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                            aria-label={`Editar ${category.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            disabled={isFallbackCategory || deletingCategoryId === category.id}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive disabled:opacity-50"
                            aria-label={`Excluir ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5">
              <h2 className="text-foreground">
                {editingCategoryId ? 'Editar categoria' : 'Nova categoria'}
              </h2>
              <p className="text-sm text-muted-foreground">Defina como ela aparece nas transações</p>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-card-foreground">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground"
                  placeholder="Ex: Alimentação"
                />
              </div>

              <div>
                <label className="mb-2 block text-card-foreground">Tipo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: CategoryTypeEnum.EXPENSE })}
                    className={`flex-1 rounded-lg py-3 transition-colors ${
                      formData.type === CategoryTypeEnum.EXPENSE
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: CategoryTypeEnum.INCOME })}
                    className={`flex-1 rounded-lg py-3 transition-colors ${
                      formData.type === CategoryTypeEnum.INCOME
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Receita
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-card-foreground">Cor</label>
                <div className="grid grid-cols-6 gap-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-10 rounded-lg border-2 transition-transform ${
                        formData.color === color ? 'border-foreground scale-105' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Selecionar cor ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-card-foreground">Ícone</label>
                <div className="grid grid-cols-4 gap-2">
                  {categoryIcons.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: id })}
                      className={`flex h-11 items-center justify-center rounded-lg border transition-colors ${
                        formData.icon === id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:text-primary'
                      }`}
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted py-3 text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? 'Salvando...' : editingCategoryId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
