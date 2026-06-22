import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { authStore } from "@/lib/auth-store";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signin" ? "signin" : "signup") as "signin" | "signup",
  }),
  head: () => ({ meta: [{ title: "Welcome — Aladùn" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { mode } = useSearch({ from: "/auth" });
  const [tab, setTab] = useState<"signup" | "signin">(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "signup") {
      if (!name || !email || !password) return toast("Please fill all fields");
      if (password.length < 6) return toast("Password must be at least 6 characters");
      authStore.signUp({ name, email, phone });
      toast.success(`Welcome to Aladùn, ${name.split(" ")[0]}!`);
      navigate({ to: "/home" });
    } else {
      if (!email || !password) return toast("Enter email and password");
      const ok = authStore.signIn();
      if (!ok) {
        toast("No account found. Please sign up first.");
        setTab("signup");
        return;
      }
      toast.success("Welcome back 👋");
      navigate({ to: "/home" });
    }
  };

  return (
    <div className="min-h-dvh bg-muted/40 md:py-10">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-background md:min-h-[860px] md:rounded-[2.75rem] md:border md:border-border md:shadow-card">
        <div className="bg-gradient-brand px-6 pt-12 pb-10 text-primary-foreground">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: "/" })}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/25 overflow-hidden">
                <img src={aladunLogo.url} alt="Aladùn logo" className="h-full w-full object-cover" />
              </span>
              <span className="font-extrabold text-lg tracking-tight">Aladùn</span>
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold">
            {tab === "signup" ? "Create account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm opacity-90">
            {tab === "signup"
              ? "Join Aladùn and order delicious meals."
              : "Sign in to keep enjoying your favourites."}
          </p>
        </div>

        <div className="flex-1 px-6 pt-6 pb-8">
          <div className="flex gap-1 rounded-2xl bg-muted/60 p-1">
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                tab === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setTab("signin")}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                tab === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {tab === "signup" && (
              <>
                <InputField icon={<User className="h-4 w-4" />} placeholder="Full name" value={name} onChange={setName} />
                <InputField icon={<Phone className="h-4 w-4" />} placeholder="Phone (optional)" value={phone} onChange={setPhone} type="tel" />
              </>
            )}
            <InputField icon={<Mail className="h-4 w-4" />} placeholder="Email address" value={email} onChange={setEmail} type="email" />
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-border bg-card pl-11 pr-11 py-3.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center text-muted-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {tab === "signin" && (
              <button
                type="button"
                onClick={() => toast("Reset link sent to your email")}
                className="ml-auto block text-xs font-bold text-primary"
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-brand transition active:scale-[0.98]"
            >
              {tab === "signup" ? "Create my account" : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR CONTINUE WITH <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                authStore.signUp({ name: "Guest User", email: "guest@aladun.app" });
                toast.success("Signed in with Google");
                navigate({ to: "/home" });
              }}
              className="rounded-2xl border border-border bg-card py-3 text-xs font-bold"
            >
              Google
            </button>
            <button
              onClick={() => {
                authStore.signUp({ name: "Guest User", email: "guest@aladun.app" });
                toast.success("Signed in with Apple");
                navigate({ to: "/home" });
              }}
              className="rounded-2xl border border-border bg-card py-3 text-xs font-bold"
            >
              Apple
            </button>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            By continuing you agree to Aladùn's{" "}
            <Link to="/" className="font-bold text-primary">Terms</Link> and{" "}
            <Link to="/" className="font-bold text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
