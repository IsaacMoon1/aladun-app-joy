import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Heart, Star, Clock, Minus, Plus } from "lucide-react";
import { PhoneShell } from "@/components/aladun/PhoneShell";
import { dishes, formatNaira } from "@/lib/aladun-data";
import { cartStore } from "@/lib/cart-store";

export const Route = createFileRoute("/restaurant/$dishId")({
  head: ({ params }) => ({
    meta: [{ title: `${params.dishId} — Aladùn` }],
  }),
  component: DishDetail,
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center">Dish not found.</div>
  ),
});

function DishDetail() {
  const { dishId } = Route.useParams();
  const dish = dishes.find((d) => d.id === dishId);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  if (!dish) {
    return (
      <PhoneShell>
        <div className="grid min-h-[60vh] place-items-center px-6 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Dish not found.</p>
            <Link to="/home" className="mt-3 inline-block text-sm font-bold text-primary">
              Back to home
            </Link>
          </div>
        </div>
      </PhoneShell>
    );
  }

  const addAndGo = () => {
    for (let i = 0; i < qty; i++) cartStore.add(dish.id);
    toast(`Added ${qty} × ${dish.name}`, { description: "Heading to your cart." });
    navigate({ to: "/cart" });
  };

  return (
    <PhoneShell>
      <div className="relative h-72">
        <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-12">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-foreground shadow-card backdrop-blur"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setLiked((v) => !v);
              toast(liked ? "Removed from favourites" : "Added to favourites");
            }}
            aria-label="Favourite"
            className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-destructive shadow-card backdrop-blur transition active:scale-90"
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-destructive" : ""}`} />
          </button>
        </div>
      </div>

      <div className="-mt-8 rounded-t-[2rem] bg-background px-6 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">{dish.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{dish.restaurant}</p>
          </div>
          <span className="text-2xl font-extrabold text-primary">{formatNaira(dish.price)}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-bold text-primary">
            <Star className="h-3 w-3 fill-primary" /> {dish.rating}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-bold text-muted-foreground">
            <Clock className="h-3 w-3" /> 25-35 mins
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 font-bold text-accent">
            🔥 Hot
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{dish.description}</p>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Add extras
          </p>
          <div className="mt-3 space-y-2">
            {["Extra meat (₦800)", "Plantain (₦500)", "Chilled drink (₦600)"].map((x) => (
              <label
                key={x}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium"
              >
                {x}
                <input type="checkbox" className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </div>
        </div>

        <div className="my-6 flex items-center justify-between">
          <p className="text-sm font-bold">Quantity</p>
          <div className="flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-8 w-8 place-items-center rounded-full bg-muted"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={addAndGo}
          className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-brand transition active:scale-[0.98]"
        >
          Add to cart · {formatNaira(dish.price * qty)}
        </button>
      </div>
    </PhoneShell>
  );
}
