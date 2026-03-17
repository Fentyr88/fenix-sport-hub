import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, ArrowLeft, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "payment" | "confirmed">("info");
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", zip: "", country: "",
    cardNumber: "", cardExpiry: "", cardCvc: "",
  });

  const update = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    setStep("confirmed");
    clearCart();
  };

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">YOUR CART IS EMPTY</p>
        <Link to="/products" className="text-primary text-xs tracking-widest hover:underline">BROWSE EQUIPMENT →</Link>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md p-12 border border-border">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="fenix-heading text-2xl mb-4">ORDER CONFIRMED</h1>
          <p className="text-sm text-muted-foreground mb-2">ORDER #FX-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          <p className="text-sm text-muted-foreground mb-8">Your gear is being prepared for dispatch. You'll receive a confirmation email shortly.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all">
            CONTINUE SHOPPING
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> CONTINUE SHOPPING
        </Link>

        <h1 className="fenix-heading text-3xl mb-12">CHECKOUT</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-12">
          {["info", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
                step === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>{i + 1}</span>
              <span className={`text-xs tracking-widest ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === "info" ? "SHIPPING" : "PAYMENT"}
              </span>
              {i === 0 && <span className="w-8 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "info" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <input placeholder="EMAIL" value={formData.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="FIRST NAME" value={formData.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
                  <input placeholder="LAST NAME" value={formData.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
                </div>
                <input placeholder="ADDRESS" value={formData.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
                <div className="grid grid-cols-3 gap-4">
                  <input placeholder="CITY" value={formData.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
                  <input placeholder="ZIP" value={formData.zip} onChange={(e) => update("zip", e.target.value)} className={inputClass} />
                  <input placeholder="COUNTRY" value={formData.country} onChange={(e) => update("country", e.target.value)} className={inputClass} />
                </div>
                <button onClick={() => setStep("payment")} className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all mt-4">
                  CONTINUE TO PAYMENT
                </button>
              </motion.div>
            )}
            {step === "payment" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-xs tracking-widest">CARD DETAILS</span>
                </div>
                <input placeholder="CARD NUMBER" value={formData.cardNumber} onChange={(e) => update("cardNumber", e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM / YY" value={formData.cardExpiry} onChange={(e) => update("cardExpiry", e.target.value)} className={inputClass} />
                  <input placeholder="CVC" value={formData.cardCvc} onChange={(e) => update("cardCvc", e.target.value)} className={inputClass} />
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => setStep("info")} className="flex-1 border border-border text-foreground py-3 text-xs font-bold tracking-widest hover:border-primary transition-colors">
                    BACK
                  </button>
                  <button onClick={handleConfirm} className="flex-1 bg-primary text-primary-foreground py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> PAY ${total().toFixed(2)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div className="border border-border p-6 h-fit">
            <h3 className="text-xs font-bold tracking-widest mb-6">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                  <span className="tabular-nums">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">SUBTOTAL</span>
                <span className="tabular-nums">${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">SHIPPING</span>
                <span className="text-primary">{total() > 99 ? "FREE" : "$9.99"}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                <span>TOTAL</span>
                <span className="tabular-nums">${(total() + (total() > 99 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
