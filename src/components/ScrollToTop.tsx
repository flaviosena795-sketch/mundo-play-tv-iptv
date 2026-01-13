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
            bg-[#FFD700] hover:bg-[#FFC000] text-black
            w-14 h-14 rounded-full
            flex items-center justify-center
            shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:shadow-[0_0_30px_rgba(255,215,0,0.8)]
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-background
            border-2 border-[#FFC000]
          "
          aria-label="Voltar ao topo da página"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
