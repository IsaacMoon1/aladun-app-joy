import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { useCart, cartStore, cartTotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/aladun-data";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Aladùn" }] }),
  component: CartPage,
});

function CartPage() {
  const { items } = useCart();
  const navigate = useNavigate();
  const subtotal = cartTotal(items);
  const delivery = items.length ? 800 : 0;
  const total = subtotal + delivery;

  return (
    <PhoneShell>
      <div className="px-6 pt-12">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-extrabold">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-20 grid place-items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
              <ShoppingBag className="h-9 w-9" />
            </div>
            <p className="mt-5 text-base font-bold">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add a dish to get started.</p>
            <Link
              to="/home"
              className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map(({ dish, qty }) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                >
                  <img src={dish.image} alt={dish.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{dish.name}</p>
                    <p className="text-[11px] text-muted-foreground">{dish.restaurant}</p>
                    <p className="mt-1 text-sm font-extrabold text-primary">
                      {formatNaira(dish.price * qty)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => cartStore.remove(dish.id)}
                      className="text-muted-foreground"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 rounded-full border border-border px-1.5 py-1">
                      <button
                        onClick={() => cartStore.setQty(dish.id, qty - 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold">{qty}</span>
                      <button
                        onClick={() => cartStore.setQty(dish.id, qty + 1)}
                        className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-card">
              <Row label="Subtotal" value={formatNaira(subtotal)} />
              <Row label="Delivery" value={formatNaira(delivery)} />
              <div className="my-3 h-px bg-border" />
              <Row label="Total" value={formatNaira(total)} bold />
            </div>

            <button
              onClick={() => {
                cartStore.clear();
                navigate({ to: "/order" });
              }}
              className="mt-5 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-brand transition active:scale-[0.98]"
            >
              Place order · {formatNaira(total)}
            </button>
          </>
        )}
      </div>
    </PhoneShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${bold ? "text-base" : "text-sm"}`}>
      <span className={bold ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-extrabold text-primary" : "font-semibold"}>{value}</span>
    </div>
  );
}
