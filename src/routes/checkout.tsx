import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Wallet, CreditCard, Banknote, Check } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { useCart, cartTotal, cartStore } from "@/lib/cart-store";
import { formatNaira } from "@/lib/aladun-data";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Aladùn" }] }),
  component: CheckoutPage,
});

const methods = [
  { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard, Verve", icon: CreditCard },
  { id: "transfer", label: "Bank Transfer", sub: "Pay with your bank app", icon: Banknote },
  { id: "wallet", label: "Aladùn Wallet", sub: "Balance: ₦12,500", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", sub: "Pay the rider on arrival", icon: Banknote },
];

function CheckoutPage() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);

  const subtotal = cartTotal(items);
  const delivery = items.length ? 800 : 0;
  const serviceFee = items.length ? 150 : 0;
  const total = subtotal + delivery + serviceFee;

  const placeOrder = () => {
    if (!items.length) return;
    setPlacing(true);
    setTimeout(() => {
      cartStore.clear();
      navigate({ to: "/track" });
    }, 900);
  };

  return (
    <PhoneShell>
      <div className="px-6 pt-12">
        <div className="flex items-center gap-3">
          <Link to="/cart" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-extrabold">Checkout</h1>
        </div>

        {/* Delivery address */}
        <section className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Delivery address
          </p>
          <div className="mt-2 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Home · Bodija</p>
              <p className="text-xs text-muted-foreground">
                12 Awolowo Avenue, Bodija Estate, Ibadan
              </p>
            </div>
            <button className="text-xs font-bold text-primary">Change</button>
          </div>
        </section>

        {/* Order summary */}
        <section className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Order summary
          </p>
          <div className="mt-2 rounded-2xl border border-border bg-card p-4 shadow-card">
            {items.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Your cart is empty.{" "}
                <Link to="/home" className="font-bold text-primary">
                  Browse menu
                </Link>
              </p>
            ) : (
              <>
                <ul className="space-y-2.5">
                  {items.map(({ dish, qty }) => (
                    <li key={dish.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">
                        <span className="font-bold text-primary">{qty}×</span>{" "}
                        <span className="font-medium">{dish.name}</span>
                      </span>
                      <span className="font-semibold">{formatNaira(dish.price * qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="my-3 h-px bg-border" />
                <Row label="Subtotal" value={formatNaira(subtotal)} />
                <Row label="Delivery" value={formatNaira(delivery)} />
                <Row label="Service fee" value={formatNaira(serviceFee)} />
                <div className="my-2 h-px bg-border" />
                <Row label="Total" value={formatNaira(total)} bold />
              </>
            )}
          </div>
        </section>

        {/* Payment method */}
        <section className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Payment method
          </p>
          <div className="mt-2 space-y-2">
            {methods.map(({ id, label, sub, icon: Icon }) => {
              const active = method === id;
              return (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                    active
                      ? "border-primary bg-primary-soft shadow-brand"
                      : "border-border bg-card"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <button
          disabled={!items.length || placing}
          onClick={placeOrder}
          className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-brand transition active:scale-[0.98] disabled:opacity-50"
        >
          {placing ? "Processing payment…" : `Pay ${formatNaira(total)}`}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          By paying, you agree to Aladùn's Terms of Service.
        </p>
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
