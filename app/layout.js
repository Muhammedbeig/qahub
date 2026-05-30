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

export const metadata = {
  title: "QAHub — Software Testing Basics | Comprehensive QA Learning Resource",
  description:
    "Master software testing fundamentals with 10 comprehensive guides covering QA principles, testing types, TDD, automation strategies, tools, performance testing, and best practices.",
  keywords: [
    "software testing",
    "QA",
    "quality assurance",
    "test-driven development",
    "TDD",
    "unit testing",
    "integration testing",
    "performance testing",
    "automation",
    "Selenium",
    "Jest",
    "Cypress",
  ],
  authors: [{ name: "QAHub" }],
  openGraph: {
    type: "website",
    title: "QAHub — Software Testing Basics",
    description:
      "10 comprehensive guides covering every essential aspect of software testing — from first principles to professional best practices.",
    siteName: "QAHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "QAHub — Software Testing Basics",
    description:
      "10 comprehensive guides covering every essential aspect of software testing — from first principles to professional best practices.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
