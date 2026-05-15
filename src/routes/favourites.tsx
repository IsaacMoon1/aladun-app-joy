import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Heart, Star, Plus } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { dishes, formatNaira } from "@/lib/aladun-data";
import { cartStore } from "@/lib/cart-store";

export const Route = createFileRoute("/favourites")({
  head: () => ({ meta: [{ title: "Favourites — Aladùn" }] }),
  component: FavouritesPage,
});

function FavouritesPage() {
  const [favs, setFavs] = useState<string[]>(["jollof", "amala", "peppersoup", "egusi"]);
  const items = dishes.filter((d) => favs.includes(d.id));

  return (
    <PhoneShell showNav={false}>
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-card border border-border">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-extrabold">Favourites</h1>
      </div>

      {items.length === 0 ? (
        <div className="px-6 mt-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
            <Heart className="h-8 w-8" />
          </div>
          <p className="mt-4 text-sm font-bold">No favourites yet</p>
          <p className="text-xs text-muted-foreground">Tap the heart icon on any dish to save it here.</p>
          <Link to="/home" className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground">
            Browse dishes
          </Link>
        </div>
      ) : (
        <div className="px-6 grid grid-cols-2 gap-3">
          {items.map((d) => (
            <div key={d.id} className="rounded-2xl border border-border bg-card p-2 shadow-card">
              <Link to="/restaurant/$dishId" params={{ dishId: d.id }} className="block">
                <div className="relative h-24 w-full overflow-hidden rounded-xl">
                  <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFavs((f) => f.filter((x) => x !== d.id));
                      toast(`Removed ${d.name} from favourites`);
                    }}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-surface/90 text-destructive"
                    aria-label="Remove favourite"
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
              </Link>
              <div className="mt-2 px-1 pb-1">
                <p className="line-clamp-1 text-xs font-bold">{d.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Star className="h-2.5 w-2.5 fill-accent text-accent" /> {d.rating}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-primary">{formatNaira(d.price)}</span>
                  <button
                    onClick={() => {
                      cartStore.add(d.id);
                      toast(`Added ${d.name} to cart`);
                    }}
                    className="grid h-6 w-6 place-items-center rounded-full bg-foreground text-background"
                    aria-label="Add to cart"
                  >
                    <Plus className="h-3 w-3" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PhoneShell>
  );
}
