// Global type declarations for third-party scripts

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
    gtag?: (event: string, action: string, parameters?: Record<string, any>) => void;
    va?: (event: string, action: string, parameters?: Record<string, any>) => void;
    va?: (event: string, parameters?: Record<string, any>) => void;
    pageLoadTime?: number;
    trackSEOEvent?: (eventName: string, parameters?: Record<string, any>) => void;
    trackPageView?: () => void;
    seoAnalytics?: {
      trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
      trackPageView: () => void;
      handleEditorFocus: () => void;
      handleSearch: (query: string) => void;
      handleExampleLoaded: (exampleTitle: string) => void;
      handleSocialShare: (platform: string) => void;
    };
  }
}

export {};