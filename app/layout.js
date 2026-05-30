import { Oswald, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--fD",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--fB",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--fM",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://qahub.wiki";
const SITE_NAME = "Software Testing Basics";
const SITE_TITLE = "Software Testing Basics: Complete Beginner's Guide (2026)";
const SITE_DESC = "Learn software testing basics from scratch. Covers types of testing, test cases, QA fundamentals & tools. The only guide beginners need in 2026.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESC,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    creator: "@swtestingbasics",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "education",
};

/* JSON-LD Structured Data */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.svg`,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const educationalJsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Software Testing Basics — Complete Beginner's Guide",
  description: "A comprehensive 30-article series covering all essential aspects of software testing, from basic QA principles to advanced automation strategies.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  educationalLevel: "Beginner to Advanced",
  about: [
    { "@type": "Thing", name: "Software Testing Fundamentals" },
    { "@type": "Thing", name: "Test-Driven Development" },
    { "@type": "Thing", name: "Behavior-Driven Development" },
    { "@type": "Thing", name: "Automation Testing" },
    { "@type": "Thing", name: "Performance Testing" },
    { "@type": "Thing", name: "Security Testing" },
    { "@type": "Thing", name: "CI/CD Testing Pipelines" },
  ],
  inLanguage: "en",
  isAccessibleForFree: true,
  url: SITE_URL,
};

export const viewport = {
  themeColor: "#060712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
