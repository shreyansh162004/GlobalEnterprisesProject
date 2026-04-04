import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, HeadphonesIcon, Award, Star, Instagram, Youtube, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import logo from "@/assets/logo.jpg";

const features = [
  { icon: Shield, title: "Genuine Products", desc: "100% authentic products with manufacturer warranty" },
  { icon: Truck, title: "Fast Delivery", desc: "Same day delivery across Jabalpur" },
  { icon: HeadphonesIcon, title: "Expert Support", desc: "Dedicated tech support for all purchases" },
  { icon: Award, title: "Best Prices", desc: "Competitive pricing with price match guarantee" },
];

const reviews = [
  { name: "Rahul Sharma", rating: 5, text: "Best electronics store in Jabalpur! Got my gaming laptop at an amazing price with great after-sales support.", avatar: "RS" },
  { name: "Priya Patel", rating: 5, text: "Excellent service and genuine products. The team helped me choose the perfect laptop for my design work.", avatar: "PP" },
  { name: "Amit Jain", rating: 5, text: "I've been buying from Global Enterprises for 3 years. Always reliable, always the best deals!", avatar: "AJ" },
  { name: "Sneha Gupta", rating: 4, text: "Great collection of laptops and accessories. Fast delivery within Jabalpur. Highly recommended!", avatar: "SG" },
];

