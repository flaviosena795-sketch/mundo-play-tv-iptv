import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="max-w-4xl w-full text-center space-y-8">
      {/* Badge */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64 rounded-full" />
      </div>
      
      {/* Title */}
      <div className="space-y-4">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-2/3 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Skeleton className="h-14 w-48 mx-auto sm:mx-0" />
        <Skeleton className="h-14 w-40 mx-auto sm:mx-0" />
      </div>
    </div>
  </div>
);

const PlansSkeleton = () => (
  <div className="py-20 bg-background px-4">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <Skeleton className="h-12 w-72 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-border bg-card space-y-6">
            {/* Plan Header */}
            <div className="text-center space-y-3">
              <Skeleton className="h-8 w-24 mx-auto" />
              <Skeleton className="h-10 w-32 mx-auto" />
            </div>
            
            {/* Features */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
            
            {/* Button */}
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="py-20 bg-card px-4">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-background space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FAQSkeleton = () => (
  <div className="py-20 bg-background px-4">
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-6 w-72 mx-auto" />
      </div>
      
      {/* FAQ Items */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Full page skeleton that combines all sections
export const FullPageSkeleton = () => (
  <div className="min-h-screen bg-background animate-pulse">
    <HeroSkeleton />
  </div>
);

// Simple loader for secondary pages
export const SimplePageSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-muted rounded-full" />
      <div className="absolute inset-0 w-16 h-16 border-4 border-t-premium-gold rounded-full animate-spin" />
    </div>
    <div className="text-center space-y-2">
      <Skeleton className="h-6 w-48 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  </div>
);

// Export individual skeletons for potential future use
export { HeroSkeleton, PlansSkeleton, TestimonialsSkeleton, FAQSkeleton };

export default FullPageSkeleton;
