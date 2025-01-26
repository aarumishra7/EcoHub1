export type MaterialCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  created_at: string;
};

export type MaterialSubCategory = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  created_at: string;
};

export type MaterialListing = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  subcategory_id: string | null;
  quantity: number;
  unit: string;
  condition: 'new' | 'used' | 'recycled';
  price: number;
  price_unit: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  certification_urls: string[];
  image_urls: string[];
  user_id: string;
  business_name: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
};

export type MaterialSearchFilters = {
  query?: string;
  categories?: string[];
  subcategories?: string[];
  condition?: MaterialListing['condition'];
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'distance';
};