import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { ColorSelector } from "@/components/ColorSelector";

export default function ProductDetail() {
  const [match, params] = useRoute("/prodotto/:slug");
  const { data: product, isLoading } = useProduct(params?.slug || "");
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [baseImageValid, setBaseImageValid] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setSelectedColor(null);
      setImageError(false);
      setBaseImageValid(true);
      setQuantity(1);
    }
  }, [product]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center">Prodotto non trovato</div>
  );

  // Determine the extension of the main image
  const currentImage = (selectedColor && !imageError)
    ? `/img/${product.id}_${selectedColor}.jpg` 
    : `/img/${product.id}.jpg`;

  const images = [currentImage];

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.nome,
      price: product.prezzo,
      mainImage: currentImage,
      category: product.categoria,
      shortDescription: product.descrizione
    };
    addItem(cartProduct as any, quantity);
    toast({
      title: "Aggiunto al carrello",
      description: `${quantity}x ${product.nome} aggiunto con successo.`,
    });
  };

  return (
    <div className="container-padding max-w-7xl mx-auto py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/3] w-full bg-secondary/30 rounded-2xl overflow-hidden relative"
          >
            <img 
              src={images[activeImage]} 
              alt={product.nome}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (selectedColor && !imageError) {
                  setImageError(true);
                } else if (!selectedColor) {
                  // If base image fails with all extensions, mark it invalid
                  if (img.src.endsWith('.jpg')) {
                    img.src = img.src.replace('.jpg', '.webp');
                  } else if (img.src.endsWith('.webp')) {
                    img.src = img.src.replace('.webp', '.png');
                  } else if (img.src.endsWith('.png')) {
                    setBaseImageValid(false);
                    // If base image is invalid, and there are variants, select the first variant
                    if (product.varianti && product.varianti.length > 0) {
                      setSelectedColor(product.varianti[0]);
                    }
                  }
                }
              }}
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith('.jpg')) {
                      target.src = target.src.replace('.jpg', '.webp');
                    } else if (target.src.endsWith('.webp')) {
                      target.src = target.src.replace('.webp', '.png');
                    }
                  }}
                />
              </button>
            ))}
          </div>
        </div>

          {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-sm font-bold tracking-widest text-primary uppercase">{product.categoria}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">{product.nome}</h1>
          
          <div className="text-3xl font-bold text-foreground mb-4 flex items-center gap-4">
            {formatCurrency(product.prezzo)}
          </div>

          <div className="bg-secondary/20 p-4 rounded-lg mb-8 border-l-4 border-primary">
            <p className="text-sm font-medium text-foreground leading-relaxed italic">
              "{product.descrizione}"
            </p>
          </div>

          <ColorSelector 
            productId={product.id}
            variants={product.varianti || []}
            selectedColor={selectedColor}
            onColorSelect={(color) => {
              setSelectedColor(color);
              setImageError(false);
            }}
            size="md"
            showBase={baseImageValid}
          />

          {/* Specs Grid */}
          {product.categoria !== 'Accessori & Sicurezza' && product.caratteristiche_tecniche && (
            <div className="grid grid-cols-3 gap-4 mb-10 border-y border-border py-8">
              <div className="text-center">
                <span className="block text-2xl font-bold text-foreground mb-1">{product.caratteristiche_tecniche.autonomia || '60km'}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Autonomia</span>
              </div>
              <div className="text-center border-l border-border px-4">
                <span className="block text-2xl font-bold text-foreground mb-1">{product.caratteristiche_tecniche.batteria || '500Wh'}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Batteria</span>
              </div>
              <div className="text-center border-l border-border">
                <span className="block text-xl font-bold text-foreground mb-1 truncate px-1">{product.caratteristiche_tecniche.motore || '250W'}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Motore</span>
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="sticky bottom-6 z-20 mt-12 lg:relative lg:bottom-0 lg:mt-0">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-border lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0 lg:backdrop-blur-none">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border bg-white rounded-xl h-14 w-full sm:w-32 px-4 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary h-14 flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" /> Acquista Ora — {formatCurrency(product.prezzo * quantity)}
                </button>
              </div>
            </div>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-foreground" />
              <span>Spedizione gratuita in 24/48h</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-foreground" />
              <span>Garanzia ufficiale 2 anni</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-foreground" />
              <span>Batteria Long-Range inclusa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
