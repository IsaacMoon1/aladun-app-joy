import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, MapPin, Search, Star, Plus, Flame } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { categories, dishes, restaurants, formatNaira } from "@/lib/aladun-data";
import { cartStore } from "@/lib/cart-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Aladùn" },
      { name: "description", content: "Browse popular dishes and restaurants near you on Aladùn." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? dishes : dishes.filter((d) => d.category === active);

  return (
    <PhoneShell>
      <div className="px-6 pt-12 pb-2">
        <div className="flex items-center justify-between animate-fade-up">
          <div>
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3 w-3" /> Deliver to
            </p>
            <p className="text-sm font-bold">Bodija, Ibadan</p>
          </div>
          <button className="relative grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight animate-fade-up [animation-delay:60ms]">
          Hello, Isaac <span className="inline-block animate-pop">👋</span>
        </h1>
        <p className="text-sm text-muted-foreground">What are you craving today?</p>

        <Link
          to="/search"
          className="mt-5 flex items-center gap-3 rounded-2xl bg-input/60 px-4 py-3.5 text-sm text-muted-foreground animate-fade-up [animation-delay:120ms]"
        >
          <Search className="h-4 w-4" />
          Search restaurants & dishes
        </Link>
      </div>

      {/* Hero promo */}
      <div className="px-6 mt-5 animate-fade-up [animation-delay:160ms]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-5 text-primary-foreground shadow-brand">
          <div className="max-w-[60%]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary-foreground/80">
              Today only
            </p>
            <h3 className="mt-1 text-lg font-extrabold leading-snug">
              Free delivery on your first 3 orders
            </h3>
            <button className="mt-3 rounded-full bg-primary-foreground px-4 py-1.5 text-xs font-bold text-primary">
              Claim offer
            </button>
          </div>
          <div className="pointer-events-none absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-accent/40 blur-2xl" />
          <div className="absolute -right-2 bottom-2 h-24 w-24 rounded-full ring-4 ring-primary-foreground/20 overflow-hidden">
            <img src={dishes[0].image} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mt-7">
        <div className="px-6 flex items-center justify-between">
          <h2 className="text-base font-bold">Categories</h2>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto px-6 pb-1 no-scrollbar">
          {categories.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex shrink-0 flex-col items-center gap-2 transition ${
                  isActive ? "" : "opacity-90"
                }`}
              >
                <span
                  className={`grid h-16 w-16 place-items-center rounded-2xl text-2xl transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-brand"
                      : "bg-card border border-border"
                  }`}
                >
                  {c.emoji}
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular dishes */}
      <section className="mt-7">
        <div className="px-6 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-base font-bold">
            <Flame className="h-4 w-4 text-accent" /> Popular Dishes
          </h2>
          <span className="text-xs font-semibold text-primary">View all</span>
        </div>
        <div className="mt-3 flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar">
          {filtered.map((d) => (
            <Link
              key={d.id}
              to="/restaurant/$dishId"
              params={{ dishId: d.id }}
              className="group w-44 shrink-0 rounded-3xl border border-border bg-card p-3 shadow-card transition hover:-translate-y-0.5"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-muted">
                <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-surface/95 px-2 py-0.5 text-[10px] font-bold">
                  <Star className="h-3 w-3 fill-accent text-accent" /> {d.rating}
                </span>
              </div>
              <div className="mt-3 px-1">
                <p className="line-clamp-1 text-sm font-bold">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.restaurant}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-primary">{formatNaira(d.price)}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      cartStore.add(d.id);
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
      </section>

      {/* Restaurants */}
      <section className="mt-6 px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Popular Restaurants</h2>
          <span className="text-xs font-semibold text-primary">See all</span>
        </div>
        <div className="mt-3 space-y-3">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
            >
              <img
                src={r.image}
                alt={r.name}
                loading="lazy"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-bold text-primary">{r.name}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold">
                    <Star className="h-3 w-3 fill-accent text-accent" /> {r.rating}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{r.area}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 font-semibold text-primary">
                    {r.time}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">Free delivery</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PhoneShell>
  );
}
