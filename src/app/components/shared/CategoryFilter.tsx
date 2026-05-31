import { Filter } from 'lucide-react';
import { categories } from './types';
import { getCategories } from '@/app/service/routes/categories';
import React from 'react';
import { Category } from '@/app/interfaces/Categories';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories().then(categories => {
      setCategoriesList(categories);
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
          onClick={() => onSelect('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selected === 'all'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-card-foreground border border-border hover:bg-secondary'
          }`}
        >
          Todas
        </button>
        {categoriesList.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
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
    </div>
  );
}
