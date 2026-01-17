-- Product Variations Support
-- Run this to add variations/options to products

-- Add JSONB column for variations
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variations jsonb DEFAULT '[]'::jsonb;

-- Example variations structure:
-- [
--   {
--     "id": "size",
--     "name": "Size",
--     "required": true,
--     "options": [
--       {"id": "small", "name": "Small", "priceModifier": 0},
--       {"id": "large", "name": "Large", "priceModifier": 10}
--     ]
--   }
-- ]

-- Update some products with size variations
-- These are examples - you can modify based on your needs

UPDATE products 
SET variations = '[
  {
    "id": "size",
    "name": "Size",
    "required": false,
    "options": [
      {"id": "regular", "name": "Regular", "priceModifier": 0},
      {"id": "large", "name": "Large", "priceModifier": 20}
    ]
  }
]'::jsonb
WHERE category IN ('hot-drinks', 'cold-drinks') 
AND name NOT LIKE '%Small%' 
AND name NOT LIKE '%Large%';

-- Add temperature variation for drinks that can be hot or cold
UPDATE products 
SET variations = variations || '[
  {
    "id": "temperature",
    "name": "Temperature",
    "required": false,
    "options": [
      {"id": "normal", "name": "Normal", "priceModifier": 0},
      {"id": "extra-hot", "name": "Extra Hot", "priceModifier": 0},
      {"id": "with-ice", "name": "With Ice", "priceModifier": 10}
    ]
  }
]'::jsonb
WHERE category = 'hot-drinks';

COMMENT ON COLUMN products.variations IS 'Product variations as JSON array';
