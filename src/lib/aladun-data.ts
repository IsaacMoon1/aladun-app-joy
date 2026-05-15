import jollof from "@/assets/jollof.jpg";
import amala from "@/assets/amala.jpg";
import peppersoup from "@/assets/peppersoup.jpg";
import egusi from "@/assets/egusi.jpg";
import friedrice from "@/assets/friedrice.jpg";
import suya from "@/assets/suya.jpg";

export const images = { jollof, amala, peppersoup, egusi, friedrice, suya };

export type Dish = {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description: string;
};

export const categories = [
  { id: "all", name: "All", emoji: "🍽️" },
  { id: "swallow", name: "Swallow", emoji: "🥣" },
  { id: "rice", name: "Rice", emoji: "🍚" },
  { id: "soup", name: "Soup", emoji: "🍲" },
  { id: "grill", name: "Grill", emoji: "🍢" },
];

export const dishes: Dish[] = [
  {
    id: "jollof",
    name: "Party Jollof",
    restaurant: "Aladun Kitchen",
    price: 3500,
    rating: 4.9,
    image: jollof,
    category: "rice",
    description: "Smoky party-style jollof rice with grilled chicken and fried plantain.",
  },
  {
    id: "amala",
    name: "Amala + Ewedu",
    restaurant: "Mama T Buka",
    price: 2500,
    rating: 4.7,
    image: amala,
    category: "swallow",
    description: "Soft amala paired with ewedu and assorted meat in rich gbegiri.",
  },
  {
    id: "peppersoup",
    name: "Catfish Pepper Soup",
    restaurant: "Deli Pepper Soup",
    price: 4000,
    rating: 4.8,
    image: peppersoup,
    category: "soup",
    description: "Fiery, aromatic catfish pepper soup — the perfect comfort bowl.",
  },
  {
    id: "egusi",
    name: "Pounded Yam & Egusi",
    restaurant: "Ogbono Home",
    price: 4500,
    rating: 4.9,
    image: egusi,
    category: "swallow",
    description: "Hand-pounded yam served with rich egusi and assorted meat.",
  },
  {
    id: "friedrice",
    name: "Special Fried Rice",
    restaurant: "Aladun Kitchen",
    price: 3800,
    rating: 4.6,
    image: friedrice,
    category: "rice",
    description: "Vegetable fried rice with shrimp and grilled chicken breast.",
  },
  {
    id: "suya",
    name: "Beef Suya Plate",
    restaurant: "Madam T",
    price: 3000,
    rating: 4.7,
    image: suya,
    category: "grill",
    description: "Spicy grilled beef skewers, sliced onions and fresh tomatoes.",
  },
];

export const restaurants = [
  { id: "aladun-kitchen", name: "Aladun Kitchen", area: "Bodija", time: "20-30 mins", rating: 4.8, image: jollof },
  { id: "deli-pepper-soup", name: "Deli Pepper Soup", area: "Sango", time: "25-35 mins", rating: 4.7, image: peppersoup },
  { id: "mama-t-buka", name: "Mama T Buka", area: "Bodija", time: "15-25 mins", rating: 4.7, image: amala },
  { id: "ogbono-home", name: "Ogbono Home", area: "Eleyele", time: "30-40 mins", rating: 4.9, image: egusi },
  { id: "madam-t", name: "Madam T", area: "Mokola", time: "20-30 mins", rating: 4.4, image: suya },
];

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG");
