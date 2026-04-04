import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpg";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl bg-primary/20 scale-150" />
              <motion.img
                src={logo}
                alt="Global Enterprises"
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover shadow-2xl shadow-primary/30 border-2 border-primary/20"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="text-lg md:text-xl font-heading tracking-[0.3em] uppercase text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Global Enterprises
              </motion.div>
              <motion.div
                className="h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 140 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
