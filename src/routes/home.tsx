import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, MapPin, Search, Star, Plus, Flame, ChevronDown } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { CardSkeletonRow, EmptyState, ErrorState, ListSkeleton } from "@/components/aladun/States";
import {
  categoriesQuery,
  productsQuery,
  vendorsQuery,
  formatNaira,
  imageFor,
} from "@/lib/catalog";
import { cartStore } from "@/lib/cart-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Aladùn" },
      {
        name: "description",
        content: "Order authentic Nigerian food from Ibadan restaurants, bukkas and home kitchens on Aladùn.",
      },
      { property: "og:title", content: "Home — Aladùn" },
      {
        property: "og:description",
        content: "Order authentic Nigerian food from Ibadan restaurants, bukkas and home kitchens on Aladùn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(categoriesQuery());
    context.queryClient.prefetchQuery(productsQuery());
    context.queryClient.prefetchQuery(vendorsQuery());
  },
  component: HomePage,
});

function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useQuery(categoriesQuery());
  const products = useQuery(productsQuery({ categoryId: activeCategory }));
  const vendors = useQuery(vendorsQuery());

  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between animate-fade-up">
          <button
            onClick={() =>
              toast("Address picker coming soon", {
                description: "We'll let you change delivery location here.",
              })
            }
            className="text-left"
          >
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3 w-3" /> Deliver to
            </p>
            <p className="flex items-center gap-1 text-sm font-bold">
              Bodija, Ibadan <ChevronDown className="h-3.5 w-3.5" />
            </p>
          </button>
          <button
            onClick={() => toast("No new notifications", { description: "You're all caught up." })}
            className="relative grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary transition active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight animate-fade-up [animation-delay:60ms]">
          Chop <span className="inline-block animate-pop">🍲</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Hyperlocal Nigerian food, cooked around you in Ibadan.
        </p>

        <Link
          to="/search"
          className="mt-5 flex items-center gap-3 rounded-2xl bg-input/60 px-4 py-3.5 text-sm text-muted-foreground animate-fade-up [animation-delay:120ms]"
        >
          <Search className="h-4 w-4" />
          Search kitchens & dishes
        </Link>
      </div>

      {/* Categories */}
      <section className="mt-7">
        <div className="px-6 flex items-center justify-between">
          <h2 className="text-base font-bold">Categories</h2>
        </div>
        {categories.isPending ? (
          <div className="mt-3 flex gap-3 px-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 w-16 shrink-0 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : categories.isError ? (
          <ErrorState message={categories.error.message} onRetry={() => categories.refetch()} />
        ) : categories.data.length === 0 ? (
          <EmptyState title="No categories yet" />
        ) : (
          <div className="mt-3 flex gap-3 overflow-x-auto px-6 pb-1 no-scrollbar">
            <CategoryChip
              emoji="🍽️"
              name="All"
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            />
            {categories.data.map((c) => (
              <CategoryChip
                key={c.id}
                emoji={c.emoji ?? "🍽️"}
                name={c.name}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular dishes */}
      <section className="mt-7">
        <div className="px-6 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-base font-bold">
            <Flame className="h-4 w-4 text-accent" /> Popular Dishes
          </h2>
          <Link to="/search" className="text-xs font-semibold text-primary">
            View all
          </Link>
        </div>
        {products.isPending ? (
          <div className="mt-3">
            <CardSkeletonRow />
          </div>
        ) : products.isError ? (
          <ErrorState message={products.error.message} onRetry={() => products.refetch()} />
        ) : products.data.length === 0 ? (
          <EmptyState title="No dishes here yet" hint="Try another category." />
        ) : (
          <div className="mt-3 flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar">
            {products.data.map((d) => (
              <Link
                key={d.id}
                to="/restaurant/$dishId"
                params={{ dishId: d.slug }}
                className="group w-44 shrink-0 rounded-3xl border border-border bg-card p-3 shadow-card transition hover:-translate-y-0.5"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-muted">
                  {imageFor(d.image_key) && (
                    <img
                      src={imageFor(d.image_key)}
                      alt={d.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {d.rating !== null && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-surface/95 px-2 py-0.5 text-[10px] font-bold">
                      <Star className="h-3 w-3 fill-accent text-accent" /> {d.rating}
                    </span>
                  )}
                </div>
                <div className="mt-3 px-1">
                  <p className="line-clamp-1 text-sm font-bold">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{d.vendor?.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-primary">
                      {formatNaira(d.price_kobo)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        cartStore.add(d.slug);
                        toast(`Added ${d.name}`, { description: "Item added to your cart." });
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background transition active:scale-90"
                      aria-label="Add to cart"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Vendors */}
      <section className="mt-6 px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Kitchens near you</h2>
          <Link to="/search" className="text-xs font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="mt-3">
          {vendors.isPending ? (
            <ListSkeleton />
          ) : vendors.isError ? (
            <ErrorState message={vendors.error.message} onRetry={() => vendors.refetch()} />
          ) : vendors.data.length === 0 ? (
            <EmptyState title="No kitchens approved yet" hint="Vendors appear once approved." />
          ) : (
            <div className="space-y-3">
              {vendors.data.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                >
                  {imageFor(r.image_key) && (
                    <img
                      src={imageFor(r.image_key)}
                      alt={r.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold text-primary">{r.name}</p>
                      {r.rating !== null && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold">
                          <Star className="h-3 w-3 fill-accent text-accent" /> {r.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {r.area}, {r.city}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 font-semibold text-primary">
                        {r.delivery_minutes_min}-{r.delivery_minutes_max} mins
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold capitalize">
                        {r.kind.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PhoneShell>
  );
}

function CategoryChip({
  emoji,
  name,
  active,
  onClick,
}: {
  emoji: string;
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex shrink-0 flex-col items-center gap-2 transition">
      <span
        className={`grid h-16 w-16 place-items-center rounded-2xl text-2xl transition ${
          active ? "bg-primary text-primary-foreground shadow-brand" : "bg-card border border-border"
        }`}
      >
        {emoji}
      </span>
      <span
        className={`text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
      >
        {name}
      </span>
    </button>
  );
}
