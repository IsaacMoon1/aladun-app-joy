import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import scooter from "@/assets/scooter.png";

export const Route = createFileRoute("/order")({
  head: () => ({ meta: [{ title: "Order Placed — Aladùn" }] }),
  component: OrderPage,
});

function OrderPage() {
  return (
    <PhoneShell>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-foreground text-background animate-pop">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-primary animate-fade-up [animation-delay:80ms]">
          Order Placed!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground animate-fade-up [animation-delay:140ms]">
          Your food will arrive soon. We'll keep you updated.
        </p>

        <img
          src={scooter}
          alt=""
          className="mt-8 h-40 w-auto animate-fade-up [animation-delay:200ms]"
        />

        <div className="mt-8 w-full max-w-xs space-y-2 animate-fade-up [animation-delay:260ms]">
          <Link to="/track" className="block w-full rounded-2xl bg-primary py-4 text-center text-sm font-bold text-primary-foreground shadow-brand">
            Track Order
          </Link>
          <Link
            to="/home"
            className="block w-full rounded-2xl border border-border bg-card py-4 text-sm font-bold"
          >
            Back to home
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
