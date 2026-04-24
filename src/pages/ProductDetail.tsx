import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, getWhatsAppNumber } from "@/data/products";
import { addToCart } from "@/data/cart";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const ProductDetail = () => {
  const { id } = useParams();
  const products = getProducts();
  const product = products.find((p) => p.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = product?.images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const goToImage = (idx: number) => {
    setCurrentImage(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = product ? `Check out ${product.name} - ₹${product.price.toLocaleString("en-IN")} at Global Enterprises` : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name, text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline">Back to products</Link>
        </div>
      </div>
    );
  }

  const similar = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const higherPrice = products
    .filter((p) => p.id !== product.id && p.price > product.price)
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  const whatsappLink = `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(
    `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString("en-IN")}). Is it available?`
  )}`;

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <SEO
        title={`${product.name} – ${product.brand} | Global Enterprises Jabalpur`}
        description={`Buy ${product.name} (${product.brand}) at Global Enterprises Jabalpur for ₹${product.price.toLocaleString("en-IN")}. ${product.specs?.slice(0, 90) || ""}`}
        path={`/products/${product.id}`}
        image={images[0]}
        type="product"
        keywords={[
          `used ${product.brand.toLowerCase()} laptop jabalpur`,
          `${product.name.toLowerCase()} jabalpur`,
          `second hand ${product.brand.toLowerCase()} jabalpur`,
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: images,
          brand: { "@type": "Brand", name: product.brand },
          category: product.category,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `https://globalenterprises.lovable.app/products/${product.id}`,
            seller: { "@type": "Organization", name: "Global Enterprises" },
          },
        }}
      />
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Image carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-2 rounded-3xl overflow-hidden relative group"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-80 md:h-[500px] object-cover flex-shrink-0"
                  />
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => goToImage((currentImage - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/60 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => goToImage((currentImage + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/60 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-3 pb-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentImage ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <span className="text-sm text-primary font-medium tracking-wide">{product.brand} • {product.category}</span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold mt-3 leading-tight">{product.name}</h1>
            </div>
            <p className="text-3xl md:text-4xl font-heading font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <div className="glass-card p-5 space-y-2">
              <h3 className="font-heading font-bold text-sm">Specifications</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.specs}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(product);
                  toast({ title: "Added to cart", description: product.name });
                }}
                className="btn-premium flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-premium flex items-center justify-center gap-2 px-6"
              >
                <MessageCircle className="w-5 h-5" /> Enquire
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {similar.length > 0 && (
          <section className="mt-24">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10">Similar Products</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {higherPrice.length > 0 && (
          <section className="mt-20">
            <ScrollReveal>
              <div className="mb-10">
                <p className="text-primary text-sm font-medium mb-1 tracking-wider">UPGRADE</p>
                <h2 className="text-2xl md:text-3xl font-heading font-bold">Premium Options</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {higherPrice.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
