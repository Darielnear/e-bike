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
  nome_modello: string;
  brand: string;
  categoria: string;
  prezzo?: number; // Added to match previous logic if needed, though JSON has it missing in snippet
  descrizione_lunga: string;
  caratteristiche_tecniche: CaratteristicheTecniche;
  // Fields for compatibility with existing UI
  nome?: string; 
  descrizione?: string;
  varianti?: string[];
}

export function useProducts(filters?: { category?: string; featured?: boolean; bestseller?: boolean }) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      let filtered = [...productsData] as any[];
      
      // Map JSON fields to UI fields for compatibility
      filtered = filtered.map(p => ({
        ...p,
        nome: p.nome_modello,
        descrizione: p.descrizione_lunga,
        prezzo: p.prezzo || (p.id < 50 ? 3499 : 49), // Fallback prices if missing in JSON
        varianti: p.varianti || []
      }));

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
      // Find by slug (string) or id (number)
      const product = productsData.find((p: any) => 
        p.slug === slug || String(p.id) === String(slug)
      );
      
      if (!product) return null;

      return {
        ...product,
        nome: product.nome_modello,
        descrizione: product.descrizione_lunga,
        prezzo: product.prezzo || (product.id < 50 ? 3499 : 49),
        varianti: product.varianti || []
      } as Product;
    },
    enabled: !!slug,
  });
}
