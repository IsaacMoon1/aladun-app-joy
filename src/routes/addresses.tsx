import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, MapPin, Home, Briefcase, Plus, Check, Trash2 } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";

export const Route = createFileRoute("/addresses")({
  head: () => ({ meta: [{ title: "Saved Addresses — Aladùn" }] }),
  component: AddressesPage,
});

type Addr = { id: string; label: string; line: string; icon: typeof Home; tag: "home" | "work" | "other" };

const initial: Addr[] = [
  { id: "1", label: "Home", line: "12 Awolowo Road, Bodija, Ibadan", icon: Home, tag: "home" },
  { id: "2", label: "Work", line: "Cocoa House, Dugbe, Ibadan", icon: Briefcase, tag: "work" },
  { id: "3", label: "Mum's Place", line: "5 Oluyole Estate, Ibadan", icon: MapPin, tag: "other" },
];

function AddressesPage() {
  const [list, setList] = useState(initial);
  const [active, setActive] = useState("1");

  return (
    <PhoneShell showNav={false}>
      <Header title="Saved Addresses" />
      <div className="px-6 mt-2 space-y-3">
        {list.map((a) => {
          const Icon = a.icon;
          const isActive = active === a.id;
          return (
            <button
              key={a.id}
              onClick={() => {
                setActive(a.id);
                toast(`${a.label} set as default`);
              }}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                isActive ? "border-primary bg-primary-soft/40" : "border-border bg-card"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">{a.label}</p>
                  {isActive && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.line}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setList((l) => l.filter((x) => x.id !== a.id));
                  toast("Address removed");
                }}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </button>
          );
        })}

        <button
          onClick={() => {
            const next = { id: String(Date.now()), label: "New Address", line: "Tap to edit details", icon: MapPin, tag: "other" as const };
            setList((l) => [...l, next]);
            toast("Address added", { description: "You can edit this in the next update." });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-bold text-primary"
        >
          <Plus className="h-4 w-4" /> Add new address
        </button>
      </div>
    </PhoneShell>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-12 pb-4">
      <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card border border-border">
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-lg font-extrabold">{title}</h1>
    </div>
  );
}
