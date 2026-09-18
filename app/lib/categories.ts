export const CATEGORIES = {
  men: ["Tees", "Jackets", "Knitwear", "Sweaters", "Shirts", "Pants", "Running Gear"],
  women: ["Tees", "Jackets", "Knitwear", "Sweaters", "Shirts", "Tops", "Longsleeve Tees", "Pants"],
  accessories: ["Headwear", "Bags", "Socks"],
} as const;

export type Section = keyof typeof CATEGORIES;

export function slugify(str: string) {
  if (!str) return ''; // Əgər boş gələrsə proqramı qorumaq üçün
  return str.toLowerCase().trim().replace(/\s+/g, "-");
}