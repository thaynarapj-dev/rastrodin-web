import { Filter } from 'lucide-react';
import { getCategories } from '@/app/service/routes/categories';
import React from 'react';
import { Category } from '@/app/interfaces/Categories';

interface CategoryFilterProps {
  selected: string;
  selectedSubcategory?: string;
  onSelect: (category: string) => void;
  onSelectSubcategory?: (subcategory: string) => void;
}

export function CategoryFilter({
  selected,
  selectedSubcategory = 'all',
  onSelect,
  onSelectSubcategory,
}: CategoryFilterProps) {
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([]);
  const parentCategories = categoriesList
    .filter((category) => !category.parent_id)
    .map(({ id, name }) => ({ id, name }));
  const selectedCategorySubcategories =
    selected === 'all'
      ? []
      : categoriesList
          .filter((category) => category.parent_id === selected)
          .map(({ id, name }) => ({ id, name }));

  React.useEffect(() => {
    getCategories().then(categories => {
      setCategoriesList(Array.isArray(categories) ? categories : []);
    });
  }, []);


  return (
    <div className="mb-6">
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
        {parentCategories.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => {
              onSelect(id);
              onSelectSubcategory?.('all');
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selected === id 
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-card-foreground border border-border hover:bg-secondary'
            }`}
          >
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
          {selectedCategorySubcategories.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => onSelectSubcategory?.(id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedSubcategory === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-card-foreground border border-border hover:bg-secondary'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
