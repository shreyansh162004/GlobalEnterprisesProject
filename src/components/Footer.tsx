import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { getContactInfo, phoneToTelHref, ContactInfo } from "@/data/products";

const Footer = () => {
  const [contact, setContact] = useState<ContactInfo>({
    phone: "+91 78797 07696",
    email: "info@globalenterprises.in",
    address: "Rasal Chowk, Jain Tower, Hotel Samdariya, Jabalpur, MP 482001",
    hours: "Mon–Sat: 10AM – 8PM",
  });
  useEffect(() => {
    const sync = async () => {
      try {
        const info = await getContactInfo();
        setContact(info);
      } catch (err) {
        console.error("Error loading footer contact info:", err);
      }
    };

    sync();
    window.addEventListener("ge-contact-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ge-contact-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
  <footer className="border-t border-border bg-card/50 pb-20 md:pb-0">
    <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Global Enterprises" className="w-12 h-12 rounded-full object-cover border border-primary/20 shadow-md" />
          <h3 className="text-2xl font-heading font-bold text-gradient">Global Enterprises</h3>
        </div>
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
        <h4 className="font-heading font-bold mb-4 text-lg">Popular in Jabalpur</h4>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <Link to="/laptops/buy-second-hand-jabalpur" className="hover:text-primary transition-colors">Buy Second Hand Laptop</Link>
          <Link to="/laptops/under-20000-jabalpur" className="hover:text-primary transition-colors">Laptops Under ₹20,000</Link>
          <Link to="/laptops/under-30000-jabalpur" className="hover:text-primary transition-colors">Laptops Under ₹30,000</Link>
          <Link to="/laptops/used-hp-jabalpur" className="hover:text-primary transition-colors">Used HP Laptops</Link>
          <Link to="/laptops/used-dell-jabalpur" className="hover:text-primary transition-colors">Used Dell Laptops</Link>
          <Link to="/laptops/used-lenovo-jabalpur" className="hover:text-primary transition-colors">Used Lenovo Laptops</Link>
          <Link to="/laptops/gaming-jabalpur" className="hover:text-primary transition-colors">Gaming Laptops</Link>
        </div>
      </div>
      <div>
        <h4 className="font-heading font-bold mb-4 text-lg">Contact</h4>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary shrink-0" /> {contact.address}</div>
          <a href={`tel:${phoneToTelHref(contact.phone)}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="w-4 h-4 text-primary shrink-0" /> {contact.phone}</a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="w-4 h-4 text-primary shrink-0" /> {contact.email}</a>
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
};

export default Footer;