const defaultInstagramReels = [
  { id: 1, title: "Unboxing HP Pavilion 2024", thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=400&fit=crop", link: "" },
  { id: 2, title: "Dell vs Lenovo Comparison", thumbnail: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=400&fit=crop", link: "" },
  { id: 3, title: "Best Gaming Laptops Under 60K", thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=400&fit=crop", link: "" },
  { id: 4, title: "MacBook Air M3 Review", thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=400&fit=crop", link: "" },
];

const Index = () => {
  const products = getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  // Load admin-managed reels & videos from localStorage
  const [reelLinks, setReelLinks] = useState<string[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [channelLinks, setChannelLinks] = useState({ instagram: "", youtube: "" });

  useEffect(() => {
    const storedReels = localStorage.getItem("ge-instagram-reels");
    if (storedReels) setReelLinks(JSON.parse(storedReels));
    const storedVideos = localStorage.getItem("ge-youtube-videos");
    if (storedVideos) setVideoLinks(JSON.parse(storedVideos));
    const storedChannels = localStorage.getItem("ge-channel-links");
    if (storedChannels) setChannelLinks(JSON.parse(storedChannels));
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const getInstagramEmbedId = (url: string) => {
    const match = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
    return match ? match[1] : null;
  };

  const displayVideos = videoLinks.length > 0 ? videoLinks : [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero - Dark */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/5 blur-3xl"
              style={{
                width: 300 + i * 150,
                height: 300 + i * 150,
                top: `${20 + i * 20}%`,
                left: `${55 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-8"
              >
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary tracking-wide">Jabalpur's #1 Electronics Store</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading font-extrabold leading-[1.05] mb-8">
                <span className="text-gradient">Premium</span>
                <br />
                <span className="text-gradient">Tech</span>
                <br />
                <span>for Everyone</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Discover the latest laptops, desktops, and accessories from top brands. Expert guidance, genuine products, unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-premium inline-flex items-center gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-premium inline-flex items-center gap-2"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden md:flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-125" />
                <img
                  src={logo}
                  alt="Global Enterprises"
                  className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-primary/20 shadow-2xl shadow-primary/30"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gradient transition dark → light */}
      <div className="h-24 md:h-32 section-divider-light" />

      {/* Featured Products - Light */}
      <section className="py-16 md:py-24 bg-light-section text-light-section-fg transition-colors duration-500">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-primary text-sm font-medium mb-2 tracking-wider">FEATURED</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold">Trending Products</h2>
              </div>
              <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} variant="light" />
            ))}
          </div>
        </div>
      </section>

      {/* Gradient transition light → dark */}
      <div className="h-24 md:h-32 section-divider-dark" />

      {/* Why Choose Us - Dark */}
      <section className="py-16 md:py-24 bg-background text-foreground transition-colors duration-500">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-medium mb-2 tracking-wider">WHY CHOOSE US</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold">The Global Advantage</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card p-8 text-center space-y-4"
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <feat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24 md:h-32 section-divider-light" />

      {/* Customer Reviews - Light */}
      <section className="py-16 md:py-24 bg-light-section text-light-section-fg transition-colors duration-500">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-medium mb-2 tracking-wider">TESTIMONIALS</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold">What Our Customers Say</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {reviews.map((review, i) => (
              <ScrollReveal key={review.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-7 space-y-4 h-full shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <Quote className="w-8 h-8 text-primary/30" />
                  <p className="text-sm leading-relaxed text-gray-600">{review.text}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-heading font-bold text-gray-900">{review.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24 md:h-32 section-divider-dark" />

      {/* Instagram Reels - Dark */}
      <section className="py-16 md:py-24 bg-background text-foreground transition-colors duration-500">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Instagram className="w-5 h-5 text-pink-400" />
                <p className="text-pink-400 text-sm font-medium tracking-wider">INSTAGRAM</p>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold">Latest Reels & Updates</h2>
              <p className="mt-3 text-muted-foreground">
                Follow us{" "}
                <a
                  href={channelLinks.instagram || "https://instagram.com/globalenterprises"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline"
                >
                  @globalenterprises
                </a>
              </p>
            </div>
          </ScrollReveal>
          {reelLinks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {reelLinks.map((link, i) => {
                const embedId = getInstagramEmbedId(link);
                return (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <motion.a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="relative block rounded-2xl overflow-hidden group aspect-[3/4] glass-card"
                    >
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                        <Instagram className="w-10 h-10 text-pink-400" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                        <p className="text-xs font-heading font-bold line-clamp-2 text-foreground">Reel {i + 1}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Instagram className="w-3 h-3 text-pink-400" />
                          <span className="text-[10px] text-muted-foreground">View on Instagram</span>
                        </div>
                      </div>
                    </motion.a>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {defaultInstagramReels.map((reel, i) => (
                <ScrollReveal key={reel.id} delay={i * 0.1}>
                  <motion.a
                    href={channelLinks.instagram || "https://instagram.com/globalenterprises"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="relative block rounded-2xl overflow-hidden group aspect-[3/4]"
                  >
                    <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs font-heading font-bold line-clamp-2 text-foreground">{reel.title}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Instagram className="w-3 h-3 text-pink-400" />
                        <span className="text-[10px] text-muted-foreground">Reel</span>
                      </div>
                    </div>
                  </motion.a>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="h-24 md:h-32 section-divider-light" />

      {/* YouTube Section - Light */}
      <section className="py-16 md:py-24 bg-light-section text-light-section-fg transition-colors duration-500">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <p className="text-red-500 text-sm font-medium tracking-wider">YOUTUBE</p>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold">Watch Our Reviews</h2>
              <p className="mt-3 text-gray-500">
                Subscribe to our{" "}
                <a
                  href={channelLinks.youtube || "https://youtube.com/@globalenterprises"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline"
                >
                  YouTube Channel
                </a>
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {displayVideos.slice(0, 4).map((url, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden aspect-video shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <iframe
                    src={getYouTubeEmbedUrl(url)}
                    title={`Video ${i + 1}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview - Dark */}
      <section className="section-gap bg-background text-foreground transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="glass-card p-1.5 rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600"
                  alt="Our Store"
                  className="w-full h-72 md:h-[450px] object-cover rounded-2xl"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <p className="text-primary text-sm font-medium tracking-wider">ABOUT US</p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
                  Trusted by <span className="text-gradient">Thousands</span> in Jabalpur
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Since 2010, Global Enterprises has been Jabalpur's go-to destination for premium electronics. We bring you genuine products from top brands with expert guidance and after-sales support.
                </p>
                <Link to="/about" className="btn-outline-premium inline-flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA - Light */}
      <section className="section-gap bg-light-section text-light-section-fg transition-colors duration-500">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-10 md:p-16 text-center shadow-sm">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                Need Help Choosing?
              </h2>
              <p className="text-lg mb-8 max-w-lg mx-auto text-gray-500">
                Chat with our experts on WhatsApp and get personalized recommendations instantly.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium inline-flex items-center gap-2"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom spacer for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Index;
