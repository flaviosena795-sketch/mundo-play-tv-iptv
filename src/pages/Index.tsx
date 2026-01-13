import { useEffect } from "react";
import Hero from "@/components/sections/Hero";
import Announcement from "@/components/sections/Announcement";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import FreeTrialBanner from "@/components/sections/FreeTrialBanner";
import Plans from "@/components/sections/Plans";
import PlansComparison from "@/components/sections/PlansComparison";
import PaymentMethods from "@/components/sections/PaymentMethods";
import VODRequest from "@/components/sections/VODRequest";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import useAnalytics from "@/hooks/useAnalytics";

const Index = () => {
  const { trackSectionView } = useAnalytics();

  // Track section visibility with Intersection Observer
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const trackedSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (entry.isIntersecting && !trackedSections.has(sectionId)) {
            trackedSections.add(sectionId);
            trackSectionView(sectionId);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [trackSectionView]);

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Announcement />
      <About />
      <Features />
      <FreeTrialBanner />
      <Plans />
      <PlansComparison />
      <PaymentMethods />
      <VODRequest />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
