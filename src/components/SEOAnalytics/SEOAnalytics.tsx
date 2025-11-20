import { useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';

interface SEOAnalyticsProps {
  enableTracking?: boolean;
  customDimensions?: Record<string, string>;
}

interface TrackingEvent {
  eventName: string;
  parameters?: Record<string, any>;
  userId?: string;
}

export const SEOAnalytics: React.FC<SEOAnalyticsProps> = ({
  enableTracking = true,
  customDimensions = {}
}) => {
  const eventQueueRef = useRef<TrackingEvent[]>([]);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!enableTracking || isInitializedRef.current) return;

    // Initialize analytics tracking
    initializeAnalytics();
    isInitializedRef.current = true;

    // Process any queued events
    processEventQueue();

    // Track page visibility changes for engagement metrics
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('page_hidden', {
          time_on_page: getTimeOnPage()
        });
      } else {
        trackEvent('page_visible');
      }
    };

    // Track user engagement
    const handleUserInteraction = () => {
      trackEvent('user_engagement', {
        interaction_type: 'click_or_typing'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // Track session end
    const handleBeforeUnload = () => {
      trackEvent('session_end', {
        session_duration: getTimeOnPage(),
        page_scroll_depth: getScrollDepth()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enableTracking]);

  const initializeAnalytics = () => {
    // Initialize Google Analytics (if gtag is available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'PseudoRun - IGCSE Pseudocode Editor',
        page_location: window.location.href,
        custom_map: customDimensions
      });
    }

    // Track initial page view
    trackPageView();
  };

  const processEventQueue = () => {
    while (eventQueueRef.current.length > 0) {
      const event = eventQueueRef.current.shift();
      if (event) {
        sendTrackingEvent(event);
      }
    }
  };

  const trackPageView = () => {
    const pageData = {
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      page_location: window.location.href,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      timestamp: Date.now()
    };

    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', pageData);
    }

    // Track with Vercel Analytics (automatic)
    console.log('Page view tracked:', pageData);
  };

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    const event: TrackingEvent = {
      eventName,
      parameters: {
        ...parameters,
        ...customDimensions,
        page_url: window.location.href,
        page_title: document.title,
        timestamp: Date.now()
      }
    };

    if (isInitializedRef.current) {
      sendTrackingEvent(event);
    } else {
      // Queue the event if analytics isn't ready
      eventQueueRef.current.push(event);
    }
  };

  const sendTrackingEvent = (event: TrackingEvent) => {
    // Google Analytics event tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.eventName, event.parameters);
    }

    // Vercel Analytics custom events
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', event.eventName);
    }

    console.log('Analytics event tracked:', event);
  };

  const getTimeOnPage = (): number => {
    return Math.floor((Date.now() - (window as any).pageLoadTime) / 1000);
  };

  const getScrollDepth = (): number => {
    if (typeof document === 'undefined') return 0;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round((scrollTop / documentHeight) * 100);
  };

  // Expose tracking function globally for other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackSEOEvent = trackEvent;
      (window as any).trackPageView = trackPageView;
    }
  }, []);

  // Track SEO-specific events
  useEffect(() => {
    // Track when user focuses on pseudocode editor
    const handleEditorFocus = () => {
      trackEvent('editor_focused', {
        feature: 'pseudocode_editor'
      });
    };

    // Track search queries (if implemented)
    const handleSearch = (query: string) => {
      trackEvent('search_performed', {
        search_query: query,
        search_type: 'pseudocode_help'
      });
    };

    // Track example loading
    const handleExampleLoaded = (exampleTitle: string) => {
      trackEvent('example_loaded', {
        example_title: exampleTitle,
        content_type: 'pseudocode_example'
      });
    };

    // Track social shares
    const handleSocialShare = (platform: string) => {
      trackEvent('social_share', {
        platform,
        content_type: 'pseudocode_editor'
      });
    };

    // Make these available globally
    if (typeof window !== 'undefined') {
      (window as any).seoAnalytics = {
        trackEvent,
        trackPageView,
        handleEditorFocus,
        handleSearch,
        handleExampleLoaded,
        handleSocialShare
      };
    }
  }, []);

  if (!enableTracking) {
    return null;
  }

  // This component is invisible - it only handles analytics
  return (
    <>
      <Analytics />
      {typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set page load time for time on page calculations
              window.pageLoadTime = Date.now();
            `
          }}
        />
      )}
    </>
  );
};

// Hook for components to use SEO analytics
export const useSEOAnalytics = () => {
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).trackSEOEvent) {
      (window as any).trackSEOEvent(eventName, parameters);
    }
  };

  const trackPageView = () => {
    if (typeof window !== 'undefined' && (window as any).trackPageView) {
      (window as any).trackPageView();
    }
  };

  const trackFeatureUsage = (feature: string, details?: Record<string, any>) => {
    trackEvent('feature_used', {
      feature_name: feature,
      ...details
    });
  };

  const trackUserProgress = (progressData: {
    completed_examples?: number;
    practice_score?: number;
    time_spent?: number;
  }) => {
    trackEvent('user_progress', progressData);
  };

  const trackSEOMetrics = (metrics: {
    keyword_search?: string;
    landing_source?: string;
    user_intent?: string;
  }) => {
    trackEvent('seo_metrics', metrics);
  };

  return {
    trackEvent,
    trackPageView,
    trackFeatureUsage,
    trackUserProgress,
    trackSEOMetrics
  };
};

export default SEOAnalytics;