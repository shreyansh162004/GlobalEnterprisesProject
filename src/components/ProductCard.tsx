import { motion } from "framer-motion";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Product } from "@/data/products";
import { addToCart } from "@/data/cart";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "dark" | "light";
}

const ProductCard = ({ product, index = 0, variant = "dark" }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({ title: "Added to cart", description: product.name });
  };

  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString("en-IN")}). Is it available?`
  )}`;

  const isLight = variant === "light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/products/${product.id}`} className="block group">
        <div className={`overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
          isLight
            ? "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-lg"
            : "glass-card hover:shadow-2xl hover:shadow-primary/15"
        }`}>
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? "from-white/80" : "from-background/80"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-primary/20 text-primary backdrop-blur-sm font-medium border border-primary/10">
              {product.category}
            </span>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <p className="text-xs text-primary font-medium tracking-wide">{product.brand}</p>
              <h3 className={`font-heading font-bold text-base mt-0.5 leading-tight ${isLight ? "text-gray-900" : ""}`}>{product.name}</h3>
            </div>
            <p className={`text-xs line-clamp-1 ${isLight ? "text-gray-500" : "text-muted-foreground"}`}>{product.specs}</p>
            <p className="text-xl font-heading font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:brightness-110"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20 text-xs font-bold transition-all hover:bg-accent/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
