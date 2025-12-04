import Hero from "@/components/sections/Hero";
import Announcement from "@/components/sections/Announcement";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import FreeTrialBanner from "@/components/sections/FreeTrialBanner";
import Plans from "@/components/sections/Plans";
import PlansComparison from "@/components/sections/PlansComparison";
import Guarantee from "@/components/sections/Guarantee";
import PaymentMethods from "@/components/sections/PaymentMethods";
import Pagamento from "@/components/sections/Pagamento";
import VODRequest from "@/components/sections/VODRequest";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Announcement />
      <About />
      <Features />
      <FreeTrialBanner />
      <Plans />
      <PlansComparison />
      <Guarantee />
      <PaymentMethods />
      <Pagamento />
      <VODRequest />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
};

export default Index;
