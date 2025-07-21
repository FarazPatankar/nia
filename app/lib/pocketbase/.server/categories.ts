import { getPocketBaseClient } from "..";
import { CategoriesResponse, Collections } from "../db-types";

export const getCategories = async () => {
  const pb = getPocketBaseClient();

  const categories = await pb
    .collection(Collections.Categories)
    .getFullList<CategoriesResponse>();

  return categories;
};

export const getCategoryBySlug = async (slug: string) => {
  const pb = getPocketBaseClient();
  const category = await pb
    .collection(Collections.Categories)
    .getFirstListItem<CategoriesResponse>(`slug="${slug}"`);

  return category;
};

export const getCategoryById = async (id: string) => {
  const pb = getPocketBaseClient();
  const category = await pb
    .collection(Collections.Categories)
    .getOne<CategoriesResponse>(id);

  return category;
};
