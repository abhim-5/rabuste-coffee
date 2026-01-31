-- Update products_with_ratings_view to include is_rabuste_special field
-- This allows the API to fetch and return the is_rabuste_special flag

CREATE OR REPLACE VIEW public.products_with_ratings_view AS
WITH rating_stats AS (
    SELECT 
        menu_item_id,
        COUNT(*) as vote_count,
        AVG(rating) as rating_avg
    FROM 
        public.product_ratings
    GROUP BY 
        menu_item_id
)
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.image_url,
    p.available,
    p.created_by,
    p.created_at,
    p.updated_at,
    p.variations,
    -- Ignore the static rating column from p
    -- p.rating, 
    -- p.review_count,
    p.original_price,
    p.is_featured,
    p.sort_order,
    p.discount_price,
    p.crossed_price,
    p.is_deal_of_day,
    p.deal_expiry,
    p.display_order,
    p.is_rabuste_special,  -- NEW: Added to support Rabuste Special section
    
    -- Calculated Real Stats
    COALESCE(rs.vote_count, 0) as real_vote_count,
    COALESCE(rs.rating_avg, 0) as raw_rating_avg,
    
    -- Bayesian Weighted Score (m=10, C=3.5)
    CASE 
        WHEN COALESCE(rs.vote_count, 0) = 0 THEN 0 -- Return 0 for new products so we can show "New" or 0 stars
        ELSE 
            ( (COALESCE(rs.vote_count, 0)::numeric / (COALESCE(rs.vote_count, 0) + 10)::numeric) * COALESCE(rs.rating_avg, 0)::numeric ) + 
            ( (10::numeric / (COALESCE(rs.vote_count, 0) + 10)::numeric) * 3.5 )
    END as weighted_rating

FROM 
    public.products p
    LEFT JOIN rating_stats rs ON p.id::text = rs.menu_item_id;

-- Grant access to public (or authenticated) as needed
GRANT SELECT ON public.products_with_ratings_view TO anon, authenticated, service_role;

-- Verify the view includes is_rabuste_special
SELECT 
    name, 
    category, 
    is_rabuste_special,
    COALESCE(is_rabuste_special, false) as is_special_check
FROM products_with_ratings_view 
WHERE is_rabuste_special = true;
