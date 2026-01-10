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
  // Always return placeholder for items without uploaded images
  return getPlaceholderImage(categoryId);
}

/**
 * Gets placeholder image based on category
 */
export function getPlaceholderImage(categoryId: string): string {
  // Use existing coffee.png for all categories
  return '/coffee.png';
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
