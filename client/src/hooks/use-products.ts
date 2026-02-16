import { useQuery } from "@tanstack/react-query";
import productsData from "../data/products.json";

export interface Product {
  id: number;
  nome_modello: string;
  brand: string;
  categoria: string;
  prezzo: number;
  descrizione_breve: string;
  main_image: string;
  motor?: string;
  batteria_wh?: number;
  autonomy?: number;
  descrizione_dettagliata?: string;
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
      if (isNaN(id)) {
        // Fallback to slug-like matching if needed, but the requirement says IDs 1-75
        return productsData.find((p: any) => p.id.toString() === idOrSlug) as Product || null;
      }
      return productsData.find((p: any) => p.id === id) as Product || null;
    },
    enabled: !!idOrSlug,
  });
}
