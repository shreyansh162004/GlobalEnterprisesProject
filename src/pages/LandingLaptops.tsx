import { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield, Phone } from "lucide-react";
import { getProducts, Product, getWhatsAppNumber } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import SEO, { localBusinessSchema, SITE_URL } from "@/components/SEO";

type LandingConfig = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  keywords: string[];
  filter: (p: Product) => boolean;
};

const CONFIGS: Record<string, LandingConfig> = {
  "buy-second-hand-jabalpur": {
    slug: "buy-second-hand-jabalpur",
    h1: "Buy Second Hand Laptop in Jabalpur",
    title: "Buy Second Hand Laptop in Jabalpur | Global Enterprises",
    description:
      "Buy second hand & refurbished laptops in Jabalpur with warranty. HP, Dell, Lenovo, Asus at Rasal Chowk, Jain Tower, near Hotel Samdariya.",
    intro:
      "Looking to buy a second hand laptop in Jabalpur? Global Enterprises is the city's most trusted refurbished laptop shop at Rasal Chowk, Jain Tower, near Hotel Samdariya. Every used laptop is tested, cleaned and backed by warranty.",
    keywords: [
      "buy second hand laptop jabalpur",
      "second hand laptop jabalpur",
      "used laptop shop jabalpur",
      "refurbished laptops jabalpur",
    ],
    filter: (p) => p.category === "Laptop",
  },
  "refurbished-jabalpur": {
    slug: "refurbished-jabalpur",
    h1: "Refurbished Laptops in Jabalpur",
    title: "Refurbished Laptops in Jabalpur with Warranty | Global Enterprises",
    description:
      "Certified refurbished laptops in Jabalpur with warranty. Affordable HP, Dell, Lenovo, Apple at Global Enterprises, Rasal Chowk, Jain Tower.",
    intro:
      "Premium refurbished laptops in Jabalpur — fully tested, cleaned and ready to use. Save up to 50% over brand new while keeping reliability and warranty.",
    keywords: [
      "refurbished laptops jabalpur",
      "refurbished laptop store madhya pradesh",
      "certified used laptops jabalpur",
      "affordable refurbished laptops jabalpur",
    ],
    filter: (p) => p.category === "Laptop",
  },
  "under-20000-jabalpur": {
    slug: "under-20000-jabalpur",
    h1: "Laptops Under ₹20,000 in Jabalpur",
    title: "Second Hand Laptop Under 20000 in Jabalpur | Global Enterprises",
    description:
      "Budget second hand laptops under ₹20,000 in Jabalpur. Tested HP, Dell, Lenovo with warranty. Best prices at Rasal Chowk, Jain Tower.",
    intro:
      "Find the best second hand laptop under ₹20,000 in Jabalpur. Ideal for students, browsing, MS Office and online classes. All laptops are inspected and warranted.",
    keywords: [
      "laptop under 20000 jabalpur",
      "second hand laptop jabalpur",
      "cheap laptops jabalpur",
      "budget laptops jabalpur",
    ],
    filter: (p) => p.category === "Laptop" && p.price <= 20000,
  },
  "under-30000-jabalpur": {
    slug: "under-30000-jabalpur",
    h1: "Laptops Under ₹30,000 in Jabalpur",
    title: "Second Hand Laptop Under 30000 in Jabalpur | Global Enterprises",
    description:
      "Used laptops under ₹30,000 in Jabalpur with warranty. i3, i5 HP, Dell, Lenovo at Global Enterprises, Rasal Chowk, Jain Tower.",
    intro:
      "Buy a reliable second hand laptop under ₹30,000 in Jabalpur. Great for work-from-home, college projects and everyday productivity.",
    keywords: [
      "laptop under 30000 jabalpur",
      "second hand laptop jabalpur",
      "used laptop shop jabalpur",
      "budget laptops jabalpur",
    ],
    filter: (p) => p.category === "Laptop" && p.price <= 30000,
  },
  "used-hp-jabalpur": {
    slug: "used-hp-jabalpur",
    h1: "Used HP Laptops in Jabalpur",
    title: "Used HP Laptops in Jabalpur with Warranty | Global Enterprises",
    description:
      "Buy used HP Pavilion, ProBook & EliteBook laptops in Jabalpur with warranty. Best prices on second hand HP at Rasal Chowk, Jain Tower.",
    intro:
      "Looking for a used HP laptop in Jabalpur? We stock tested HP Pavilion, ProBook and EliteBook models with warranty and after-sales support.",
    keywords: [
      "used hp laptop jabalpur",
      "second hand hp laptop jabalpur",
      "refurbished hp laptop jabalpur",
      "global enterprises used laptop shop",
    ],
    filter: (p) => p.brand === "HP" && p.category === "Laptop",
  },
  "used-dell-jabalpur": {
    slug: "used-dell-jabalpur",
    h1: "Used Dell Laptops in Jabalpur",
    title: "Used Dell Laptops in Jabalpur with Warranty | Global Enterprises",
    description:
      "Buy used Dell Inspiron, Latitude & Vostro laptops in Jabalpur with warranty. Trusted second hand Dell dealer at Rasal Chowk, Jain Tower.",
    intro:
      "Get reliable used Dell laptops in Jabalpur — Inspiron, Latitude and Vostro — fully tested and backed by warranty.",
    keywords: [
      "used dell laptop jabalpur",
      "second hand dell laptop jabalpur",
      "refurbished dell laptop jabalpur",
    ],
    filter: (p) => p.brand === "Dell" && p.category === "Laptop",
  },
  "used-lenovo-jabalpur": {
    slug: "used-lenovo-jabalpur",
    h1: "Used Lenovo Laptops in Jabalpur",
    title: "Used Lenovo Laptops in Jabalpur with Warranty | Global Enterprises",
    description:
      "Used Lenovo ThinkPad & IdeaPad laptops in Jabalpur with warranty. Best prices on second hand Lenovo at Rasal Chowk, Jain Tower.",
    intro:
      "Buy used Lenovo ThinkPad and IdeaPad laptops in Jabalpur. Business-grade reliability at second hand prices, with warranty.",
    keywords: [
      "used lenovo laptop jabalpur",
      "second hand lenovo laptop jabalpur",
      "refurbished lenovo jabalpur",
    ],
    filter: (p) => p.brand === "Lenovo" && p.category === "Laptop",
  },
  "gaming-jabalpur": {
    slug: "gaming-jabalpur",
    h1: "Second Hand Gaming Laptops in Jabalpur",
    title: "Second Hand Gaming Laptops in Jabalpur | Global Enterprises",
    description:
      "Used gaming laptops in Jabalpur — Asus ROG, MSI, RTX series. Best prices on second hand gaming laptops at Rasal Chowk, Jain Tower.",
    intro:
      "Power up your play with second hand gaming laptops in Jabalpur — Asus ROG, MSI and RTX-equipped machines, tested and warranted.",
    keywords: [
      "second hand gaming laptop jabalpur",
      "used gaming laptop jabalpur",
      "refurbished gaming laptop jabalpur",
    ],
    filter: (p) =>
      p.category === "Laptop" &&
      /(rog|gaming|rtx|gtx|msi)/i.test(`${p.name} ${p.specs}`),
  },
};

