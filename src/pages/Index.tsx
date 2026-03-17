import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products, categories } from "@/lib/data";
import heroBg from "@/assets/hero-bg.jpg";

const featured = products.filter((p) => p.featured);

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Athlete sprinting"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary text-xs tracking-[0.3em] mb-6"
          >
            PREMIUM SPORTS EQUIPMENT
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fenix-heading text-4xl sm:text-6xl lg:text-7xl leading-[0.95]"
          >
            ENGINEERED FOR
            <br />
            <span className="text-primary">THE ARENA</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground mt-6 max-w-lg mx-auto text-sm leading-relaxed"
          >
            Precision-crafted gear for athletes who demand maximum performance. Every product tested, every detail refined.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all"
            >
              SHOP NOW <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?category=running"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3 text-xs font-bold tracking-widest hover:border-primary hover:text-primary transition-all"
            >
              EXPLORE RUNNING
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "PERFORMANCE TESTED", desc: "Every product lab-tested for peak performance" },
            { icon: Shield, title: "2-YEAR WARRANTY", desc: "Full coverage on all equipment purchases" },
            { icon: Truck, title: "FREE DISPATCH", desc: "Complimentary shipping on orders over $99" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 border border-border"
            >
              <f.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold tracking-widest mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-[15vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-xs tracking-[0.3em] mb-2">CURATED SELECTION</p>
              <h2 className="fenix-heading text-3xl sm:text-4xl">FEATURED GEAR</h2>
            </div>
            <Link
              to="/products"
              className="text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-[15vh] border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <p className="text-primary text-xs tracking-[0.3em] mb-2">BROWSE BY</p>
          <h2 className="fenix-heading text-3xl sm:text-4xl mb-12">CATEGORIES</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="block p-6 border border-border hover:border-primary transition-colors group"
                >
                  <h3 className="fenix-heading text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 tabular-nums">{cat.count} ITEMS</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[15vh] border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="fenix-heading text-3xl sm:text-5xl mb-6"
          >
            READY TO <span className="text-primary">DOMINATE</span>?
          </motion.h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Join thousands of athletes who trust Fenix Sport for their training and competition gear.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all"
          >
            SHOP ALL GEAR <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
