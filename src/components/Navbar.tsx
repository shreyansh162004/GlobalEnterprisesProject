import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Home, Package, Info, Phone } from "lucide-react";
import { getCart } from "@/data/cart";
import logo from "@/assets/logo.jpg";

interface NavbarProps {
  onCartOpen: () => void;
}

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/products", label: "Products", icon: Package },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
];

const Navbar = ({ onCartOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((t, i) => t + i.quantity, 0));
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/60 backdrop-blur-2xl border-b border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.img
              src={logo}
              alt="Global Enterprises"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-primary/20 shadow-md shadow-primary/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-heading font-bold text-gradient leading-tight">Global</span>
              <span className="text-[9px] md:text-[10px] font-body text-muted-foreground tracking-[0.15em] uppercase">Enterprises</span>
            </div>
          </Link>

          {/* Desktop nav - Oval pill */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-0.5 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-full px-1.5 py-1.5">
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative px-5 py-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/15 border border-primary/25 shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onCartOpen} className="relative p-2.5 rounded-full hover:bg-white/[0.06] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/40 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                      location.pathname === link.to ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border/40 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                <span className="text-[10px] font-medium">{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
          <button
            onClick={onCartOpen}
            className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl text-muted-foreground relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
