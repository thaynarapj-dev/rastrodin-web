import { Category } from "@/app/interfaces/Categories";
import { api } from "../api";

export async function getCategories() {
  const { data } = await api.get<Category[]>('/categories', {});
  
  return data;
}
