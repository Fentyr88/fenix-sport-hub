import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import fenixLogo from "@/assets/fenix-logo.jpg";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import * as authApi from "@/api/authApi";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const inputClass = "w-full bg-secondary/50 border border-border px-4 py-3 text-sm tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
      }),
    []
  );

  const registerSchema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          email: z.string().email("Invalid email"),
          phone: z.string().optional(),
          password: z.string().min(6, "Password must be at least 6 characters"),
          confirmPassword: z.string().min(1, "Confirm your password"),
        })
        .refine((v) => v.password === v.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    []
  );

  const onLoginSubmit = async (form: HTMLFormElement) => {
    const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "";
    const password = (form.elements.namedItem("password") as HTMLInputElement | null)?.value ?? "";

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast({
        title: "Invalid form",
        description: parsed.error.issues[0]?.message ?? "Please check your input.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await authApi.login(parsed.data);
    setIsSubmitting(false);

    if (!result.ok) {
      toast({
        title: "Sign in failed",
        description: result.error.message,
        variant: "destructive",
      });
      return;
    }

    const token = authApi.extractToken(result.data);
    if (token) {
      setToken(token);
    }

    toast({
      title: "Signed in",
      description: token ? "Session started." : "Signed in, but no token was returned by the API.",
    });
    navigate("/");
  };

  const onRegisterSubmit = async (form: HTMLFormElement) => {
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement | null)?.value ?? "";
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement | null)?.value ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "";
    const phone = (form.elements.namedItem("phone") as HTMLInputElement | null)?.value ?? "";
    const password = (form.elements.namedItem("password") as HTMLInputElement | null)?.value ?? "";
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement | null)?.value ?? "";

    const parsed = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      toast({
        title: "Invalid form",
        description: parsed.error.issues[0]?.message ?? "Please check your input.",
        variant: "destructive",
      });
      return;
    }

    const payload: authApi.RegisterPayload = {
      nombre: `${parsed.data.firstName} ${parsed.data.lastName}`.trim(),
      email: parsed.data.email,
      password: parsed.data.password,
      telefono: parsed.data.phone,
    };

    setIsSubmitting(true);
    const result = await authApi.register(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      toast({
        title: "Registration failed",
        description: result.error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created",
      description: "You can now sign in.",
    });
    setIsRegister(false);
  };

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

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (isRegister) void onRegisterSubmit(form);
            else void onLoginSubmit(form);
          }}
        >
          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="FIRST NAME" className={inputClass} autoComplete="given-name" />
              <input name="lastName" placeholder="LAST NAME" className={inputClass} autoComplete="family-name" />
            </div>
          )}

          <input name="email" type="email" placeholder="EMAIL" className={inputClass} autoComplete="email" />
          <input name="password" type="password" placeholder="PASSWORD" className={inputClass} autoComplete={isRegister ? "new-password" : "current-password"} />

          {isRegister && (
            <>
              <input name="confirmPassword" type="password" placeholder="CONFIRM PASSWORD" className={inputClass} autoComplete="new-password" />
              <input name="phone" placeholder="PHONE (OPTIONAL)" className={inputClass} autoComplete="tel" />
            </>
          )}

          <button
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 text-xs font-bold tracking-widest clip-slant hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "PLEASE WAIT..." : isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
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