const LandingLaptops = () => {
  const { slug = "" } = useParams();
  const config = CONFIGS[slug];
  const all = getProducts();

  const matches = useMemo(
    () => (config ? all.filter(config.filter) : []),
    [all, config]
  );

  if (!config) return <Navigate to="/products" replace />;

  const path = `/laptops/${config.slug}`;
  const url = `${SITE_URL}${path}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Laptops", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 3, name: config.h1, item: url },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.h1,
    itemListElement: matches.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/products/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <SEO
        title={config.title}
        description={config.description}
        path={path}
        keywords={config.keywords}
        jsonLd={[localBusinessSchema, breadcrumb, itemList]}
      />
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary">Laptops</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{config.h1}</span>
          </nav>
          <div className="mb-8 max-w-3xl">
            <p className="text-primary text-sm font-medium mb-2 tracking-wider uppercase">Jabalpur</p>
            <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">{config.h1}</h1>
            <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">{config.intro}</p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Rasal Chowk, Jain Tower</span>
              <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Warranty included</span>
              <a href={`tel:+91${getWhatsAppNumber().slice(-10)}`} className="inline-flex items-center gap-2 hover:text-primary"><Phone className="w-4 h-4 text-primary" /> Call to enquire</a>
            </div>
          </div>
        </ScrollReveal>

        {matches.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-muted-foreground">
              No matching laptops in stock right now. Browse{" "}
              <Link to="/products" className="text-primary hover:underline">all laptops</Link> or contact us for fresh arrivals.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matches.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}

        <section className="mt-16 glass-card p-6 md:p-10">
          <h2 className="text-xl md:text-2xl font-heading font-bold mb-4">
            Why buy from Global Enterprises Jabalpur?
          </h2>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li>✓ 14+ years serving Jabalpur with second hand laptops</li>
            <li>✓ Warranty on every refurbished laptop</li>
            <li>✓ Convenient location — Rasal Chowk, Jain Tower, near Hotel Samdariya</li>
            <li>✓ Buy, sell and exchange used HP, Dell, Lenovo, Apple laptops</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/laptops/under-20000-jabalpur" className="text-primary hover:underline">Laptops under ₹20,000</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/laptops/under-30000-jabalpur" className="text-primary hover:underline">Laptops under ₹30,000</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/laptops/used-hp-jabalpur" className="text-primary hover:underline">Used HP</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/laptops/used-dell-jabalpur" className="text-primary hover:underline">Used Dell</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/laptops/used-lenovo-jabalpur" className="text-primary hover:underline">Used Lenovo</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/laptops/gaming-jabalpur" className="text-primary hover:underline">Gaming Laptops</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/contact" className="text-primary hover:underline inline-flex items-center gap-1">
              Visit our shop <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingLaptops;