import { Category } from "@/app/interfaces/Categories";
import { api } from "../api";

const categoriesRoute = '/categories';

export type CategoryPayload = {
  name: string;
  type: Category['type'];
  color?: string;
  icon?: string;
  parent_id?: string | null;
  active?: boolean;
};

type CategoryResponse = Category | Category[] | { data?: Category | Category[] } | null | undefined;

function isCategory(value: unknown): value is Category {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'id' in value &&
      'name' in value &&
      'type' in value,
  );
}

function normalizeCategoriesResponse(response: CategoryResponse): Category[] {
  if (Array.isArray(response)) {
    return response.filter(isCategory);
  }

  if (!response) {
    return [];
  }

  if ('data' in response) {
    const responseData = response.data;

    if (Array.isArray(responseData)) {
      return responseData.filter(isCategory);
    }

    return isCategory(responseData) ? [responseData] : [];
  }

  return isCategory(response) ? [response] : [];
}

function normalizeCategoryResponse(response: CategoryResponse) {
  return normalizeCategoriesResponse(response)[0];
}

export async function getCategories() {
  const { data } = await api.get<CategoryResponse>(categoriesRoute, {});

  return normalizeCategoriesResponse(data);
}

export async function createCategory(category: CategoryPayload) {
  const { data } = await api.post<CategoryResponse>(categoriesRoute, category, {
    headers: {
      Prefer: 'return=representation',
    },
  });

  return normalizeCategoryResponse(data);
}

export async function updateCategory(id: string, category: CategoryPayload) {
  const { data } = await api.patch<CategoryResponse>(categoriesRoute, category, {
    params: { id },
    headers: {
      Prefer: 'return=representation',
    },
  });

  return normalizeCategoryResponse(data);
}

export async function deleteCategory(id: string) {
  await api.delete(categoriesRoute, {
    params: { id },
  });
}
