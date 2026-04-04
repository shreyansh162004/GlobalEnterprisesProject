export interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  specs: string;
  description: string;
  images: string[];
  featured: boolean;
}

export const brands = ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "MSI"];

export const categories = ["Laptop", "Desktop", "Monitor", "Accessories", "Printer", "Networking"];

export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "HP Pavilion 15",
    price: 52990,
    brand: "HP",
    category: "Laptop",
    specs: "Intel i5 12th Gen • 8GB RAM • 512GB SSD • 15.6\" FHD",
    description: "A versatile laptop perfect for work and entertainment. Features the latest Intel processor with stunning display quality.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"],
    featured: true,
  },
  {
    id: "2",
    name: "Dell Inspiron 14",
    price: 45990,
    brand: "Dell",
    category: "Laptop",
    specs: "Intel i5 13th Gen • 8GB RAM • 256GB SSD • 14\" FHD",
    description: "Compact and powerful, the Inspiron 14 delivers exceptional performance in a sleek design.",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600"],
    featured: true,
  },
  {
    id: "3",
    name: "Lenovo IdeaPad Slim 3",
    price: 38990,
    brand: "Lenovo",
    category: "Laptop",
    specs: "AMD Ryzen 5 • 8GB RAM • 512GB SSD • 15.6\" FHD",
    description: "Ultra-slim design with powerful AMD processing for everyday computing needs.",
    images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"],
    featured: true,
  },
  {
    id: "4",
    name: "Asus ROG Strix G15",
    price: 89990,
    brand: "Asus",
    category: "Laptop",
    specs: "AMD Ryzen 7 • 16GB RAM • 1TB SSD • RTX 4060 • 15.6\" 144Hz",
    description: "Dominate your games with this high-performance gaming laptop featuring RTX graphics.",
    images: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600"],
    featured: true,
  },
  {
    id: "5",
    name: "Acer Aspire 5",
    price: 34990,
    brand: "Acer",
    category: "Laptop",
    specs: "Intel i3 12th Gen • 8GB RAM • 256GB SSD • 15.6\" FHD",
    description: "Budget-friendly laptop with solid performance for students and professionals.",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"],
    featured: false,
  },
  {
    id: "6",
    name: "MSI GF63 Thin",
    price: 62990,
    brand: "MSI",
    category: "Laptop",
    specs: "Intel i5 12th Gen • 16GB RAM • 512GB SSD • RTX 3050 • 15.6\" FHD",
    description: "Thin and light gaming laptop that doesn't compromise on performance.",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"],
    featured: false,
  },
  {
    id: "7",
    name: "Apple MacBook Air M2",
    price: 114900,
    brand: "Apple",
    category: "Laptop",
    specs: "Apple M2 • 8GB RAM • 256GB SSD • 13.6\" Liquid Retina",
    description: "Incredibly thin and fast with the revolutionary M2 chip. All-day battery life.",
    images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600"],
    featured: true,
  },
  {
    id: "8",
    name: "Dell 27\" 4K Monitor",
    price: 28990,
    brand: "Dell",
    category: "Monitor",
    specs: "27\" 4K UHD • IPS • 60Hz • USB-C • HDR400",
    description: "Stunning 4K display with accurate colors for creative professionals.",
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"],
    featured: false,
  },
  {
    id: "9",
    name: "HP LaserJet Pro M428",
    price: 32990,
    brand: "HP",
    category: "Printer",
    specs: "Laser • Mono • Duplex • WiFi • 40ppm",
    description: "High-speed mono laser printer ideal for offices and heavy-duty printing.",
    images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600"],
    featured: false,
  },
  {
    id: "10",
    name: "Lenovo ThinkPad E14",
    price: 58990,
    brand: "Lenovo",
    category: "Laptop",
    specs: "Intel i5 13th Gen • 16GB RAM • 512GB SSD • 14\" FHD",
    description: "Business-grade laptop with legendary ThinkPad reliability and keyboard.",
    images: ["https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600"],
    featured: false,
  },
];

export function getProducts(): Product[] {
  const stored = localStorage.getItem("ge-products");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("ge-products", JSON.stringify(defaultProducts));
  return defaultProducts;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem("ge-products", JSON.stringify(products));
}
