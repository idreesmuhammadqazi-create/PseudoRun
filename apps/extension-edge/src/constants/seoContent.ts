/**
 * SEO Content Constants for PseudoRun
 * Centralized SEO-friendly content management
 */

// Meta descriptions for different app contexts
export const META_DESCRIPTIONS = {
  landing: "Practice IGCSE pseudocode with PseudoRun - the free online editor designed for Computer Science students. Perfect for exam preparation with real-time validation.",
  editor: "Write and test IGCSE pseudocode instantly. PseudoRun offers syntax highlighting, debugging, and export features to help you ace your exams.",
  tutorial: "Master IGCSE pseudocode with our comprehensive tutorial. Learn algorithms, loops, arrays, and procedures step-by-step.",
  practice: "Test your skills with IGCSE pseudocode practice problems. From basic concepts to advanced algorithms, prepare for your exams.",
  syntax: "Complete IGCSE pseudocode syntax reference. Learn proper syntax, commands, and structures for pseudocode programming.",
  exam: "Practice IGCSE pseudocode under exam conditions with timed challenges. Build speed and confidence for your Computer Science exams."
};

// Page titles with SEO optimization
export const PAGE_TITLES = {
  landing: "PseudoRun - #1 IGCSE Pseudocode Editor & Simulator",
  editor: "PseudoRun - Practice IGCSE Pseudocode Online",
  tutorial: "Learn IGCSE Pseudocode - Free Tutorial | PseudoRun",
  practice: "IGCSE Pseudocode Practice Problems | PseudoRun",
  syntax: "IGCSE Pseudocode Syntax Reference | PseudoRun",
  exam: "IGCSE Exam Mode - Timed Pseudocode Practice | PseudoRun"
};

// SEO keywords by feature
export const SEO_KEYWORDS = {
  primary: "IGCSE pseudocode editor, pseudocode simulator, IGCSE computer science, pseudocode practice, computer science pseudocode tool",
  landing: "IGCSE pseudocode editor, PseudoRun, Cambridge IGCSE, computer science exam, pseudocode practice online, free pseudocode tool",
  editor: "online pseudocode editor, IGCSE pseudocode writer, pseudocode debugger, syntax highlighting, real-time validation",
  tutorial: "IGCSE pseudocode tutorial, learn pseudocode, pseudocode guide, computer science tutorial, algorithm tutorial",
  practice: "IGCSE pseudocode practice, pseudocode exercises, computer science problems, exam practice, algorithm problems",
  syntax: "IGCSE pseudocode syntax, pseudocode reference, pseudocode commands, computer science syntax, Cambridge syntax",
  exam: "IGCSE exam practice, timed pseudocode, exam simulator, computer science exam preparation, practice under pressure"
};

// Structured data templates
export const STRUCTURED_DATA = {
  organization: {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "PseudoRun",
    description: "The #1 online pseudocode editor for IGCSE Computer Science students",
    url: "https://pseudorun.com",
    educationalLevel: "High School",
    about: "IGCSE Computer Science Pseudocode",
    applicationCategory: "EducationalApplication"
  },
  softwareApp: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PseudoRun",
    applicationCategory: "EducationalApplication",
    description: "Free online IGCSE pseudocode editor and simulator for computer science students",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  },
  course: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "IGCSE Pseudocode Tutorial",
    description: "Complete guide to mastering IGCSE pseudocode programming",
    educationalLevel: "High School",
    about: "IGCSE Computer Science Pseudocode",
    provider: {
      "@type": "Organization",
      name: "PseudoRun"
    }
  }
};

// Social media sharing content
export const SOCIAL_SHARE_CONTENT = {
  twitter: {
    text: "Practice IGCSE pseudocode with PseudoRun - the free online editor for Computer Science students. Perfect for exam preparation!",
    hashtags: ["IGCSE", "ComputerScience", "Pseudocode", "PseudoRun", "ExamPrep"]
  },
  facebook: {
    title: "PseudoRun - #1 IGCSE Pseudocode Editor",
    description: "Master IGCSE pseudocode with the free online editor designed for Computer Science students. Real-time validation, debugging, and practice problems included.",
    hashtags: "#IGCSE #ComputerScience #Pseudocode #ExamPreparation"
  },
  linkedin: {
    title: "PseudoRun - IGCSE Pseudocode Editor for Computer Science Education",
    description: "Supporting IGCSE Computer Science students with comprehensive pseudocode practice tools, tutorials, and exam preparation features.",
    hashtags: "#IGCSE #ComputerScience #Education #Pseudocode #STEM"
  }
};

