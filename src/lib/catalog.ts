import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { images } from "./aladun-data";

/** Image assets are bundled locally; the DB stores only the key. */
export const imageFor = (key: string | null | undefined) =>
  (key && (images as Record<string, string>)[key]) || undefined;

export const formatNaira = (kobo: number) =>
  "₦" + Math.round(kobo / 100).toLocaleString("en-NG");

export type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  sort_order: number;
};

export type Vendor = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  area: string;
  city: string;
  delivery_minutes_min: number;
  delivery_minutes_max: number;
  rating: number | null;
  rating_count: number;
  image_key: string | null;
  description: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_kobo: number;
  unit: string;
  unit_amount: number | null;
  rating: number | null;
  rating_count: number;
  image_key: string | null;
  category_id: string | null;
  vendor: Pick<Vendor, "id" | "slug" | "name" | "area"> | null;
};

const PRODUCT_SELECT =
  "id, slug, name, description, price_kobo, unit, unit_amount, rating, rating_count, image_key, category_id, vendor:vendors!inner(id, slug, name, area)";

export const categoriesQuery = (pillar: "chop" | "market" = "chop") =>
  queryOptions({
    queryKey: ["categories", pillar],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, name, emoji, sort_order")
        .eq("pillar", pillar)
        .order("sort_order");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

export const productsQuery = (opts: { categoryId?: string | null } = {}) =>
  queryOptions({
    queryKey: ["products", opts.categoryId ?? "all"],
    queryFn: async (): Promise<Product[]> => {
      let q = supabase.from("products").select(PRODUCT_SELECT).order("name");
      if (opts.categoryId) q = q.eq("category_id", opts.categoryId);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Product[];
    },
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data ?? null) as unknown as Product | null;
    },
  });

export const vendorsQuery = (pillar: "chop" | "market" = "chop") =>
  queryOptions({
    queryKey: ["vendors", pillar],
    queryFn: async (): Promise<Vendor[]> => {
      const { data, error } = await supabase
        .from("vendors")
        .select(
          "id, slug, name, kind, area, city, delivery_minutes_min, delivery_minutes_max, rating, rating_count, image_key, description",
        )
        .eq("pillar", pillar)
        .order("rating", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

export const searchProductsQuery = (term: string) =>
  queryOptions({
    queryKey: ["products", "search", term],
    enabled: term.trim().length > 0,
    queryFn: async (): Promise<Product[]> => {
      const t = term.trim();
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .ilike("name", `%${t}%`)
        .order("name");
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Product[];
    },
  });
