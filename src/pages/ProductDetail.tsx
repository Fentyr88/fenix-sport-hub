import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { products } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">PRODUCT NOT FOUND</p>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[3/4] bg-secondary border border-border overflow-hidden"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-2">{product.brand.toUpperCase()}</p>
            <h1 className="fenix-heading text-3xl sm:text-4xl mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-bold tabular-nums">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground tabular-nums line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.originalPrice && (
                <span className="bg-accent text-accent-foreground text-[10px] font-bold tracking-widest px-2 py-1">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Specs */}
            <div className="border-t border-border pt-6 mb-8">
              <h3 className="text-xs font-bold tracking-widest mb-4">SPECIFICATIONS</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs py-2 border-b border-border">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock */}
            <p className={`text-xs tracking-widest mb-6 ${product.stock > 10 ? "text-primary" : "text-accent"}`}>
              {product.stock > 10 ? "READY FOR DISPATCH" : `ONLY ${product.stock} LEFT`}
            </p>

            {/* Add to Cart */}
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest clip-slant transition-all duration-300 ${
                added
                  ? "bg-primary/20 text-primary border border-primary"
                  : "bg-primary text-primary-foreground hover:brightness-110"
              }`}
            >
              {added ? <><Check className="w-4 h-4" /> ADDED TO CART</> : <><ShoppingCart className="w-4 h-4" /> SECURE GEAR</>}
            </motion.button>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-[15vh]">
            <h2 className="fenix-heading text-2xl mb-8">RELATED EQUIPMENT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
