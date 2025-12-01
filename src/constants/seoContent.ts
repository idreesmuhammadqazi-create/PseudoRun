/**
 * SEO Content Constants for PseudoRun
 * Centralized SEO-friendly content management
 */

// Meta descriptions for different app contexts
export const META_DESCRIPTIONS = {
  landing: "Practice pseudocode with PseudoRun - the #1 free, ad-free online pseudocode runner and executor. Perfect for IGCSE Computer Science students and anyone wanting to run pseudocode online with real-time validation and no distractions.",
  editor: "Write, run, and execute pseudocode instantly with PseudoRun - the free online pseudocode runner. Features syntax highlighting, debugging, and execution for IGCSE exam success.",
  tutorial: "Master pseudocode with our comprehensive tutorial. Perfect for IGCSE Computer Science and general programming. Learn algorithms, loops, arrays, and how to execute pseudocode step-by-step.",
  practice: "Test your skills with pseudocode practice problems. From basic concepts to advanced algorithms, prepare for IGCSE exams and improve your programming logic with our free pseudocode runner.",
  syntax: "Complete pseudocode syntax reference for IGCSE and general programming. Learn proper syntax, commands, and structures for writing and executing pseudocode.",
  exam: "Practice pseudocode under exam conditions with timed challenges. Build speed and confidence for IGCSE Computer Science exams using our ad-free pseudocode runner."
};

// Page titles with SEO optimization
export const PAGE_TITLES = {
  landing: "PseudoRun - #1 Free Pseudocode Runner & Executor | IGCSE Editor",
  editor: "PseudoRun - Run Pseudocode Online | Free Pseudocode Executor",
  tutorial: "Learn Pseudocode - Free Tutorial & Runner | PseudoRun",
  practice: "Pseudocode Practice Problems | Free Online Runner | PseudoRun",
  syntax: "Pseudocode Syntax Reference | Online Runner | PseudoRun",
  exam: "Exam Mode - Timed Pseudocode Practice | Free Runner | PseudoRun"
};

// SEO keywords by feature
export const SEO_KEYWORDS = {
  primary: "IGCSE pseudocode editor, pseudocode simulator, pseudocode runner, online pseudocode runner, free pseudocode runner, pseudocode executor, execute pseudocode online, run pseudocode, pseudocode interpreter, pseudocode compiler, IGCSE computer science, pseudocode practice, computer science pseudocode tool, ad free pseudocode, no ads pseudocode, distraction free coding, free pseudocode tool",
  landing: "IGCSE pseudocode editor, PseudoRun, pseudocode runner, online pseudocode runner, free pseudocode runner, pseudocode executor, run pseudocode online, pseudocode interpreter, Cambridge IGCSE, computer science exam, pseudocode practice online, free pseudocode tool, ad-free pseudocode editor, ad free learning, no ads pseudocode, student-focused pseudocode practice, distraction-free coding platform, IGCSE learning tool no ads, ad free programming tool",
  editor: "online pseudocode editor, pseudocode runner, pseudocode executor, IGCSE pseudocode writer, pseudocode debugger, pseudocode interpreter, syntax highlighting, real-time validation, run pseudocode code, execute pseudocode online, ad free coding environment",
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
    description: "The #1 online pseudocode runner and executor for IGCSE Computer Science students - completely ad-free",
    url: "https://www.pseudorun.tech/",
    educationalLevel: "High School",
    about: "IGCSE Computer Science Pseudocode",
    applicationCategory: "EducationalApplication"
  },
  softwareApp: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PseudoRun",
    applicationCategory: "EducationalApplication",
    description: "Free online pseudocode runner, executor, and editor for IGCSE computer science students and general programming practice",
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
    text: "Run pseudocode online with PseudoRun - the #1 free pseudocode runner and executor. Perfect for IGCSE Computer Science students and general programming practice!",
    hashtags: ["IGCSE", "ComputerScience", "Pseudocode", "PseudoRun", "ExamPrep", "PseudocodeRunner", "AdFree", "Coding"]
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
  primary: "The #1 free pseudocode runner and executor - perfect for IGCSE Computer Science and general programming practice",
  features: [
    "100% Cambridge IGCSE aligned",
    "Real-time syntax validation",
    "Step-by-step debugging",
    "50+ practice problems",
    "Timed exam mode",
    "Free cloud storage"
  ],
  benefits: [
    "Run and execute pseudocode instantly",
    "Master pseudocode concepts",
    "Prepare for IGCSE exams",
    "Build programming confidence",
    "Learn at your own pace",
    "Practice anywhere, anytime",
    "Enjoy 100% ad-free learning environment"
  ],
  targetAudience: "IGCSE Computer Science students and general programming learners"
};

// FAQ content for structured data
export const FAQ_CONTENT = [
  {
    question: "What is PseudoRun?",
    answer: "PseudoRun is the #1 free online pseudocode runner and executor, designed specifically for Cambridge IGCSE Computer Science students. It helps you write, run, execute, and master pseudocode for exam success in a completely ad-free environment."
  },
  {
    question: "Can I run pseudocode online with PseudoRun?",
    answer: "Yes! PseudoRun is a comprehensive pseudocode runner and executor that allows you to write, run, and test pseudocode instantly online. Execute your algorithms step-by-step with real-time validation."
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
  },
  {
    question: "Will PseudoRun ever have ads?",
    answer: "No. We are committed to providing a completely ad-free and distraction-free learning environment. Our mission is to support students, not to profit from advertisements."
  }
];

// Open Graph images by context
export const OG_IMAGES = {
  landing: "https://www.pseudorun.tech/og-image.png",
  editor: "https://www.pseudorun.tech/editor-og-image.png",
  tutorial: "https://www.pseudorun.tech/tutorial-og-image.png",
  practice: "https://www.pseudorun.tech/practice-og-image.png",
  syntax: "https://www.pseudorun.tech/syntax-og-image.png",
  exam: "https://www.pseudorun.tech/exam-og-image.png"
};

// Canonical URLs
export const CANONICAL_URLS = {
  landing: "https://www.pseudorun.tech/",
  editor: "https://www.pseudorun.tech/?action=editor",
  tutorial: "https://www.pseudorun.tech/?action=tutorial",
  practice: "https://www.pseudorun.tech/?action=practice",
  syntax: "https://www.pseudorun.tech/?action=syntax-reference",
  exam: "https://www.pseudorun.tech/?action=exam-mode"
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