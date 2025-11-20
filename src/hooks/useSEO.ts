import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type SEOFeature = 'landing' | 'editor' | 'tutorial' | 'practice' | 'syntax' | 'exam';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface UseSEOOptions {
  feature?: SEOFeature;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  trackEvent?: boolean;
  eventName?: string;
  eventParams?: Record<string, any>;
}

const seoConfig: Record<SEOFeature, SEOData> = {
  landing: {
    title: 'PseudoRun - #1 IGCSE Pseudocode Editor & Simulator',
    description: 'Practice IGCSE pseudocode with PseudoRun - the free online editor designed for Computer Science students. Perfect for exam preparation with real-time validation.',
    keywords: 'IGCSE pseudocode editor, pseudocode simulator, IGCSE computer science, pseudocode practice, computer science tool',
    ogImage: 'https://pseudorun.com/og-image.png',
    canonicalUrl: 'https://pseudorun.com'
  },
  editor: {
    title: 'PseudoRun - Practice IGCSE Pseudocode Online',
    description: 'Write and test IGCSE pseudocode instantly. PseudoRun offers syntax highlighting, debugging, and export features to help you ace your exams.',
    keywords: 'IGCSE pseudocode editor, online pseudocode writer, pseudocode debugger, IGCSE CS practice',
    ogImage: 'https://pseudorun.com/editor-og-image.png',
    canonicalUrl: 'https://pseudorun.com/?action=editor'
  },
  tutorial: {
    title: 'Learn IGCSE Pseudocode - Free Tutorial | PseudoRun',
    description: 'Master IGCSE pseudocode with our comprehensive tutorial. Learn algorithms, loops, arrays, and procedures step-by-step.',
    keywords: 'IGCSE pseudocode tutorial, learn pseudocode, pseudocode guide, computer science tutorial',
    ogImage: 'https://pseudorun.com/tutorial-og-image.png',
    canonicalUrl: 'https://pseudorun.com/?action=tutorial'
  },
  practice: {
    title: 'IGCSE Pseudocode Practice Problems | PseudoRun',
    description: 'Test your skills with IGCSE pseudocode practice problems. From basic concepts to advanced algorithms, prepare for your exams.',
    keywords: 'IGCSE pseudocode practice, pseudocode exercises, computer science problems, exam practice',
    ogImage: 'https://pseudorun.com/practice-og-image.png',
    canonicalUrl: 'https://pseudorun.com/?action=practice'
  },
  syntax: {
    title: 'IGCSE Pseudocode Syntax Reference | PseudoRun',
    description: 'Complete IGCSE pseudocode syntax reference. Learn proper syntax, commands, and structures for pseudocode programming.',
    keywords: 'IGCSE pseudocode syntax, pseudocode reference, pseudocode commands, computer science syntax',
    ogImage: 'https://pseudorun.com/syntax-og-image.png',
    canonicalUrl: 'https://pseudorun.com/?action=syntax-reference'
  },
  exam: {
    title: 'IGCSE Exam Mode - Timed Pseudocode Practice | PseudoRun',
    description: 'Practice IGCSE pseudocode under exam conditions with timed challenges. Build speed and confidence for your Computer Science exams.',
    keywords: 'IGCSE exam practice, timed pseudocode, exam simulator, computer science exam preparation',
    ogImage: 'https://pseudorun.com/exam-og-image.png',
    canonicalUrl: 'https://pseudorun.com/?action=exam-mode',
    noIndex: true
  }
};

export const useSEO = (options: UseSEOOptions = {}) => {
  const location = useLocation();
  const previousPathRef = useRef<string>('');
  const {
    feature = 'landing',
    customTitle,
    customDescription,
    customKeywords,
    trackEvent = false,
    eventName,
    eventParams = {}
  } = options;

  useEffect(() => {
    const config = seoConfig[feature] || seoConfig.landing;
    const currentPath = location.pathname + location.search;

    // Only update if path has changed
    if (currentPath !== previousPathRef.current) {
      const finalSEOData: SEOData = {
        ...config,
        title: customTitle || config.title,
        description: customDescription || config.description,
        keywords: customKeywords || config.keywords
      };

      // Update page title
      document.title = finalSEOData.title;

      // Update meta tags
      updateMetaTag('description', finalSEOData.description);
      if (finalSEOData.keywords) {
        updateMetaTag('keywords', finalSEOData.keywords);
      }

      // Update Open Graph tags
      updateMetaProperty('og:title', finalSEOData.title);
      updateMetaProperty('og:description', finalSEOData.description);
      updateMetaProperty('og:image', finalSEOData.ogImage);
      updateMetaProperty('og:url', finalSEOData.canonicalUrl || window.location.href);

      // Update Twitter Card tags
      updateMetaProperty('twitter:card', 'summary_large_image');
      updateMetaProperty('twitter:title', finalSEOData.title);
      updateMetaProperty('twitter:description', finalSEOData.description);
      updateMetaProperty('twitter:image', finalSEOData.ogImage);

      // Update canonical URL
      updateCanonicalUrl(finalSEOData.canonicalUrl || window.location.href.split('?')[0]);

      // Update robots meta tag
      if (finalSEOData.noIndex) {
        updateMetaTag('robots', 'noindex, nofollow');
      }

      // Track page view and custom events
      trackPageView(finalSEOData.title);

      if (trackEvent && eventName) {
        trackCustomEvent(eventName, eventParams);
      }

      previousPathRef.current = currentPath;
    }
  }, [feature, customTitle, customDescription, customKeywords, trackEvent, eventName, eventParams, location]);

  const trackPageView = (title: string) => {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
        page_title: title
      });
    }

    // Vercel Analytics tracking (automatically tracks page views)
    if (typeof window !== 'undefined' && window.va) {
      window.va('pageview');
    }
  };

  const trackCustomEvent = (eventName: string, params: Record<string, any> = {}) => {
    // Google Analytics event tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...params,
        custom_map: { custom_parameter_1: 'feature' }
      });
    }

    // Vercel Analytics custom events
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', eventName);
    }
  };

  const updateMetaTag = (name: string, content?: string) => {
    if (!content) return;

    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const updateMetaProperty = (property: string, content?: string) => {
    if (!content) return;

    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const updateCanonicalUrl = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  };

  return {
    trackEvent: trackCustomEvent,
    updateSEO: (newOptions: Partial<UseSEOOptions>) => {
      // Immediate SEO update for dynamic content
      if (newOptions.customTitle) {
        document.title = newOptions.customTitle;
        updateMetaProperty('og:title', newOptions.customTitle);
        updateMetaProperty('twitter:title', newOptions.customTitle);
      }

      if (newOptions.customDescription) {
        updateMetaTag('description', newOptions.customDescription);
        updateMetaProperty('og:description', newOptions.customDescription);
        updateMetaProperty('twitter:description', newOptions.customDescription);
      }

      if (newOptions.eventName && newOptions.trackEvent) {
        trackCustomEvent(newOptions.eventName, newOptions.eventParams);
      }
    }
  };
};

export default useSEO;