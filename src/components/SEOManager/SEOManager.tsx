import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

interface SEOManagerProps {
  seoData?: Partial<SEOData>;
  feature?: 'landing' | 'editor' | 'tutorial' | 'practice' | 'syntax' | 'exam';
}

const defaultSEOData: Record<string, SEOData> = {
  landing: {
    title: 'PseudoRun - #1 IGCSE Pseudocode Editor & Simulator',
    description: 'Practice IGCSE pseudocode with PseudoRun - the free online editor designed for Computer Science students. Perfect for exam preparation with real-time validation.',
    keywords: 'IGCSE pseudocode editor, pseudocode simulator, IGCSE computer science, pseudocode practice, computer science tool',
    ogImage: 'https://pseudorun.com/og-image.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://pseudorun.com',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'PseudoRun',
      description: 'The #1 online pseudocode editor for IGCSE Computer Science students',
      url: 'https://pseudorun.com',
      educationalLevel: 'High School',
      about: 'IGCSE Computer Science Pseudocode'
    }
  },
  editor: {
    title: 'PseudoRun - Practice IGCSE Pseudocode Online',
    description: 'Write and test IGCSE pseudocode instantly. PseudoRun offers syntax highlighting, debugging, and export features to help you ace your exams.',
    keywords: 'IGCSE pseudocode editor, online pseudocode writer, pseudocode debugger, IGCSE CS practice',
    ogImage: 'https://pseudorun.com/editor-og-image.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://pseudorun.com/?action=editor',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PseudoRun Editor',
      applicationCategory: 'EducationalApplication',
      description: 'Online IGCSE pseudocode editor with real-time validation and debugging',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  },
  tutorial: {
    title: 'Learn IGCSE Pseudocode - Free Tutorial | PseudoRun',
    description: 'Master IGCSE pseudocode with our comprehensive tutorial. Learn algorithms, loops, arrays, and procedures step-by-step.',
    keywords: 'IGCSE pseudocode tutorial, learn pseudocode, pseudocode guide, computer science tutorial',
    ogImage: 'https://pseudorun.com/tutorial-og-image.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://pseudorun.com/?action=tutorial',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'IGCSE Pseudocode Tutorial',
      description: 'Complete guide to mastering IGCSE pseudocode programming',
      educationalLevel: 'High School',
      about: 'IGCSE Computer Science Pseudocode',
      provider: {
        '@type': 'Organization',
        name: 'PseudoRun'
      }
    }
  },
  practice: {
    title: 'IGCSE Pseudocode Practice Problems | PseudoRun',
    description: 'Test your skills with IGCSE pseudocode practice problems. From basic concepts to advanced algorithms, prepare for your exams.',
    keywords: 'IGCSE pseudocode practice, pseudocode exercises, computer science problems, exam practice',
    ogImage: 'https://pseudorun.com/practice-og-image.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://pseudorun.com/?action=practice',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'IGCSE Pseudocode Practice Problems',
      description: 'Interactive pseudocode exercises for IGCSE Computer Science exam preparation',
      educationalLevel: 'High School',
      about: 'IGCSE Computer Science Pseudocode'
    }
  },
  syntax: {
    title: 'IGCSE Pseudocode Syntax Reference | PseudoRun',
    description: 'Complete IGCSE pseudocode syntax reference. Learn proper syntax, commands, and structures for pseudocode programming.',
    keywords: 'IGCSE pseudocode syntax, pseudocode reference, pseudocode commands, computer science syntax',
    ogImage: 'https://pseudorun.com/syntax-og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
    canonicalUrl: 'https://pseudorun.com/?action=syntax-reference'
  },
  exam: {
    title: 'IGCSE Exam Mode - Timed Pseudocode Practice | PseudoRun',
    description: 'Practice IGCSE pseudocode under exam conditions with timed challenges. Build speed and confidence for your Computer Science exams.',
    keywords: 'IGCSE exam practice, timed pseudocode, exam simulator, computer science exam preparation',
    ogImage: 'https://pseudorun.com/exam-og-image.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://pseudorun.com/?action=exam-mode',
    noIndex: true
  }
};

export const SEOManager: React.FC<SEOManagerProps> = ({
  seoData: customSeoData = {},
  feature = 'landing'
}) => {
  const location = useLocation();

  useEffect(() => {
    const defaultData = defaultSEOData[feature] || defaultSEOData.landing;
    const finalSEOData: SEOData = { ...defaultData, ...customSeoData };

    // Update document title
    if (finalSEOData.title) {
      document.title = finalSEOData.title;
    }

    // Update or create meta description
    updateMetaTag('description', finalSEOData.description);

    // Update keywords
    if (finalSEOData.keywords) {
      updateMetaTag('keywords', finalSEOData.keywords);
    }

    // Update Open Graph tags
    updateMetaProperty('og:title', finalSEOData.title);
    updateMetaProperty('og:description', finalSEOData.description);
    updateMetaProperty('og:image', finalSEOData.ogImage);
    updateMetaProperty('og:type', finalSEOData.ogType || 'website');
    updateMetaProperty('og:url', finalSEOData.canonicalUrl || window.location.href);

    // Update Twitter Card tags
    updateMetaProperty('twitter:card', finalSEOData.twitterCard || 'summary_large_image');
    updateMetaProperty('twitter:title', finalSEOData.title);
    updateMetaProperty('twitter:description', finalSEOData.description);
    updateMetaProperty('twitter:image', finalSEOData.ogImage);

    // Update canonical URL
    updateCanonicalUrl(finalSEOData.canonicalUrl || window.location.href.split('?')[0]);

    // Update robots meta tag
    if (finalSEOData.noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // Update structured data
    if (finalSEOData.structuredData) {
      updateStructuredData(finalSEOData.structuredData);
    }

    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
        page_title: finalSEOData.title
      });
    }

  }, [feature, customSeoData, location]);

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

  const updateStructuredData = (data: Record<string, any>) => {
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data, null, 2);
  };

  // This component doesn't render anything visible
  return null;
};

export default SEOManager;