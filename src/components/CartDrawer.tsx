import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { CartItem, getCart, updateQuantity, removeFromCart, getCartTotal, getWhatsAppCheckoutLink } from "@/data/cart";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const update = () => setCart(getCart());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [open]);

  const total = getCartTotal(cart);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-heading font-bold">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="glass-card p-4 flex gap-4"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-primary font-bold text-sm">₹{item.product.price.toLocaleString("en-IN")}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors ml-auto"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between text-lg font-heading font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <a
                  href={getWhatsAppCheckoutLink(cart)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium flex items-center justify-center gap-2 w-full bg-accent"
                >
                  <MessageCircle className="w-5 h-5" />
                  Checkout via WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
