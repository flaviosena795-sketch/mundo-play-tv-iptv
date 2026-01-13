import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar botão quando rolar mais de 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // GA4 event tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "scroll_to_top", {
        event_category: "engagement",
        event_label: "Scroll to Top Button",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="
            fixed bottom-6 left-6 z-50
            bg-gradient-gold text-accent-foreground
            w-12 h-12 rounded-full
            flex items-center justify-center
            shadow-gold hover:shadow-premium
            transition-shadow duration-300
            focus:outline-none focus:ring-2 focus:ring-premium-gold focus:ring-offset-2 focus:ring-offset-background
          "
          aria-label="Voltar ao topo da página"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
