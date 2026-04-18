import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOContent } from '../../constants/seoContent';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  hreflang?: string[];
  structuredData?: Record<string, any>;
  preconnectUrls?: string[];
  dnsPrefetchUrls?: string[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false,
  hreflang = ['en'],
  structuredData,
  preconnectUrls = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ],
  dnsPrefetchUrls = [
    '//www.google-analytics.com',
    '//www.googletagmanager.com',
    '//cdn.jsdelivr.net'
  ]
}) => {
  const location = useLocation();

  useEffect(() => {
    // Update page title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('googlebot', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('author', 'PseudoRun');
    updateMetaTag('publisher', 'PseudoRun');
    updateMetaTag('language', 'English');
    updateMetaTag('geo.region', 'US');
    updateMetaTag('geo.placename', 'Worldwide');
    updateMetaTag('rating', 'general');
    updateMetaTag('distribution', 'global');
    updateMetaTag('document-type', 'Public');
    updateMetaTag('copyright', 'PseudoRun');
    updateMetaTag('classification', 'Education');

    // Update Open Graph tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:image:width', '1200');
    updateMetaProperty('og:image:height', '630');
    updateMetaProperty('og:type', ogType);
    updateMetaProperty('og:url', canonicalUrl || window.location.href);
    updateMetaProperty('og:site_name', 'PseudoRun');
    updateMetaProperty('og:locale', 'en_US');

    // Update Twitter Card tags
    updateMetaProperty('twitter:card', twitterCard);
    updateMetaProperty('twitter:title', title);
    updateMetaProperty('twitter:description', description);
    updateMetaProperty('twitter:image', ogImage);
    updateMetaProperty('twitter:creator', '@pseudorun');
    updateMetaProperty('twitter:site', '@pseudorun');

    // Update canonical URL
    updateCanonicalUrl(canonicalUrl || window.location.href.split('?')[0]);

    // Update hreflang tags for international SEO
    updateHreflangTags(hreflang, canonicalUrl || window.location.href);

    // Update preconnect and DNS prefetch
    updatePreconnect(preconnectUrls);
    updateDnsPrefetch(dnsPrefetchUrls);

    // Update theme color
    updateMetaTag('theme-color', '#2563eb');
    updateMetaTag('msapplication-TileColor', '#2563eb');

    // Update structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    // Update security headers
    updateMetaHttpEquiv('X-Content-Type-Options', 'nosniff');
    updateMetaHttpEquiv('X-Frame-Options', 'DENY');
    updateMetaHttpEquiv('X-XSS-Protection', '1; mode=block');
    updateMetaHttpEquiv('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Update viewport and mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('format-detection', 'telephone=no');

    // Update manifest
    updateLinkRel('manifest', '/manifest.json');

    // Update favicons
    updateLinkRel('icon', '/favicon.ico', 'image/x-icon');
    updateLinkRel('icon', '/favicon-32x32.png', 'image/png', '32x32');
    updateLinkRel('icon', '/favicon-16x16.png', 'image/png', '16x16');
    updateLinkRel('apple-touch-icon', '/apple-touch-icon.png');

  }, [title, description, keywords, ogImage, ogType, twitterCard, canonicalUrl, noIndex, hreflang, structuredData, preconnectUrls, dnsPrefetchUrls, location]);

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

  const updateMetaHttpEquiv = (httpEquiv: string, content: string) => {
    let meta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.httpEquiv = httpEquiv;
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

  const updateHreflangTags = (languages: string[], baseUrl: string) => {
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());

    // Add new hreflang tags
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = baseUrl;
      document.head.appendChild(link);
    });

    // Add x-default for international targeting
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = baseUrl;
    document.head.appendChild(defaultLink);
  };

  const updatePreconnect = (urls: string[]) => {
    // Remove existing preconnect tags
    document.querySelectorAll('link[rel="preconnect"]').forEach(tag => tag.remove());

    // Add new preconnect tags
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      if (url.includes('fonts.gstatic.com')) {
        link.setAttribute('crossorigin', 'anonymous');
      }
      document.head.appendChild(link);
    });
  };

  const updateDnsPrefetch = (urls: string[]) => {
    // Remove existing DNS prefetch tags
    document.querySelectorAll('link[rel="dns-prefetch"]').forEach(tag => tag.remove());

    // Add new DNS prefetch tags
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  };

  const updateLinkRel = (rel: string, href: string, type?: string, sizes?: string) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
    if (type) link.type = type;
    if (sizes) link.setAttribute('sizes', sizes);
  };

  const updateStructuredData = (data: Record<string, any>) => {
    // Remove existing structured data
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  };

  // This component doesn't render anything visible
  return null;
};

// Specialized SEO head components for different contexts
export const LandingPageSEOHead = () => {
  const seoContent = getSEOContent('landing');

  return (
    <SEOHead
      title={seoContent.title}
      description={seoContent.description}
      keywords={seoContent.keywords}
      ogImage={seoContent.ogImage}
      canonicalUrl={seoContent.canonicalUrl}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: seoContent.title,
        description: seoContent.description,
        url: seoContent.canonicalUrl,
        mainEntity: {
          "@type": "EducationalOrganization",
          name: "PseudoRun",
          description: "The #1 online pseudocode editor for IGCSE Computer Science students"
        }
      }}
    />
  );
};

export const EditorSEOHead = () => {
  const seoContent = getSEOContent('editor');

  return (
    <SEOHead
      title={seoContent.title}
      description={seoContent.description}
      keywords={seoContent.keywords}
      ogImage={seoContent.ogImage}
      canonicalUrl={seoContent.canonicalUrl}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "PseudoRun Editor",
        description: seoContent.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web Browser"
      }}
    />
  );
};

export const TutorialSEOHead = () => {
  const seoContent = getSEOContent('tutorial');

  return (
    <SEOHead
      title={seoContent.title}
      description={seoContent.description}
      keywords={seoContent.keywords}
      ogImage={seoContent.ogImage}
      canonicalUrl={seoContent.canonicalUrl}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "Course",
        name: seoContent.title,
        description: seoContent.description,
        educationalLevel: "High School",
        about: "IGCSE Computer Science Pseudocode"
      }}
    />
  );
};

export default SEOHead;