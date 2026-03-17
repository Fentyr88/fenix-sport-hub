import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products, categories } from "@/lib/data";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (categoryParam && p.category !== categoryParam) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [categoryParam, priceRange, sortBy]);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-primary text-xs tracking-[0.3em] mb-2">CATALOG</p>
          <h1 className="fenix-heading text-3xl sm:text-4xl">
            {categoryParam ? categories.find((c) => c.id === categoryParam)?.name?.toUpperCase() || "ALL EQUIPMENT" : "ALL EQUIPMENT"}
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> FILTERS
            </button>
            {categoryParam && (
              <button
                onClick={() => setSearchParams({})}
                className="flex items-center gap-1 text-xs tracking-widest bg-secondary px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {categoryParam.toUpperCase()} <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground tabular-nums">{filtered.length} RESULTS</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary border border-border px-3 py-1.5 text-xs tracking-wider text-foreground focus:border-primary focus:outline-none transition-colors"
            >
              <option value="featured">FEATURED</option>
              <option value="price-asc">PRICE: LOW → HIGH</option>
              <option value="price-desc">PRICE: HIGH → LOW</option>
              <option value="rating">TOP RATED</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {filtersOpen && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-56 flex-shrink-0 space-y-8"
            >
              <div>
                <h3 className="text-xs font-bold tracking-widest mb-4">CATEGORY</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSearchParams({})}
                    className={`block text-xs tracking-wider transition-colors ${!categoryParam ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    ALL
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSearchParams({ category: cat.id })}
                      className={`block text-xs tracking-wider transition-colors ${categoryParam === cat.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {cat.name.toUpperCase()} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-widest mb-4">PRICE RANGE</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-20 bg-secondary border border-border px-2 py-1 text-xs tabular-nums text-foreground focus:border-primary focus:outline-none"
                  />
                  <span className="text-muted-foreground text-xs">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-20 bg-secondary border border-border px-2 py-1 text-xs tabular-nums text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </motion.aside>
          )}

          {/* Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-24">
                <p className="text-muted-foreground text-sm">NO PRODUCTS FOUND</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
