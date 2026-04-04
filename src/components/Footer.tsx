import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 pb-20 md:pb-0">
    <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h3 className="text-2xl font-heading font-bold text-gradient mb-4">Global Enterprises</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">Premium electronics store in Jabalpur, Madhya Pradesh. Trusted since 2010.</p>
      </div>
      <div>
        <h4 className="font-heading font-bold mb-4 text-lg">Quick Links</h4>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
      <div>
        <h4 className="font-heading font-bold mb-4 text-lg">Contact</h4>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary shrink-0" /> Jabalpur, MP</div>
          <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="w-4 h-4 text-primary shrink-0" /> +91 98765 43210</a>
          <a href="mailto:info@globalenterprises.in" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="w-4 h-4 text-primary shrink-0" /> info@globalenterprises.in</a>
          <div className="flex gap-3 mt-3">
            <a href="#" className="p-2.5 rounded-xl bg-secondary hover:bg-primary/20 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2.5 rounded-xl bg-secondary hover:bg-primary/20 transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © 2024 Global Enterprises. All rights reserved.
    </div>
  </footer>
);

export default Footer;
