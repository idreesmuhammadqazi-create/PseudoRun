import { useEffect } from 'react';
import { STRUCTURED_DATA, FAQ_CONTENT } from '../../constants/seoContent';

interface StructuredDataProps {
  type?: 'organization' | 'software' | 'course' | 'faq' | 'custom';
  customData?: Record<string, any>;
  pageContext?: 'landing' | 'editor' | 'tutorial' | 'practice' | 'syntax' | 'exam';
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'organization',
  customData,
  pageContext = 'landing'
}) => {
  useEffect(() => {
    // Generate appropriate structured data based on type and context
    const structuredData = generateStructuredData(type, pageContext, customData);
    injectStructuredData(structuredData);
  }, [type, pageContext, customData]);

  const generateStructuredData = (
    dataType: string,
    context: string,
    custom?: Record<string, any>
  ): Record<string, any> => {
    switch (dataType) {
      case 'organization':
        return {
          ...STRUCTURED_DATA.organization,
          ...getContextualData(context),
          ...custom
        };

      case 'software':
        return {
          ...STRUCTURED_DATA.softwareApp,
          ...getContextualData(context),
          ...custom
        };

      case 'course':
        return {
          ...STRUCTURED_DATA.course,
          ...getContextualData(context),
          ...custom
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_CONTENT.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      case 'custom':
        return custom || {};

      default:
        return STRUCTURED_DATA.organization;
    }
  };

  const getContextualData = (context: string): Record<string, any> => {
    const contextData: Record<string, any> = {
      landing: {
        name: "PseudoRun - IGCSE Pseudocode Editor Landing Page",
        description: "The #1 free online IGCSE pseudocode editor for Computer Science students. Start practicing pseudocode today with real-time validation.",
        url: "https://pseudorun.com"
      },
      editor: {
        name: "PseudoRun - IGCSE Pseudocode Editor",
        description: "Write and test IGCSE pseudocode instantly with syntax highlighting, debugging, and real-time validation.",
        url: "https://pseudorun.com/?action=editor"
      },
      tutorial: {
        name: "IGCSE Pseudocode Tutorial - PseudoRun",
        description: "Complete IGCSE pseudocode tutorial covering all syllabus topics with step-by-step examples and exercises.",
        url: "https://pseudorun.com/?action=tutorial"
      },
      practice: {
        name: "IGCSE Pseudocode Practice Problems - PseudoRun",
        description: "Practice IGCSE pseudocode with 50+ problems covering all exam topics. Build confidence for your Computer Science exams.",
        url: "https://pseudorun.com/?action=practice"
      },
      syntax: {
        name: "IGCSE Pseudocode Syntax Reference - PseudoRun",
        description: "Complete reference for Cambridge IGCSE pseudocode syntax, commands, and programming structures.",
        url: "https://pseudorun.com/?action=syntax-reference"
      },
      exam: {
        name: "IGCSE Pseudocode Exam Mode - PseudoRun",
        description: "Practice IGCSE pseudocode under timed exam conditions. Perfect preparation for Computer Science exams.",
        url: "https://pseudorun.com/?action=exam-mode"
      }
    };

    return contextData[context] || contextData.landing;
  };

  const injectStructuredData = (data: Record<string, any>) => {
    // Remove existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  };

  // This component doesn't render anything visible
  return null;
};

// Specialized structured data components
export const EducationalOrganizationSchema = () => (
  <StructuredData
    type="organization"
    customData={{
      educationalLevel: "High School",
      about: [
        "IGCSE Computer Science",
        "Pseudocode Programming",
        "Algorithm Design",
        "Computational Thinking"
      ],
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student"
      },
      teaches: [
        "IGCSE Pseudocode Syntax",
        "Algorithm Development",
        "Problem Solving",
        "Programming Fundamentals"
      ]
    }}
  />
);

export const SoftwareApplicationSchema = () => (
  <StructuredData
    type="software"
    customData={{
      applicationSubCategory: "Educational Software",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1000",
        bestRating: "5",
        worstRating: "1"
      },
      review: [
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "IGCSE Student"
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
          },
          reviewBody: "Perfect tool for practicing IGCSE pseudocode. Helped me score 95% on my Computer Science exam!"
        }
      ]
    }}
  />
);

export const CourseSchema = () => (
  <StructuredData
    type="course"
    customData={{
      provider: {
        "@type": "Organization",
        name: "PseudoRun",
        url: "https://pseudorun.com"
      },
      educationalLevel: "High School",
      about: "IGCSE Computer Science Pseudocode",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        instructor: {
          "@type": "Organization",
          name: "PseudoRun"
        }
      },
      syllabusSections: [
        "Basic Input/Output Operations",
        "Conditional Statements",
        "Loops and Iteration",
        "Arrays and Data Structures",
        "Functions and Procedures",
        "File Operations",
        "Algorithm Design"
      ]
    }}
  />
);

export const FAQSchema = () => (
  <StructuredData type="faq" />
);

// Combined structured data for the main landing page
export const LandingPageStructuredData = () => (
  <>
    <EducationalOrganizationSchema />
    <SoftwareApplicationSchema />
    <FAQSchema />
    <StructuredData
      type="custom"
      customData={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "PseudoRun - #1 IGCSE Pseudocode Editor & Simulator",
        description: "Practice IGCSE pseudocode with PseudoRun - the free online editor designed for Computer Science students. Perfect for exam preparation with real-time validation.",
        url: "https://pseudorun.com",
        mainEntity: {
          "@type": "EducationalOrganization",
          name: "PseudoRun"
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://pseudorun.com"
            }
          ]
        }
      }}
    />
  </>
);

export default StructuredData;