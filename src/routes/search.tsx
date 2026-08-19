import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/aladun/States";
import { searchProductsQuery, formatNaira, imageFor } from "@/lib/catalog";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Aladùn" },
      { name: "description", content: "Search Nigerian dishes and local kitchens on Aladùn." },
      { property: "og:title", content: "Search — Aladùn" },
      { property: "og:description", content: "Search Nigerian dishes and local kitchens on Aladùn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

const trending = ["Jollof", "Pepper Soup", "Suya", "Amala", "Fried Rice"];

function SearchPage() {
  const [q, setQ] = useState("");
  const results = useQuery(searchProductsQuery(q));

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
              aria-label="Clear search"
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
          <div className="mt-6">
            {results.isPending ? (
              <ListSkeleton />
            ) : results.isError ? (
              <ErrorState message={results.error.message} onRetry={() => results.refetch()} />
            ) : results.data.length === 0 ? (
              <EmptyState title={`No dishes match "${q}"`} hint="Try a different spelling." />
            ) : (
              <div className="space-y-3">
                {results.data.map((d) => (
                  <Link
                    key={d.id}
                    to="/restaurant/$dishId"
                    params={{ dishId: d.slug }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                  >
                    {imageFor(d.image_key) && (
                      <img
                        src={imageFor(d.image_key)}
                        alt={d.name}
                        loading="lazy"
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-bold">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">{d.vendor?.name}</p>
                    </div>
                    <span className="text-sm font-extrabold text-primary">
                      {formatNaira(d.price_kobo)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PhoneShell>
  );
}
