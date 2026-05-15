import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { dishes, formatNaira } from "@/lib/aladun-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [{ title: "Search — Aladùn" }],
  }),
  component: SearchPage,
});

const trending = ["Jollof", "Pepper Soup", "Suya", "Amala", "Fried Rice"];

function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = q
    ? dishes.filter(
        (d) =>
          d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.restaurant.toLowerCase().includes(q.toLowerCase()),
      )
    : [];

  return (
    <PhoneShell>
      <div className="px-6 pt-12">
        <h1 className="text-xl font-extrabold">Search</h1>
        <div className="mt-4 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What do you want to eat?"
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {!q && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Trending
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {q && (
          <div className="mt-6 space-y-3">
            {results.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No dishes match "{q}".
              </p>
            ) : (
              results.map((d) => (
                <Link
                  key={d.id}
                  to="/restaurant/$dishId"
                  params={{ dishId: d.id }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                >
                  <img src={d.image} alt={d.name} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{d.name}</p>
                    <p className="text-[11px] text-muted-foreground">{d.restaurant}</p>
                  </div>
                  <span className="text-sm font-extrabold text-primary">{formatNaira(d.price)}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </PhoneShell>
  );
}
