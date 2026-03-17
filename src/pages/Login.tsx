import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import fenixLogo from "@/assets/fenix-logo.jpg";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const inputClass = "w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <img src={fenixLogo} alt="Fenix Sport" className="h-16 w-16 mx-auto mb-4 rounded-sm object-cover" />
          <h1 className="fenix-heading text-2xl">{isRegister ? "CREATE ACCOUNT" : "WELCOME BACK"}</h1>
          <p className="text-xs text-muted-foreground mt-2">
            {isRegister ? "Join the arena" : "Sign in to your account"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="FIRST NAME" className={inputClass} />
              <input placeholder="LAST NAME" className={inputClass} />
            </div>
          )}
          <input type="email" placeholder="EMAIL" className={inputClass} />
          <input type="password" placeholder="PASSWORD" className={inputClass} />
          {isRegister && <input type="password" placeholder="CONFIRM PASSWORD" className={inputClass} />}

          <button className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all">
            {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider"
          >
            {isRegister ? "ALREADY HAVE AN ACCOUNT? SIGN IN" : "NEW HERE? CREATE ACCOUNT"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest">
            ← BACK TO STORE
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
