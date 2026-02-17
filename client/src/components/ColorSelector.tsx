import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  'blu': '#0000FF',
  'rosso': '#FF0000',
  'nero': '#000000',
  'grigio': '#808080',
  'verde': '#008000',
  'bianco': '#FFFFFF',
  'arancione': '#FFA500',
};

interface ColorSelectorProps {
  productId: number;
  variants: string[];
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  size?: 'sm' | 'md';
  showBase?: boolean;
}

export function ColorSelector({ 
  productId, 
  variants, 
  selectedColor, 
  onColorSelect,
  size = 'sm',
  showBase = true
}: ColorSelectorProps) {
  if (!variants || variants.length === 0) return null;

  const dotSize = size === 'sm' ? 'w-4 h-4' : 'w-8 h-8';

  return (
    <div className={cn("flex flex-wrap gap-2 mt-2", size === 'md' && "mb-4")}>
      {/* Base point represented as the product ID image */}
      {showBase && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onColorSelect(null);
          }}
          className={cn(
            "rounded-full border-2 transition-all hover:scale-110",
            dotSize,
            !selectedColor ? "border-primary ring-2 ring-primary/20" : "border-transparent"
          )}
          style={{ backgroundColor: '#E5E7EB' }}
          title="Originale"
          data-testid={`button-color-base-${productId}`}
        />
      )}

      {variants.map((color) => {
        const colorValue = COLOR_MAP[color.toLowerCase()];
        
        return (
          <button
            key={color}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onColorSelect(color);
            }}
            className={cn(
              "rounded-full border-2 transition-all hover:scale-110",
              dotSize,
              selectedColor === color ? "border-primary ring-2 ring-primary/20" : "border-transparent"
            )}
            style={{ backgroundColor: colorValue }}
            title={color}
            data-testid={`button-color-${color}-${productId}`}
          />
        );
      })}
    </div>
  );
}
