import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Clock, CheckCircle2, Bike } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { dishes, formatNaira } from "@/lib/aladun-data";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Aladùn" }] }),
  component: OrdersPage,
});

const orders = [
  { id: "ALD-4821", status: "active" as const, dish: dishes[0], qty: 2, when: "Arriving in 18 mins" },
  { id: "ALD-4720", status: "delivered" as const, dish: dishes[1], qty: 1, when: "Yesterday · 7:42 pm" },
  { id: "ALD-4612", status: "delivered" as const, dish: dishes[3], qty: 1, when: "12 May · 1:10 pm" },
  { id: "ALD-4531", status: "delivered" as const, dish: dishes[5], qty: 3, when: "08 May · 8:55 pm" },
];

const statusMeta = {
  active: { label: "On the way", icon: Bike, cls: "bg-accent/15 text-accent" },
  delivered: { label: "Delivered", icon: CheckCircle2, cls: "bg-primary-soft text-primary" },
} as const;

function OrdersPage() {
  return (
    <PhoneShell showNav={false}>
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card border border-border">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-extrabold">My Orders</h1>
      </div>

      <div className="px-6 space-y-3">
        {orders.map((o) => {
          const M = statusMeta[o.status];
          const Icon = M.icon;
          const total = o.dish.price * o.qty;
          return (
            <Link
              key={o.id}
              to="/track"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition active:scale-[0.99]"
            >
              <img src={o.dish.image} alt={o.dish.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold line-clamp-1">{o.dish.name}</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${M.cls}`}>
                    <Icon className="h-3 w-3" /> {M.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">#{o.id} · Qty {o.qty}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {o.when}
                  </span>
                  <span className="text-xs font-extrabold text-primary">{formatNaira(total)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </PhoneShell>
  );
}
