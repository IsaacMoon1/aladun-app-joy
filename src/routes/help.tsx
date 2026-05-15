import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronDown, Phone, Mail, MessageCircle, HelpCircle } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Support — Aladùn" }] }),
  component: HelpPage,
});

const faqs = [
  { q: "How long does delivery take?", a: "Most orders arrive within 25–40 minutes depending on your area in Ibadan." },
  { q: "How can I pay?", a: "We accept Aladùn Wallet, debit/credit cards, bank transfer, and cash on delivery." },
  { q: "Can I cancel an order?", a: "Yes — you can cancel within 2 minutes of placing the order from the tracking screen." },
  { q: "Is there a minimum order?", a: "There's no minimum order, but we apply a small ₦150 service fee on orders below ₦2,000." },
  { q: "Do you deliver outside Ibadan?", a: "Currently we deliver across Ibadan. Lagos and Abuja are coming very soon." },
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PhoneShell showNav={false}>
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card border border-border">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-extrabold">Help & Support</h1>
      </div>

      <div className="px-6">
        <div className="rounded-3xl bg-gradient-brand p-5 text-primary-foreground shadow-brand">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-foreground/15">
            <HelpCircle className="h-6 w-6" />
          </div>
          <p className="mt-3 text-base font-extrabold">How can we help you?</p>
          <p className="text-xs opacity-90">Our team is available 8am – 11pm, every day.</p>
        </div>
      </div>

      <div className="px-6 mt-5 grid grid-cols-3 gap-3">
        <button
          onClick={() => toast("Calling support…", { description: "+234 800 ALADUN" })}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
            <Phone className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-bold">Call</span>
        </button>
        <button
          onClick={() => toast("Live chat opening…")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
            <MessageCircle className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-bold">Chat</span>
        </button>
        <button
          onClick={() => toast("Email copied", { description: "help@aladun.app" })}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
            <Mail className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-bold">Email</span>
        </button>
      </div>

      <div className="px-6 mt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Frequently asked</p>
        <div className="mt-3 space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full rounded-2xl border border-border bg-card p-4 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold">{f.q}</p>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </div>
                {isOpen && <p className="mt-2 text-xs text-muted-foreground">{f.a}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </PhoneShell>
  );
}
