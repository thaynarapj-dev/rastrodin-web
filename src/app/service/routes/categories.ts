import { Category } from "@/app/interfaces/Categories";
import { api } from "../api";

const categoriesRoute = '/categories';

export type CategoryPayload = {
  name: string;
  type: Category['type'];
  color?: string;
  icon?: string;
  active?: boolean;
};

export async function getCategories() {
  const { data } = await api.get<{ data: Category[] } | Category[]>(categoriesRoute, {});
  
  if (Array.isArray(data)) {
    return data;
  }

  return data.data ?? [];
}

export async function createCategory(category: CategoryPayload) {
  const { data } = await api.post<{ data: Category }>(categoriesRoute, category);

  return data.data;
}

export async function updateCategory(id: string, category: CategoryPayload) {
  const { data } = await api.patch<{ data: Category }>(categoriesRoute, category, {
    params: { id },
  });

  return data.data;
}

export async function deleteCategory(id: string) {
  await api.delete(categoriesRoute, {
    params: { id },
  });
}
