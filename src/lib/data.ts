import runningShoes from "@/assets/products/running-shoes.jpg";
import basketball from "@/assets/products/basketball.jpg";
import tennisRacket from "@/assets/products/tennis-racket.jpg";
import dumbbells from "@/assets/products/dumbbells.jpg";
import yogaMat from "@/assets/products/yoga-mat.jpg";
import soccerBall from "@/assets/products/soccer-ball.jpg";
import boxingGloves from "@/assets/products/boxing-gloves.jpg";
import cyclingHelmet from "@/assets/products/cycling-helmet.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  brand: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  count: number;
};

export const categories: Category[] = [
  { id: "running", name: "Running", count: 24 },
  { id: "basketball", name: "Basketball", count: 18 },
  { id: "tennis", name: "Tennis", count: 12 },
  { id: "fitness", name: "Fitness", count: 32 },
  { id: "yoga", name: "Yoga", count: 15 },
  { id: "soccer", name: "Soccer", count: 20 },
  { id: "boxing", name: "Boxing", count: 10 },
  { id: "cycling", name: "Cycling", count: 14 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Fenix Velocity X",
    price: 189.99,
    originalPrice: 229.99,
    description: "Engineered for explosive speed. Carbon-fiber plate technology with responsive foam delivers maximum energy return on every stride.",
    category: "running",
    brand: "Fenix Sport",
    image: runningShoes,
    stock: 45,
    rating: 4.8,
    reviews: 234,
    specs: { Weight: "245g", Drop: "8mm", Cushion: "Max", Surface: "Road" },
    featured: true,
  },
  {
    id: "2",
    name: "Arena Pro Basketball",
    price: 49.99,
    description: "Official size and weight composite leather basketball. Designed for indoor/outdoor performance with deep channel construction.",
    category: "basketball",
    brand: "Fenix Sport",
    image: basketball,
    stock: 120,
    rating: 4.6,
    reviews: 89,
    specs: { Size: "7", Material: "Composite Leather", Use: "Indoor/Outdoor", Certification: "FIBA" },
    featured: true,
  },
  {
    id: "3",
    name: "Striker Pro Racket",
    price: 279.99,
    originalPrice: 329.99,
    description: "Tournament-grade graphite tennis racket with optimized string pattern for maximum spin and control.",
    category: "tennis",
    brand: "Fenix Sport",
    image: tennisRacket,
    stock: 28,
    rating: 4.9,
    reviews: 156,
    specs: { Weight: "300g", "Head Size": '100 sq in', Balance: "Even", String: "16x19" },
    featured: true,
  },
  {
    id: "4",
    name: "Titan Hex Dumbbells",
    price: 89.99,
    description: "Premium rubber hex dumbbells with ergonomic chrome handles. Anti-roll design for safe floor placement.",
    category: "fitness",
    brand: "Fenix Sport",
    image: dumbbells,
    stock: 200,
    rating: 4.7,
    reviews: 312,
    specs: { Weight: "15kg pair", Material: "Rubber/Chrome", Grip: "Knurled", Shape: "Hexagonal" },
  },
  {
    id: "5",
    name: "Flow Elite Yoga Mat",
    price: 64.99,
    description: "6mm premium TPE yoga mat with alignment markers. Non-slip texture on both sides for stability in any pose.",
    category: "yoga",
    brand: "Fenix Sport",
    image: yogaMat,
    stock: 85,
    rating: 4.5,
    reviews: 198,
    specs: { Thickness: "6mm", Material: "TPE", Length: "183cm", Width: "68cm" },
  },
  {
    id: "6",
    name: "Blaze Match Ball",
    price: 39.99,
    description: "FIFA-approved match soccer ball with thermal bonding technology. Consistent flight and touch in all conditions.",
    category: "soccer",
    brand: "Fenix Sport",
    image: soccerBall,
    stock: 150,
    rating: 4.4,
    reviews: 76,
    specs: { Size: "5", Panels: "32", Material: "PU Leather", Certification: "FIFA Quality Pro" },
  },
  {
    id: "7",
    name: "Fury Pro Gloves",
    price: 129.99,
    originalPrice: 159.99,
    description: "Professional-grade boxing gloves with multi-layer foam padding. Pre-curved anatomical design for natural fist closure.",
    category: "boxing",
    brand: "Fenix Sport",
    image: boxingGloves,
    stock: 42,
    rating: 4.8,
    reviews: 145,
    specs: { Weight: "16oz", Material: "Genuine Leather", Closure: "Velcro", Padding: "Multi-Layer" },
    featured: true,
  },
  {
    id: "8",
    name: "Aero Shield Helmet",
    price: 199.99,
    description: "Aerodynamic cycling helmet with MIPS protection system. 18 ventilation channels for optimal airflow during intense rides.",
    category: "cycling",
    brand: "Fenix Sport",
    image: cyclingHelmet,
    stock: 35,
    rating: 4.7,
    reviews: 203,
    specs: { Protection: "MIPS", Weight: "260g", Vents: "18", Fit: "Adjustable Dial" },
  },
];
