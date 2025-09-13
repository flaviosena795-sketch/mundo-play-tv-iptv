import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import FreeTrialBanner from "@/components/sections/FreeTrialBanner";
import Plans from "@/components/sections/Plans";
import PaymentMethods from "@/components/sections/PaymentMethods";
import Testimonials from "@/components/sections/Testimonials";
import FinalCTA from "@/components/sections/FinalCTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <About />
      <Features />
      <FreeTrialBanner />
      <Plans />
      <PaymentMethods />
      <Testimonials />
      <FinalCTA />
    </main>
  );
};

export default Index;
