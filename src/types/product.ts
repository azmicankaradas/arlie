export type Category = "rings" | "earrings" | "necklaces" | "bracelets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  story: string;
  price: number;
  category: Category;
  materials: string[];
  sustainability: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
}

export const CATEGORIES: Record<Category, string> = {
  rings: "Yüzük",
  earrings: "Küpe",
  necklaces: "Kolye",
  bracelets: "Bileklik",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  rings: "Parmaklarınızda minimalist bir dokunuş",
  earrings: "Zarafeti çerçeveleyen ince detaylar",
  necklaces: "Boynunuzda zamansız bir hikaye",
  bracelets: "Bileğinize zarif bir fısıltı",
};
