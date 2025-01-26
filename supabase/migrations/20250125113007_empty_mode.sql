/*
  # Material Listing System Schema

  1. New Tables
    - `material_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `parent_id` (uuid, self-reference for subcategories)
      - `description` (text)
      - `created_at` (timestamp)

    - `material_listings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category_id` (uuid, references material_categories)
      - `subcategory_id` (uuid, references material_categories)
      - `quantity` (numeric)
      - `unit` (text)
      - `condition` (text)
      - `price` (numeric)
      - `price_unit` (text)
      - `location` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `certification_urls` (text[])
      - `image_urls` (text[])
      - `user_id` (uuid, references auth.users)
      - `business_name` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `material_bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `listing_id` (uuid, references material_listings)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Create material categories table
CREATE TABLE IF NOT EXISTS material_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES material_categories(id),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create material listings table
CREATE TABLE IF NOT EXISTS material_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES material_categories(id) NOT NULL,
  subcategory_id uuid REFERENCES material_categories(id),
  quantity numeric NOT NULL,
  unit text NOT NULL,
  condition text NOT NULL,
  price numeric NOT NULL,
  price_unit text NOT NULL,
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  certification_urls text[] DEFAULT '{}',
  image_urls text[] DEFAULT '{}',
  user_id uuid REFERENCES auth.users NOT NULL,
  business_name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create material bookmarks table
CREATE TABLE IF NOT EXISTS material_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  listing_id uuid REFERENCES material_listings(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS
ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_bookmarks ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON material_categories FOR SELECT
  TO authenticated
  USING (true);

-- Listings policies
CREATE POLICY "Anyone can read published listings"
  ON material_listings FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Users can create listings"
  ON material_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON material_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON material_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can read own bookmarks"
  ON material_bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON material_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON material_bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add some initial categories
INSERT INTO material_categories (name, slug, description) VALUES
  ('Plastics', 'plastics', 'All types of plastic materials'),
  ('Metals', 'metals', 'Metal scraps and materials'),
  ('Paper', 'paper', 'Paper and cardboard materials'),
  ('Textiles', 'textiles', 'Fabric and textile materials'),
  ('Glass', 'glass', 'Glass materials and products'),
  ('Electronics', 'electronics', 'Electronic components and devices'),
  ('Organic', 'organic', 'Organic and biodegradable materials'),
  ('Construction', 'construction', 'Construction and demolition materials');

-- Add some subcategories
DO $$
DECLARE
  plastics_id uuid;
  metals_id uuid;
  paper_id uuid;
BEGIN
  SELECT id INTO plastics_id FROM material_categories WHERE slug = 'plastics';
  SELECT id INTO metals_id FROM material_categories WHERE slug = 'metals';
  SELECT id INTO paper_id FROM material_categories WHERE slug = 'paper';

  INSERT INTO material_categories (name, slug, parent_id, description) VALUES
    ('PET', 'pet', plastics_id, 'Polyethylene terephthalate plastics'),
    ('HDPE', 'hdpe', plastics_id, 'High-density polyethylene plastics'),
    ('PVC', 'pvc', plastics_id, 'Polyvinyl chloride plastics'),
    ('Steel', 'steel', metals_id, 'Steel scraps and materials'),
    ('Aluminum', 'aluminum', metals_id, 'Aluminum scraps and materials'),
    ('Copper', 'copper', metals_id, 'Copper scraps and materials'),
    ('Cardboard', 'cardboard', paper_id, 'Cardboard materials'),
    ('Newspaper', 'newspaper', paper_id, 'Newspaper materials'),
    ('Office Paper', 'office-paper', paper_id, 'Office paper materials');
END $$;