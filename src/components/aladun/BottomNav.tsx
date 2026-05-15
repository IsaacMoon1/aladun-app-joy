import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { items } = useCart();
  const count = cartCount(items);
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-3xl border border-border/60 bg-surface/90 px-4 py-3 shadow-card backdrop-blur-xl">
      <ul className="flex items-center justify-between">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to === "/home" && pathname === "/home");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`relative mx-auto flex w-full flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                  {to === "/cart" && count > 0 && (
                    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
                {active && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
