import { supabase } from './supabase';
import type { MaterialListing } from '../types/materials';

interface MatchmakingParams {
  userId: string;
  categoryId?: string;
  location?: {
    latitude: number;
    longitude: number;
    maxDistance?: number; // in kilometers
  };
  priceRange?: {
    min: number;
    max: number;
  };
  quantity?: {
    min: number;
    max: number;
  };
  businessType?: 'business' | 'financial';
  timeFrame?: {
    start: Date;
    end: Date;
  };
}

interface MatchResult {
  listing: MaterialListing;
  score: number;
  distance?: number; // in kilometers
  timeRelevance?: number; // 0-1 score based on listing age
}

export const findMatches = async (params: MatchmakingParams): Promise<MatchResult[]> => {
  try {
    // Get user's interaction history and preferences
    const [{ data: userHistory }, { data: userProfile }] = await Promise.all([
      supabase
        .from('material_bookmarks')
        .select('listing_id, created_at')
        .eq('user_id', params.userId),
      supabase
        .from('profiles')
        .select('*')
        .eq('id', params.userId)
        .single()
    ]);

    // Base query for material listings
    let query = supabase
      .from('material_listings')
      .select(`
        *,
        profiles!material_listings_user_id_fkey (
          user_type,
          business_name,
          verification_status
        )
      `)
      .eq('status', 'published')
      .neq('user_id', params.userId); // Exclude user's own listings

    // Apply filters
    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }

    if (params.priceRange) {
      if (params.priceRange.min !== undefined) {
        query = query.gte('price', params.priceRange.min);
      }
      if (params.priceRange.max !== undefined) {
        query = query.lte('price', params.priceRange.max);
      }
    }

    if (params.quantity) {
      if (params.quantity.min !== undefined) {
        query = query.gte('quantity', params.quantity.min);
      }
      if (params.quantity.max !== undefined) {
        query = query.lte('quantity', params.quantity.max);
      }
    }

    if (params.timeFrame) {
      query = query
        .gte('created_at', params.timeFrame.start.toISOString())
        .lte('created_at', params.timeFrame.end.toISOString());
    }

    const { data: listings, error } = await query;
    if (error) throw error;

    // Calculate scores and sort matches
    const matches: MatchResult[] = listings.map((listing: MaterialListing & { profiles: any }) => {
      let score = 0;
      const now = new Date();
      const listingDate = new Date(listing.created_at);

      // Location score (if coordinates available)
      let distance: number | undefined;
      if (params.location && listing.latitude && listing.longitude) {
        distance = calculateDistance(
          params.location.latitude,
          params.location.longitude,
          listing.latitude,
          listing.longitude
        );
        const maxDistance = params.location.maxDistance || 100;
        score += Math.max(0, 1 - (distance / maxDistance)) * 30;
      }

      // Time relevance score (newer listings get higher scores)
      const timeRelevance = Math.max(0, 1 - (now.getTime() - listingDate.getTime()) / (30 * 24 * 60 * 60 * 1000)); // 30 days max
      score += timeRelevance * 20;

      // Business type matching score
      if (params.businessType && listing.profiles.user_type === params.businessType) {
        score += 15;
      }

      // Verification status bonus
      if (listing.profiles.verification_status === 'approved') {
        score += 10;
      }

      // User interaction history score
      if (userHistory) {
        const interactions = userHistory.filter(h => h.listing_id === listing.id);
        const interactionScore = interactions.reduce((sum, interaction) => {
          const interactionAge = now.getTime() - new Date(interaction.created_at).getTime();
          return sum + Math.max(0, 1 - (interactionAge / (7 * 24 * 60 * 60 * 1000))); // 7 days relevance
        }, 0);
        score += interactionScore * 15;
      }

      // Price competitiveness score
      const avgPrice = listings.reduce((sum, l) => sum + l.price, 0) / listings.length;
      score += Math.max(0, 1 - (listing.price / avgPrice)) * 10;

      return {
        listing,
        score,
        distance,
        timeRelevance
      };
    });

    // Sort by score (highest first)
    return matches.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
};

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};