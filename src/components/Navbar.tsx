import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#sobre", label: "Quem Somos" },
  { href: "#canais", label: "Canais" },
  { href: "#recursos", label: "Vantagens" },
  { href: "#planos", label: "Nossos Planos" },
  { href: "#faq", label: "Dúvidas" },
  { href: "#contato", label: "Fale Conosco" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section using Intersection Observer
  useEffect(() => {
    const sectionIds = navLinks.map(link => link.href.replace("#", ""));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(href);
  };

  const isActive = (href: string) => activeSection === href;

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${isScrolled 
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-subtle-border" 
            : "bg-transparent"
          }
        `}
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-background rounded-md"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="text-xl font-bold">
                <span className="text-foreground">Mundo</span>
                <span className="text-[#FFD700]"> Play</span>
                <span className="text-foreground"> TV</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`
                      px-4 py-2 rounded-md
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-background
                      font-medium text-sm relative
                      ${isActive(link.href) 
                        ? "text-[#FFD700]" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="activeSection"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#FFD700] rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              ))}
              <li className="ml-2">
                <a
                  href="https://wa.me/5521966238378?text=Olá!%20Quero%20testar%20o%20IPTV%20gratuitamente."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-md
                    bg-[#FFD700] text-black font-semibold text-sm
                    hover:bg-[#FFC000]
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-background
                  "
                >
                  Teste Grátis
                </a>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                md:hidden p-2 rounded-md
                text-foreground hover:bg-muted/50
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-background
              "
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="
              fixed top-16 left-0 right-0 z-40
              bg-background/98 backdrop-blur-md
              border-b border-subtle-border shadow-xl
              md:hidden
            "
            role="menu"
          >
            <ul className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className={`
                      block px-4 py-3 rounded-md
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-[#FFD700]
                      font-medium
                      ${isActive(link.href) 
                        ? "text-[#FFD700] bg-muted/30" 
                        : "text-foreground hover:bg-muted/50"
                      }
                    `}
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="https://wa.me/5521966238378?text=Olá!%20Quero%20testar%20o%20IPTV%20gratuitamente."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    block text-center px-4 py-3 rounded-md
                    bg-[#FFD700] text-black font-semibold
                    hover:bg-[#FFC000]
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#FFD700]
                  "
                  role="menuitem"
                >
                  Teste Grátis
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
