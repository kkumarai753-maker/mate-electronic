import data from "../shared/catalog.json";
export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string | number>;
  badge?: string;
  featured: boolean;
  trending: boolean;
};
export const categories = data.categories as Category[];
export const products: Product[] = data.products.map((p) => ({
  ...p,
  specs: Object.fromEntries(
    Object.entries(p.specs).filter(([, value]) => value !== undefined),
  ),
}));
export const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const categoryName = (id: string) =>
  categories.find((c) => c.id === id)?.name ?? id;
export const business = {
  name: "MATE ELECTRICALS",
  city: "Hingna, Nagpur",
  map: "https://share.google/RmRB0PJEQV9Xd1xPi",
  whatsapp: "919322172834",
  phone: "+918668649168",
  contactsVerified: false,
};
export const whatsappLink = (message: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
