import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import FreeTrialBanner from "@/components/sections/FreeTrialBanner";
import Guarantee from "@/components/sections/Guarantee";
import VODRequest from "@/components/sections/VODRequest";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <About />
      <Features />
      <FreeTrialBanner />
      <Guarantee />
      <VODRequest />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
};

export default Index;
