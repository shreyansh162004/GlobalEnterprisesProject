import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getProducts, getBrands, getCategories, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { SlidersHorizontal, X, Search } from "lucide-react";
import Fuse from "fuse.js";
import SEO, { SITE_URL } from "@/components/SEO";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const products = getProducts();
  const brands = useMemo(() => getBrands(), []);
  const categories = useMemo(() => getCategories(), []);

  // Dynamic price ranges based on actual product prices
  const priceRanges = useMemo(() => {
    if (products.length === 0) return [{ label: "All Prices", min: 0, max: 999999 }];
    const prices = products.map((p) => p.price).sort((a, b) => a - b);
    const minP = prices[0];
    const maxP = prices[prices.length - 1];
    const step = Math.ceil((maxP - minP) / 4 / 5000) * 5000;
    const ranges = [{ label: "All Prices", min: 0, max: 999999 }];
    let current = Math.floor(minP / 5000) * 5000;
    for (let i = 0; i < 4; i++) {
      const rMin = current;
      const rMax = i === 3 ? 999999 : current + step;
      const count = products.filter((p) => p.price >= rMin && (i === 3 ? true : p.price < rMax)).length;
      const fmt = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(v % 100000 === 0 ? 0 : 1)}L` : `₹${(v / 1000).toFixed(0)}K`;
      const label = i === 3 ? `${fmt(rMin)}+ (${count})` : `${fmt(rMin)} – ${fmt(rMax)} (${count})`;
      ranges.push({ label, min: rMin, max: rMax });
      current += step;
    }
    return ranges;
  }, [products]);

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "brand", "category", "specs", "description"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [products]
  );

  useEffect(() => {
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (brand) setSelectedBrand(brand);
    if (minPrice && maxPrice) {
      const min = parseInt(minPrice);
      const max = parseInt(maxPrice);
      const idx = priceRanges.findIndex((r) => r.min === min && r.max === max);
      if (idx !== -1) setSelectedPrice(idx);
    }
  }, [searchParams, priceRanges]);

  const filtered = useMemo(() => {
    let result: Product[];
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map((r) => r.item);
    } else {
      result = products;
    }
    return result.filter((p) => {
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      const range = priceRanges[selectedPrice];
      if (p.price < range.min || p.price > range.max) return false;
      return true;
    });
  }, [products, selectedBrand, selectedCategory, selectedPrice, searchQuery, fuse, priceRanges]);

  const recommendations = useMemo(() => {
    if (filtered.length === 0 || filtered.length >= products.length) return [];
    const filteredIds = new Set(filtered.map((p) => p.id));
    const maxFilteredPrice = Math.max(...filtered.map((p) => p.price));
    return products
      .filter((p) => !filteredIds.has(p.id) && p.price >= maxFilteredPrice * 0.8)
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);
  }, [filtered, products]);

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setSelectedPrice(0);
    setSearchQuery("");
  };

  const hasFilters = selectedBrand || selectedCategory || selectedPrice > 0 || searchQuery;

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <SEO
        title="Used & Refurbished Laptops in Jabalpur | Global Enterprises"
        description="Browse second hand HP, Dell, Lenovo laptops at Global Enterprises Jabalpur. Budget laptops under ₹20,000–₹30,000 with warranty. Best prices guaranteed."
        path="/products"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Refurbished Laptops Collection",
          description: "Second hand laptops, refurbished HP, Dell, Lenovo and gaming laptops in Jabalpur.",
          url: `${SITE_URL}/products`,
        }}
      />
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-heading font-bold">Our Products</h1>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Browse our collection of premium electronics
            </p>
          </div>
        </ScrollReveal>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search laptops, brands, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-secondary text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.aside
            className={`w-full md:w-64 shrink-0 space-y-6 ${showFilters ? "block" : "hidden md:block"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-card p-5 space-y-6">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  <X className="w-3 h-3" /> Clear all filters
                </button>
              )}

              <div>
                <h3 className="text-sm font-heading font-bold mb-3">Price Range</h3>
                <div className="space-y-1">
                  {priceRanges.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPrice(i)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedPrice === i ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-bold mb-3">Brand</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedBrand("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !selectedBrand ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedBrand === brand ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-bold mb-3">Category</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !selectedCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-6 font-medium">{filtered.length} products found</p>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-heading">No products match your filters</p>
                <button onClick={clearFilters} className="text-primary text-sm mt-3 hover:underline font-medium">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="mt-16">
                <ScrollReveal>
                  <div className="mb-6">
                    <p className="text-primary text-sm font-medium mb-1">YOU MAY ALSO LIKE</p>
                    <h2 className="text-2xl font-heading font-bold">Recommended Products</h2>
                  </div>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendations.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
