CREATE TYPE public.pillar AS ENUM ('chop','market','send');
CREATE TYPE public.vendor_kind AS ENUM ('restaurant','bukka','home_kitchen','supermarket','grocery','pharmacy','livestock');
CREATE TYPE public.approval_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.product_unit AS ENUM ('piece','kg','pack','bundle');

CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  pillar public.pillar NOT NULL DEFAULT 'chop',
  kind public.vendor_kind NOT NULL DEFAULT 'restaurant',
  area text NOT NULL,
  city text NOT NULL DEFAULT 'Ibadan',
  delivery_minutes_min int NOT NULL DEFAULT 20,
  delivery_minutes_max int NOT NULL DEFAULT 40,
  rating numeric(2,1),
  rating_count int NOT NULL DEFAULT 0,
  image_key text,
  description text,
  approval_status public.approval_status NOT NULL DEFAULT 'pending',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  emoji text,
  pillar public.pillar NOT NULL DEFAULT 'chop',
  sort_order int NOT NULL DEFAULT 0,
  UNIQUE (pillar, slug)
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price_kobo bigint NOT NULL CHECK (price_kobo >= 0),
  unit public.product_unit NOT NULL DEFAULT 'piece',
  unit_amount numeric(10,2),
  rating numeric(2,1),
  rating_count int NOT NULL DEFAULT 0,
  image_key text,
  is_available boolean NOT NULL DEFAULT true,
  is_popular boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_vendor ON public.products(vendor_id);
CREATE INDEX idx_products_category ON public.products(category_id);

GRANT SELECT ON public.vendors TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.vendors TO service_role;
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved vendors are publicly viewable"
  ON public.vendors FOR SELECT TO anon, authenticated
  USING (approval_status = 'approved' AND is_active = true);

CREATE POLICY "Categories are publicly viewable"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Available products of approved vendors are publicly viewable"
  ON public.products FOR SELECT TO anon, authenticated
  USING (
    is_available = true AND EXISTS (
      SELECT 1 FROM public.vendors v
      WHERE v.id = products.vendor_id
        AND v.approval_status = 'approved'
        AND v.is_active = true
    )
  );

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.categories (slug, name, emoji, pillar, sort_order) VALUES
  ('swallow','Swallow','🥣','chop',1),
  ('rice','Rice','🍚','chop',2),
  ('soup','Soup','🍲','chop',3),
  ('grill','Grill','🍢','chop',4);

INSERT INTO public.vendors (slug, name, pillar, kind, area, city, delivery_minutes_min, delivery_minutes_max, rating, rating_count, image_key, description, approval_status) VALUES
  ('aladun-kitchen','Aladun Kitchen','chop','restaurant','Bodija','Ibadan',20,30,4.8,412,'jollof','Party jollof and rice specialists in Bodija.','approved'),
  ('deli-pepper-soup','Deli Pepper Soup','chop','restaurant','Sango','Ibadan',25,35,4.7,268,'peppersoup','Catfish and goat pepper soup, served hot.','approved'),
  ('mama-t-buka','Mama T Buka','chop','bukka','Bodija','Ibadan',15,25,4.7,530,'amala','Classic Ibadan buka: amala, ewedu, gbegiri.','approved'),
  ('ogbono-home','Ogbono Home','chop','home_kitchen','Eleyele','Ibadan',30,40,4.9,187,'egusi','Home kitchen serving pounded yam and rich soups.','approved'),
  ('madam-t','Madam T','chop','restaurant','Mokola','Ibadan',20,30,4.4,231,'suya','Suya spot grilling fresh beef and chicken nightly.','approved');

INSERT INTO public.products (slug, vendor_id, category_id, name, description, price_kobo, unit, rating, rating_count, image_key, is_popular)
SELECT p.slug, v.id, c.id, p.name, p.description, p.price_kobo, 'piece'::public.product_unit, p.rating, p.rating_count, p.image_key, true
FROM (VALUES
  ('jollof','aladun-kitchen','rice','Party Jollof','Smoky party-style jollof rice with grilled chicken and fried plantain.',350000::bigint,4.9,318,'jollof'),
  ('amala','mama-t-buka','swallow','Amala + Ewedu','Soft amala paired with ewedu and assorted meat in rich gbegiri.',250000,4.7,402,'amala'),
  ('peppersoup','deli-pepper-soup','soup','Catfish Pepper Soup','Fiery, aromatic catfish pepper soup - the perfect comfort bowl.',400000,4.8,196,'peppersoup'),
  ('egusi','ogbono-home','swallow','Pounded Yam & Egusi','Hand-pounded yam served with rich egusi and assorted meat.',450000,4.9,151,'egusi'),
  ('friedrice','aladun-kitchen','rice','Special Fried Rice','Vegetable fried rice with shrimp and grilled chicken breast.',380000,4.6,143,'friedrice'),
  ('suya','madam-t','grill','Beef Suya Plate','Spicy grilled beef skewers, sliced onions and fresh tomatoes.',300000,4.7,209,'suya')
) AS p(slug, vendor_slug, category_slug, name, description, price_kobo, rating, rating_count, image_key)
JOIN public.vendors v ON v.slug = p.vendor_slug
JOIN public.categories c ON c.slug = p.category_slug AND c.pillar = 'chop';