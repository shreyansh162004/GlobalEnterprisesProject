import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import { getProducts } from "@/data/products";
import { addToCart } from "@/data/cart";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const products = getProducts();
  const product = products.find((p) => p.id === id);

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

  // Higher price recommendations
  const higherPrice = products
    .filter((p) => p.id !== product.id && p.price > product.price)
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString("en-IN")}). Is it available?`
  )}`;

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-2 rounded-3xl overflow-hidden"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-80 md:h-[500px] object-cover rounded-2xl"
            />
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
