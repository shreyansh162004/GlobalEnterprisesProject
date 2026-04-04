import { motion } from "framer-motion";
import { Award, Users, Clock, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { icon: Clock, value: "14+", label: "Years Experience" },
  { icon: Users, value: "10K+", label: "Happy Customers" },
  { icon: Award, value: "50+", label: "Brand Partners" },
  { icon: MapPin, value: "1", label: "Prime Location" },
];

const About = () => (
  <div className="min-h-screen pt-24 pb-24 md:pb-16">
    <div className="container mx-auto px-4">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-primary text-sm font-medium mb-3 tracking-wider">ABOUT US</p>
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
    </div>
  </div>
);

export default About;
