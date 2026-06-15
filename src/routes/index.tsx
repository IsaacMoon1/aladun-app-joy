import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authStore } from "@/lib/auth-store";
import jollof from "@/assets/jollof.jpg";
import scooter from "@/assets/scooter.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aladùn — Nigerian Dishes Delivered" },
      {
        name: "description",
        content:
          "Order authentic Nigerian dishes from local kitchens, delivered hot to your doorstep.",
      },
      { property: "og:title", content: "Aladùn — Nigerian Dishes Delivered" },
      {
        property: "og:description",
        content:
          "Order authentic Nigerian dishes from local kitchens, delivered hot to your doorstep.",
      },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (authStore.hasAccount()) {
      const ok = authStore.signIn();
      if (ok) {
        toast.success("Welcome back 👋");
        navigate({ to: "/home" });
        return;
      }
    }
    navigate({ to: "/auth", search: { mode: "signup" } });
  };

  return (
    <div className="min-h-dvh bg-muted/40 md:py-10">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-gradient-brand md:min-h-[860px] md:rounded-[2.75rem] md:shadow-brand">
        <div className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col px-7 pt-16 pb-10 text-primary-foreground">
          <header className="flex items-center justify-between animate-fade-up">
            <span className="font-extrabold text-xl tracking-tight">Aladùn</span>
            <button
              onClick={() => navigate({ to: "/home" })}
              className="text-xs font-semibold text-primary-foreground/70 hover:text-primary-foreground"
            >
              Skip
            </button>
          </header>

          <div className="mx-auto mt-10 animate-pop">
            <div className="relative h-56 w-56 rounded-full bg-primary-foreground/10 p-2 ring-1 ring-primary-foreground/20 backdrop-blur-sm">
              <img
                src={jollof}
                alt="Jollof rice"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="mt-10 space-y-3 text-center animate-fade-up [animation-delay:120ms]">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70">
              ALÁDÙN
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-balance">
              Order Nigerian Dishes
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Delivered hot, fresh, and joyfully to your doorstep.
            </p>
          </div>

          <div className="relative mt-6 flex justify-center animate-fade-up [animation-delay:200ms]">
            <img src={scooter} alt="" className="h-32 w-auto drop-shadow-xl" />
          </div>

          <div className="mt-auto space-y-3 animate-fade-up [animation-delay:280ms]">
            <button
              onClick={handleGetStarted}
              className="block w-full rounded-2xl bg-primary-foreground py-4 text-center text-sm font-bold text-primary shadow-xl transition-transform active:scale-[0.98]"
            >
              Get Started
            </button>
            <p className="text-center text-xs text-primary-foreground/70">
              Already have an account?{" "}
              <button
                onClick={() => navigate({ to: "/auth", search: { mode: "signin" } })}
                className="font-semibold text-primary-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
