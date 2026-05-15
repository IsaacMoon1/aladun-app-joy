import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Bell, Tag, Bike, Receipt } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Aladùn" }] }),
  component: NotificationsPage,
});

type Notif = { id: string; title: string; body: string; time: string; icon: typeof Bell; tone: "promo" | "order" | "system" };

const initial: Notif[] = [
  { id: "1", title: "🎉 Free delivery unlocked", body: "Enjoy free delivery on your next 3 orders.", time: "Just now", icon: Tag, tone: "promo" },
  { id: "2", title: "Your rider is on the way", body: "Tunde A. picked up your Jollof order.", time: "12m ago", icon: Bike, tone: "order" },
  { id: "3", title: "Order delivered", body: "Egusi & Pounded Yam — enjoy your meal!", time: "Yesterday", icon: Receipt, tone: "order" },
  { id: "4", title: "Weekend special 🔥", body: "30% off all swallow orders this Saturday.", time: "2 days ago", icon: Tag, tone: "promo" },
];

const toneColor = {
  promo: "bg-accent/15 text-accent",
  order: "bg-primary-soft text-primary",
  system: "bg-muted text-foreground",
} as const;

function NotificationsPage() {
  const [list, setList] = useState(initial);
  const [read, setRead] = useState<string[]>([]);

  return (
    <PhoneShell showNav={false}>
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card border border-border">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-extrabold">Notifications</h1>
        </div>
        <button
          onClick={() => setRead(list.map((n) => n.id))}
          className="text-xs font-bold text-primary"
        >
          Mark all read
        </button>
      </div>

      {list.length === 0 ? (
        <div className="px-6 mt-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
            <Bell className="h-8 w-8" />
          </div>
          <p className="mt-4 text-sm font-bold">You're all caught up</p>
          <p className="text-xs text-muted-foreground">No new notifications right now.</p>
        </div>
      ) : (
        <ul className="px-5 space-y-2">
          {list.map((n) => {
            const Icon = n.icon;
            const isRead = read.includes(n.id);
            return (
              <li
                key={n.id}
                onClick={() => setRead((r) => (r.includes(n.id) ? r : [...r, n.id]))}
                className={`flex gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                  isRead ? "border-border bg-card" : "border-primary/30 bg-primary-soft/30"
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneColor[n.tone]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold">{n.title}</p>
                    {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[10px] font-semibold text-muted-foreground">{n.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PhoneShell>
  );
}
