import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/lib/data";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative overflow-hidden bg-secondary border border-border"
    >
      <Link to={`/products/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold tracking-widest px-2 py-1">
              SALE
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">{product.brand}</p>
            <h3 className="fenix-heading text-base">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-primary tabular-nums font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground text-xs tabular-nums line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <motion.button
        onClick={handleAdd}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-3 right-3 p-2 transition-all duration-200 ${
          added
            ? "bg-primary text-primary-foreground"
            : "bg-background/80 text-foreground opacity-0 group-hover:opacity-100"
        } backdrop-blur-sm border border-border`}
      >
        <ShoppingCart className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
