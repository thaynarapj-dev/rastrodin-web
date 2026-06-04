import { Filter } from 'lucide-react';
import { getCategories } from '@/app/service/routes/categories';
import React, { createElement } from 'react';
import { Category } from '@/app/interfaces/Categories';
import { getCategoryIcon } from './icons';

interface CategoryFilterProps {
  selected: string;
  selectedSubcategory?: string;
  onSelect: (category: string) => void;
  onSelectSubcategory?: (subcategory: string) => void;
  className?: string;
}

export function CategoryFilter({
  selected,
  selectedSubcategory = 'all',
  onSelect,
  onSelectSubcategory,
  className = 'mb-6',
}: CategoryFilterProps) {
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([]);
  const parentCategories = categoriesList
    .filter((category) => !category.parent_id)
    .map(({ id, name, icon, color }) => ({ id, name, icon, color }));
  const selectedCategorySubcategories =
    selected === 'all'
      ? []
      : categoriesList
          .filter((category) => category.parent_id === selected)
          .map(({ id, name, icon, color }) => ({ id, name, icon, color }));

  React.useEffect(() => {
    getCategories().then(categories => {
      setCategoriesList(Array.isArray(categories) ? categories : []);
    });
  }, []);

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">Filtrar por categoria</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => {
            onSelect('all');
            onSelectSubcategory?.('all');
          }}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selected === 'all'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-card-foreground border border-border hover:bg-secondary'
          }`}
        >
          Todas
        </button>
        {parentCategories.map(({ id, name, icon, color }) => (
          <button
            key={id}
            onClick={() => {
              onSelect(id);
              onSelectSubcategory?.('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selected === id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-card-foreground border border-border hover:bg-secondary'
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                selected === id ? 'bg-white/15' : 'text-white'
              }`}
              style={{ backgroundColor: selected === id ? undefined : color ?? '#1a4d2e' }}
            >
              {createElement(getCategoryIcon(icon), { className: 'h-4 w-4' })}
            </span>
            {name}
          </button>
        ))}
      </div>

      {selectedCategorySubcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => onSelectSubcategory?.('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedSubcategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-card-foreground border border-border hover:bg-secondary'
            }`}
          >
            Todas as subcategorias
          </button>
          {selectedCategorySubcategories.map(({ id, name, icon, color }) => (
            <button
              key={id}
              onClick={() => onSelectSubcategory?.(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedSubcategory === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-card-foreground border border-border hover:bg-secondary'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md ${
                  selectedSubcategory === id ? 'bg-white/15' : 'text-white'
                }`}
                style={{
                  backgroundColor: selectedSubcategory === id ? undefined : color ?? '#1a4d2e',
                }}
              >
                {createElement(getCategoryIcon(icon), { className: 'h-4 w-4' })}
              </span>
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
