import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBanner, Banner } from "@/data/products";

const PromoBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const load = () => setBanner(getBanner());
    load();
    window.addEventListener("storage", load);
    window.addEventListener("ge-banner-changed", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("ge-banner-changed", load);
    };
  }, []);

  return (
    <AnimatePresence>
      {banner?.image && (
        <motion.section
          key="promo-banner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="py-8 md:py-12"
        >
          <div className="container mx-auto px-3 sm:px-4">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative rounded-2xl md:rounded-3xl overflow-hidden glass-card group flex items-center justify-center"
            >
              {banner.link ? (
                <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block">
                  <BannerImage banner={banner} />
                </a>
              ) : (
                <BannerImage banner={banner} />
              )}
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

const BannerImage = ({ banner }: { banner: Banner }) => (
  <img
    src={banner.image}
    alt={banner.alt || "Promotional banner"}
    className="w-auto h-auto max-w-full max-h-[85vh] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
    loading="eager"
  />
);

export default PromoBanner;