// Value propositions and benefits
export const VALUE_PROPOSITIONS = {
  primary: "The #1 free IGCSE pseudocode editor for Computer Science exam success",
  features: [
    "100% Cambridge IGCSE aligned",
    "Real-time syntax validation",
    "Step-by-step debugging",
    "50+ practice problems",
    "Timed exam mode",
    "Free cloud storage"
  ],
  benefits: [
    "Master pseudocode concepts",
    "Prepare for IGCSE exams",
    "Build programming confidence",
    "Learn at your own pace",
    "Practice anywhere, anytime"
  ],
  targetAudience: "IGCSE Computer Science students preparing for their exams"
};

// FAQ content for structured data
export const FAQ_CONTENT = [
  {
    question: "What is PseudoRun?",
    answer: "PseudoRun is the #1 free online IGCSE pseudocode editor and simulator designed specifically for Cambridge Computer Science students. It helps you practice, debug, and master pseudocode for exam success."
  },
  {
    question: "Is PseudoRun really free?",
    answer: "Yes! PseudoRun is completely free with no hidden costs. You can practice unlimited pseudocode problems, use all features, and save your programs without any payment required."
  },
  {
    question: "Does PseudoRun follow Cambridge IGCSE specifications?",
    answer: "Absolutely! PseudoRun is 100% aligned with Cambridge IGCSE Computer Science pseudocode specifications. All syntax, commands, and examples follow the official syllabus."
  },
  {
    question: "Can I use PseudoRun for exam preparation?",
    answer: "Yes, PseudoRun is perfect for IGCSE exam preparation. It includes timed exam mode, practice problems covering all syllabus topics, and real-time validation to help you perfect your pseudocode skills."
  }
];

// Open Graph images by context
export const OG_IMAGES = {
  landing: "https://pseudorun.com/og-image.png",
  editor: "https://pseudorun.com/editor-og-image.png",
  tutorial: "https://pseudorun.com/tutorial-og-image.png",
  practice: "https://pseudorun.com/practice-og-image.png",
  syntax: "https://pseudorun.com/syntax-og-image.png",
  exam: "https://pseudorun.com/exam-og-image.png"
};

// Canonical URLs
export const CANONICAL_URLS = {
  landing: "https://pseudorun.com",
  editor: "https://pseudorun.com/?action=editor",
  tutorial: "https://pseudorun.com/?action=tutorial",
  practice: "https://pseudorun.com/?action=practice",
  syntax: "https://pseudorun.com/?action=syntax-reference",
  exam: "https://pseudorun.com/?action=exam-mode"
};

// Analytics event tracking configuration
export const ANALYTICS_EVENTS = {
  page_view: "page_view",
  code_executed: "code_executed",
  example_loaded: "example_loaded",
  tutorial_started: "tutorial_started",
  practice_attempted: "practice_attempted",
  exam_mode_started: "exam_mode_started",
  social_share: "social_share",
  user_registered: "user_registered"
};

// Export helper function to get SEO content by feature
export const getSEOContent = (feature: keyof typeof META_DESCRIPTIONS) => ({
  title: PAGE_TITLES[feature],
  description: META_DESCRIPTIONS[feature],
  keywords: SEO_KEYWORDS[feature] || SEO_KEYWORDS.primary,
  ogImage: OG_IMAGES[feature],
  canonicalUrl: CANONICAL_URLS[feature]
});

export default {
  META_DESCRIPTIONS,
  PAGE_TITLES,
  SEO_KEYWORDS,
  STRUCTURED_DATA,
  SOCIAL_SHARE_CONTENT,
  VALUE_PROPOSITIONS,
  FAQ_CONTENT,
  OG_IMAGES,
  CANONICAL_URLS,
  ANALYTICS_EVENTS,
  getSEOContent
};