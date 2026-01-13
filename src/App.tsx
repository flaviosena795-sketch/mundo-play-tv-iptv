import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import { SimplePageSkeleton } from "./components/PageSkeleton";

// Lazy load secondary pages to reduce initial bundle size
const Success = lazy(() => import("./pages/Success"));
const Failure = lazy(() => import("./pages/Failure"));
const Pending = lazy(() => import("./pages/Pending"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Use skeleton loader for better UX
const PageLoader = () => <SimplePageSkeleton />;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FloatingWhatsApp />
      <ScrollToTop />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sucesso" element={<Suspense fallback={<PageLoader />}><Success /></Suspense>} />
          <Route path="/pendente" element={<Suspense fallback={<PageLoader />}><Pending /></Suspense>} />
          <Route path="/falha" element={<Suspense fallback={<PageLoader />}><Failure /></Suspense>} />
          <Route path="/termos" element={<Suspense fallback={<PageLoader />}><TermsOfService /></Suspense>} />
          <Route path="/privacidade" element={<Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
