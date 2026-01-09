-- Supabase Storage Image Organization Guide
-- NOTE: Folders in Storage are created automatically when you upload files with paths
-- You don't need SQL to create folders - just upload with the correct path!

-- STORAGE STRUCTURE
-- Your 'products' bucket will have this structure after uploading:
--
-- products/
-- ├── robusta-cold/
-- │   ├── robusta-iced-americano.png
-- │   ├── robusta-iced-espresso.png
-- │   ├── iced-espresso-special.png
-- │   ├── cranberry-tonic.png
-- │   ├── robusta-iced-latte.png
-- │   └── ... (15 images total)
-- ├── robusta-hot/
-- │   ├── robusta-hot-americano.png
-- │   ├── robusta-hot-espresso.png
-- │   └── ... (6 images total)
-- ├── blend-cold/
-- │   └── ... (11 images total)
-- ├── blend-hot/
-- │   └── ... (6 images total)
-- ├── manual-brew/
-- │   └── ... (3 images total)
-- ├── shakes-tea/
-- │   └── ... (7 images total)
-- └── food/
--     └-- ... (11 images total)

-- HOW TO UPLOAD IMAGES:

-- Option 1: Via Supabase Dashboard
-- 1. Go to Storage → products bucket
-- 2. Click "Upload file"
-- 3. When uploading, specify path like: robusta-cold/robusta-iced-latte.png
-- 4. The folder "robusta-cold" is automatically created!

-- Option 2: Via API (for bulk upload)
-- Use the upload API with path parameter
-- Example: supabase.storage.from('products').upload('robusta-cold/item.png', file)

-- NAMING CONVENTION:
-- Category folders match exactly from menu.json id field:
-- - "robusta-cold" (NOT "robusta-specialty-cold")
-- - "robusta-hot"
-- - "blend-cold"
-- - "blend-hot"
-- - "manual-brew"
-- - "shakes-tea"
-- - "food"

-- FILENAME CONVENTION:
-- Item name converted to lowercase with hyphens:
-- "Robusta Iced Americano" → robusta-iced-americano.png
-- "Iced Espresso Special" → iced-espresso-special.png
-- "Hot Latte" → hot-latte.png
-- Special characters removed: & ( ) → removed

-- IMPORTANT: All images MUST be .png format

-- CHECKLIST FOR EACH CATEGORY:
-- [ ] robusta-cold (15 images)
-- [ ] robusta-hot (6 images)
-- [ ] blend-cold (11 images)
-- [ ] blend-hot (6 images)
-- [ ] manual-brew (3 images)
-- [ ] shakes-tea (7 images)
-- [ ] food (11 images)

-- TOTAL: 59 images needed
