import { Link } from "react-router-dom";
import fenixLogo from "@/assets/fenix-logo.jpg";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={fenixLogo} alt="Fenix Sport" className="h-10 w-10 rounded-sm object-cover" />
              <span className="fenix-heading text-lg tracking-wider">FENIX SPORT</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Engineered for the arena. Premium sports equipment for athletes who demand excellence.
            </p>
          </div>
          <div>
            <h4 className="fenix-heading text-xs tracking-widest mb-4">SHOP</h4>
            <div className="flex flex-col gap-2">
              {["Running", "Basketball", "Tennis", "Fitness", "Boxing"].map((c) => (
                <Link key={c} to={`/products?category=${c.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="fenix-heading text-xs tracking-widest mb-4">SUPPORT</h4>
            <div className="flex flex-col gap-2">
              {["Contact Us", "Shipping", "Returns", "Size Guide", "FAQ"].map((c) => (
                <span key={c} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="fenix-heading text-xs tracking-widest mb-4">NEWSLETTER</h4>
            <p className="text-sm text-muted-foreground mb-4">Get early access to new gear and exclusive offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="flex-1 bg-secondary/50 border border-border px-3 py-2 text-xs tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold tracking-widest clip-slant">
                JOIN
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 FENIX SPORT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <span key={l} className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
