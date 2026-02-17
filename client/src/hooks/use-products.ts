import { useQuery } from "@tanstack/react-query";
import productsData from "../data/products.json";

export interface Product {
  id: number;
  nome: string;
  categoria: string;
  prezzo: number;
  descrizione: string;
  varianti?: string[];
}

export function useProducts(filters?: { category?: string; featured?: boolean; bestseller?: boolean }) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      let filtered = [...productsData] as Product[];
      if (filters?.category) {
        filtered = filtered.filter(p => p.categoria === filters.category);
      }
      return filtered;
    },
  });
}

export function useProduct(idOrSlug: string | number) {
  return useQuery<Product | null>({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      const id = typeof idOrSlug === "string" ? parseInt(idOrSlug) : idOrSlug;
      return productsData.find((p: any) => p.id === id) as Product || null;
    },
    enabled: !!idOrSlug,
  });
}
