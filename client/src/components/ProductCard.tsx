import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { ColorSelector } from "./ColorSelector";
import type { Product } from "@/hooks/use-products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [baseImageValid, setBaseImageValid] = useState(true);

  const currentImage = (selectedColor && !imageError)
    ? `/img/${product.id}_${selectedColor}.jpg` 
    : `/img/${product.id}.jpg`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    const cartProduct = {
      id: product.id,
      name: product.nome,
      price: product.prezzo,
      mainImage: currentImage,
      category: product.categoria,
      shortDescription: product.descrizione
    };
    addItem(cartProduct as any);
    toast({
      title: "Aggiunto al carrello",
      description: `${product.nome} è stato aggiunto.`,
      duration: 3000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-xl overflow-hidden border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500"
    >
      <Link href={`/prodotto/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-white flex items-center justify-center p-4">
        <img 
          src={currentImage} 
          alt={product.nome}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (selectedColor && !imageError) {
              setImageError(true);
            } else if (!selectedColor) {
              if (img.src.endsWith('.jpg')) {
                img.src = img.src.replace('.jpg', '.webp');
              } else if (img.src.endsWith('.webp')) {
                img.src = img.src.replace('.webp', '.png');
              } else if (img.src.endsWith('.png')) {
                setBaseImageValid(false);
                if (product.varianti && product.varianti.length > 0) {
                  setSelectedColor(product.varianti[0]);
                }
              }
            }
          }}
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center pb-6">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-white text-foreground hover:bg-primary hover:text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Aggiungi</span>
          </button>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">{product.categoria}</span>
        </div>
        
        <Link href={`/prodotto/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-display text-xl font-bold mb-3 leading-tight min-h-[3rem] line-clamp-2">{product.nome}</h3>
        </Link>
        
        <div className="flex items-center gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" /> 60km
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-primary" /> 2 Anni
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 min-h-[2.5rem] italic leading-relaxed">
          "{product.descrizione}"
        </p>

        <ColorSelector 
          productId={product.id}
          variants={product.varianti || []}
          selectedColor={selectedColor}
          onColorSelect={(color) => {
            setSelectedColor(color);
            setImageError(false);
          }}
          showBase={baseImageValid}
        />
        
        <div className="flex items-end justify-between border-t border-border pt-4 mt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(product.prezzo)}
            </span>
          </div>
          
          <Link 
            href={`/prodotto/${product.id}`} 
            className="text-sm font-semibold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all duration-300"
          >
            Dettagli <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
