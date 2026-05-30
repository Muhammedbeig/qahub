import {
  BookOpen, Code, Zap, Shield, Settings, Bug, FileText,
  Activity, Award, Layers
} from "lucide-react";

import { a1 } from "./articles/what-is-software-testing.js";
import { a2 } from "./articles/types-of-software-testing.js";
import { a3 } from "./articles/manual-vs-automated-testing.js";
import { a4 } from "./articles/test-driven-development.js";
import { a5 } from "./articles/black-box-vs-white-box.js";
import { a6 } from "./articles/testing-tools-frameworks.js";
import { a7 } from "./articles/bug-lifecycle.js";
import { a8 } from "./articles/writing-effective-test-cases.js";
import { a9 } from "./articles/performance-testing.js";
import { a10 } from "./articles/testing-best-practices.js";
import { a11 } from "./articles/verification-vs-validation.js";
import { a12 } from "./articles/psychology-of-software-testing.js";
import { a13 } from "./articles/api-and-integration-testing.js";
import { a14 } from "./articles/security-testing-essentials.js";
import { a15 } from "./articles/database-testing-guide.js";
import { a16 } from "./articles/usability-accessibility-testing.js";
import { a17 } from "./articles/mobile-application-testing.js";
import { a18 } from "./articles/shift-left-testing.js";
import { a19 } from "./articles/continuous-testing-cicd.js";
import { a20 } from "./articles/test-data-management.js";
import { a21 } from "./articles/behavior-driven-development.js";
import { a22 } from "./articles/exploratory-testing.js";
import { a23 } from "./articles/agile-testing-methodology.js";
import { a24 } from "./articles/equivalence-partitioning-bva.js";
import { a25 } from "./articles/decision-tables-state-transition.js";
import { a26 } from "./articles/mutation-testing.js";
import { a27 } from "./articles/cypress-vs-playwright.js";
import { a28 } from "./articles/static-code-analysis.js";
import { a29 } from "./articles/defect-metrics-analysis.js";
import { a30 } from "./articles/three-amigos-story-refinement.js";

export const CATS = [
  "All", "Fundamentals", "Testing Types", "Strategy", "Methodology",
  "Techniques", "Tools", "Lifecycle", "Process", "Performance", "Best Practices"
];

export const ARTICLES = [
  a1, a2, a3, a4, a5, a6, a7, a8, a9, a10,
  a11, a12, a13, a14, a15, a16, a17, a18, a19, a20,
  a21, a22, a23, a24, a25, a26, a27, a28, a29, a30
];

const ICON_MAP = { BookOpen, Code, Zap, Shield, Settings, Bug, FileText, Activity, Award, Layers };

export function getIconComponent(name) {
  return ICON_MAP[name] || BookOpen;
}
