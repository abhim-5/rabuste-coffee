/**
 * Helper function to get the correct image for display
 * Falls back to main item image if variation doesn't have one
 */
export function getDisplayImage(item: {image: string}, selectedVariation?: { image?: string } | null): string {
  return selectedVariation?.image || item.image;
}

/**
 * Helper function to get the correct price for display  
 * Uses variation price if available, otherwise item price
 */
export function getDisplayPrice(item: {price: number}, selectedVariation?: { price?: number } | null): number {
  return selectedVariation?.price ?? item.price;
}

/**
 * Helper function to get the correct description
 * Falls back to main item description if variation doesn't have one
 */
export function getDisplayDescription(item: {description: string}, selectedVariation?: { description?: string } | null): string {
  return selectedVariation?.description || item.description;
}
