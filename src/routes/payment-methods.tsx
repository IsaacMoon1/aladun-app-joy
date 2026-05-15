import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, CreditCard, Wallet, Building2, Plus, Check, Trash2 } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";

export const Route = createFileRoute("/payment-methods")({
  head: () => ({ meta: [{ title: "Payment Methods — Aladùn" }] }),
  component: PaymentMethodsPage,
});

type Method = { id: string; type: "card" | "bank" | "wallet"; label: string; sub: string };

const initial: Method[] = [
  { id: "w1", type: "wallet", label: "Aladùn Wallet", sub: "Balance: ₦12,500" },
  { id: "c1", type: "card", label: "GTBank Mastercard", sub: "•••• 4521 · 09/27" },
  { id: "c2", type: "card", label: "Access Bank Visa", sub: "•••• 8842 · 03/28" },
  { id: "b1", type: "bank", label: "Bank Transfer", sub: "USSD or app transfer" },
];

const iconFor = { card: CreditCard, bank: Building2, wallet: Wallet } as const;

function PaymentMethodsPage() {
  const [list, setList] = useState(initial);
  const [active, setActive] = useState("w1");

  return (
    <PhoneShell showNav={false}>
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card border border-border">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-extrabold">Payment Methods</h1>
      </div>

      <div className="px-6">
        <div className="rounded-3xl bg-gradient-brand p-5 text-primary-foreground shadow-brand">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Wallet balance</p>
          <p className="mt-1 text-3xl font-extrabold">₦12,500</p>
          <button
            onClick={() => toast("Top up coming soon")}
            className="mt-3 rounded-full bg-primary-foreground px-4 py-1.5 text-xs font-bold text-primary"
          >
            Top up wallet
          </button>
        </div>
      </div>

      <div className="px-6 mt-5 space-y-3">
        {list.map((m) => {
          const Icon = iconFor[m.type];
          const isActive = active === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setActive(m.id);
                toast(`${m.label} set as default`);
              }}
              className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                isActive ? "border-primary bg-primary-soft/40" : "border-border bg-card"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">{m.sub}</p>
              </div>
              {isActive ? (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setList((l) => l.filter((x) => x.id !== m.id));
                    toast("Removed");
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </button>
          );
        })}

        <button
          onClick={() => toast("Add card flow coming soon")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-bold text-primary"
        >
          <Plus className="h-4 w-4" /> Add new card
        </button>
      </div>
    </PhoneShell>
  );
}
