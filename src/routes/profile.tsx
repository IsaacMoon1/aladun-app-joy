import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronRight, MapPin, CreditCard, Bell, HelpCircle, LogOut, Heart } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Aladùn" }] }),
  component: ProfilePage,
});

const items = [
  { icon: MapPin, label: "Saved addresses" },
  { icon: Heart, label: "Favourites" },
  { icon: CreditCard, label: "Payment methods" },
  { icon: Bell, label: "Notifications" },
  { icon: HelpCircle, label: "Help & support" },
];

function ProfilePage() {
  return (
    <PhoneShell>
      <div className="bg-gradient-brand px-6 pt-14 pb-20 text-primary-foreground">
        <h1 className="text-xl font-extrabold">Profile</h1>
      </div>
      <div className="-mt-12 px-6">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-2xl font-extrabold text-primary">
              IA
            </div>
            <div>
              <p className="text-base font-extrabold">Isaac Adeyemi</p>
              <p className="text-xs text-muted-foreground">isaac@aladun.app</p>
              <p className="mt-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                Gold member
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {items.map(({ icon: Icon, label }) => (
            <li key={label}>
              <button
                onClick={() => toast(label, { description: "This screen is coming soon." })}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold transition active:bg-muted/40"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3.5 text-sm font-bold text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Link>
      </div>
    </PhoneShell>
  );
}
