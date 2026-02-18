import { useQuery } from "@tanstack/react-query";
import productsData from "../data/products.json";

export interface CaratteristicheTecniche {
  telaio?: string;
  motore?: string;
  batteria?: string;
  trasmissione?: string;
  sospensioni?: string;
  freni?: string;
  ruote?: string;
  peso?: string;
  autonomia?: string;
  forcella?: string;
}

export interface Product {
  id: number;
  slug: string;
  nome_modello: string;
  brand: string;
  categoria: string;
  prezzo: number;
  descrizione_lunga: string;
  caratteristiche_tecniche: CaratteristicheTecniche;
  // Fields for compatibility with existing UI
  nome: string; 
  descrizione: string;
  varianti: string[];
}

const typedProductsData = productsData as any[];

const processedProducts = typedProductsData.map(p => ({
  ...p,
  slug: p.slug || p.nome_modello.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
  nome: p.nome_modello,
  descrizione: p.descrizione_lunga,
  prezzo: p.prezzo || (p.id < 51 ? 3499 : 49),
  varianti: p.varianti || []
})) as Product[];

export function useProducts(filters?: { category?: string; featured?: boolean; bestseller?: boolean }) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      let filtered = [...processedProducts];
      if (filters?.category) {
        filtered = filtered.filter(p => p.categoria === filters.category);
      }
      return filtered;
    },
  });
}

export function useProduct(slug: string | number) {
  return useQuery<Product | null>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const product = processedProducts.find((p) => 
        p.slug === slug || String(p.id) === String(slug)
      );
      return product || null;
    },
    enabled: !!slug,
  });
}
