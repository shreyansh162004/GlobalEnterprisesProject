import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Users, Clock, MapPin, Instagram, Youtube } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SEO, { localBusinessSchema } from "@/components/SEO";

const stats = [
  { icon: Clock, value: "14+", label: "Years Experience" },
  { icon: Users, value: "10K+", label: "Happy Customers" },
  { icon: Award, value: "50+", label: "Brand Partners" },
  { icon: MapPin, value: "1", label: "Prime Location" },
];

const About = () => {
  const [channelLinks, setChannelLinks] = useState({ instagram: "", youtube: "" });

  useEffect(() => {
    const stored = localStorage.getItem("ge-channel-links");
    if (stored) setChannelLinks(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-primary text-sm font-medium mb-3 tracking-wider uppercase">About Us</p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8">
              Your Trusted <span className="text-gradient">Tech Partner</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Global Enterprises has been Jabalpur's premier electronics destination since 2010. We combine deep technical expertise with genuine products and exceptional after-sales service.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="glass-card p-8 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-4xl font-heading font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="glass-card p-8 md:p-14 max-w-3xl mx-auto space-y-5 text-muted-foreground">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Our Story</h2>
            <p className="text-base leading-relaxed">
              Founded in 2010, Global Enterprises started with a simple vision: to provide Jabalpur with access to the latest technology at fair prices, backed by honest advice.
            </p>
            <p className="text-base leading-relaxed">
              Over the years, we've grown into a full-service electronics store carrying laptops, desktops, monitors, printers, and accessories from all major brands including HP, Dell, Lenovo, Apple, Asus, Acer, and MSI.
            </p>
            <p className="text-base leading-relaxed">
              What sets us apart is our commitment to customer satisfaction. Every purchase comes with expert setup assistance, warranty support, and our promise of genuine products.
            </p>
          </div>
        </ScrollReveal>

        {/* Social Media */}
        <div className="mt-20 max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10">Follow Us</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <motion.a
                href={channelLinks.instagram || "https://instagram.com/globalenterprises"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-8 flex items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-lg">Instagram</p>
                  <p className="text-sm text-muted-foreground">Follow for latest updates & reels</p>
                </div>
              </motion.a>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <motion.a
                href={channelLinks.youtube || "https://youtube.com/@globalenterprises"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-8 flex items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
                  <Youtube className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-lg">YouTube</p>
                  <p className="text-sm text-muted-foreground">Watch reviews & comparisons</p>
                </div>
              </motion.a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
