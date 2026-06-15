import { useSyncExternalStore } from "react";

export type PartnerStatus = "pending" | "approved" | "rejected";

export type MenuItemDraft = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export type Partner = {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  area: string;
  address: string;
  cuisine: string;
  description: string;
  logo?: string;
  cover?: string;
  menu: MenuItemDraft[];
  status: PartnerStatus;
  submittedAt: number;
};

let state: { partners: Partner[] } = {
  partners: [
    {
      id: "p-seed-1",
      storeName: "Iya Basira Kitchen",
      ownerName: "Basira Olamide",
      phone: "+234 803 555 0123",
      email: "basira@iyabasira.ng",
      area: "Bodija",
      address: "12 Awolowo Avenue, Bodija, Ibadan",
      cuisine: "Yoruba / Swallow",
      description: "Authentic amala, ewedu and gbegiri served fresh daily.",
      menu: [
        { id: "m1", name: "Amala + Ewedu", price: 2500 },
        { id: "m2", name: "Pounded Yam + Egusi", price: 3500 },
      ],
      status: "pending",
      submittedAt: Date.now() - 1000 * 60 * 60 * 6,
    },
    {
      id: "p-seed-2",
      storeName: "Suya Republic",
      ownerName: "Musa Bello",
      phone: "+234 706 555 0199",
      email: "musa@suyarepublic.ng",
      area: "Mokola",
      address: "5 Queen Elizabeth Rd, Mokola, Ibadan",
      cuisine: "Grill / Northern",
      description: "Premium beef and chicken suya, hand grilled with yaji.",
      menu: [
        { id: "m1", name: "Beef Suya Plate", price: 3000 },
        { id: "m2", name: "Chicken Tsire", price: 3500 },
      ],
      status: "pending",
      submittedAt: Date.now() - 1000 * 60 * 60 * 28,
    },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const partnerStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  submit: (p: Omit<Partner, "id" | "status" | "submittedAt">) => {
    const partner: Partner = {
      ...p,
      id: "p-" + Math.random().toString(36).slice(2, 9),
      status: "pending",
      submittedAt: Date.now(),
    };
    state = { partners: [partner, ...state.partners] };
    emit();
    return partner;
  },
  setStatus: (id: string, status: PartnerStatus) => {
    state = {
      partners: state.partners.map((p) => (p.id === id ? { ...p, status } : p)),
    };
    emit();
  },
};

export function usePartners() {
  return useSyncExternalStore(
    partnerStore.subscribe,
    partnerStore.getState,
    partnerStore.getState
  );
}
