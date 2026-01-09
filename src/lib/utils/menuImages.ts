/**
 * Supabase Storage Image URL Utilities
 * Generates image URLs for menu items stored in category-organized buckets
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Converts item name to storage-safe slug
 * Example: "Robusta Iced Latte" → "robusta-iced-latte"
 */
export function itemNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/[()&]/g, '')          // remove special chars
    .replace(/--+/g, '-')           // remove double hyphens
    .trim();
}

/**
 * Gets the full Supabase Storage URL for a menu item image
 * @param categoryId - Category slug (e.g., "robusta-cold")
 * @param itemName - Item name (e.g., "Robusta Iced Latte")
 * @returns Full URL to image or fallback
 */
export function getMenuItemImageUrl(categoryId: string, itemName: string): string {
  if (!SUPABASE_URL) {
    console.warn('SUPABASE_URL not set, using placeholder');
    return getPlaceholderImage(categoryId);
  }

  const slug = itemNameToSlug(itemName);
  return `${SUPABASE_URL}/storage/v1/object/public/products/${categoryId}/${slug}.png`;
}

/**
 * Gets placeholder image based on category
 */
export function getPlaceholderImage(categoryId: string): string {
  const placeholders: Record<string, string> = {
    'robusta-cold': '/menu/coffee-cold.png',
    'robusta-hot': '/menu/coffee-hot.png',
    'blend-cold': '/menu/coffee-cold.png',
    'blend-hot': '/menu/coffee-hot.png',
    'manual-brew': '/menu/coffee-manual.png',
    'shakes-tea': '/menu/beverage.png',
    'food': '/menu/food.png'
  };
  
  return placeholders[categoryId] || '/menu/default.png';
}

/**
 * Checks if an image exists (client-side)
 * Returns placeholder if image fails to load
 */
export function handleMenuImageError(
  categoryId: string,
  onError: (fallbackUrl: string) => void
) {
  return () => {
    const fallback = getPlaceholderImage(categoryId);
    onError(fallback);
  };
}
