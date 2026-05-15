import { useSyncExternalStore } from "react";
import { dishes, type Dish } from "./aladun-data";

export type CartItem = { dish: Dish; qty: number };

let state: { items: CartItem[] } = { items: [] };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const cartStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  add: (dishId: string) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;
    const existing = state.items.find((i) => i.dish.id === dishId);
    state = {
      items: existing
        ? state.items.map((i) => (i.dish.id === dishId ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { dish, qty: 1 }],
    };
    emit();
  },
  remove: (dishId: string) => {
    state = { items: state.items.filter((i) => i.dish.id !== dishId) };
    emit();
  },
  setQty: (dishId: string, qty: number) => {
    if (qty <= 0) return cartStore.remove(dishId);
    state = {
      items: state.items.map((i) => (i.dish.id === dishId ? { ...i, qty } : i)),
    };
    emit();
  },
  clear: () => {
    state = { items: [] };
    emit();
  },
};

export function useCart() {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getState,
    cartStore.getState
  );
}

export const cartTotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.dish.price * i.qty, 0);
export const cartCount = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.qty, 0);
