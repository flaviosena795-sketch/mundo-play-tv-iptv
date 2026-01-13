import { useEffect, useCallback } from 'react';

// Declare global types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const useAnalytics = () => {
  // Track custom events
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event
      });
    }
  }, []);

  // Track page views
  const trackPageView = useCallback((path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
      });
    }
  }, []);

  // Track scroll depth
  useEffect(() => {
    const scrollThresholds = [25, 50, 75, 90];
    const trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: `${threshold}%`,
            value: threshold
          });
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [trackEvent]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const timeThresholds = [30, 60, 120, 300]; // seconds
    const trackedTimes = new Set<number>();

    const checkTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      timeThresholds.forEach(threshold => {
        if (elapsedSeconds >= threshold && !trackedTimes.has(threshold)) {
          trackedTimes.add(threshold);
          trackEvent({
            action: 'time_on_page',
            category: 'engagement',
            label: `${threshold}s`,
            value: threshold
          });
        }
      });
    };

    const interval = setInterval(checkTime, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [trackEvent]);

  // Track section visibility
  const trackSectionView = useCallback((sectionId: string) => {
    trackEvent({
      action: 'section_view',
      category: 'engagement',
      label: sectionId
    });
  }, [trackEvent]);

  // Track conversion intent
  const trackConversionIntent = useCallback((type: string, details?: Record<string, any>) => {
    trackEvent({
      action: 'conversion_intent',
      category: 'conversion',
      label: type,
      ...details
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackSectionView,
    trackConversionIntent
  };
};

export default useAnalytics;
