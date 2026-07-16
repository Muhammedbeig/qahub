export const a2 = {
  id: "types-of-software-testing",
  cat: "Testing Types",
  catColor: "#A78BFA",
  catBg: "rgba(167,139,250,.08)",
  iconName: "Layers",
  iconColor: "#A78BFA",
  num: "03",
  title: "Types of Software Testing Explained: A Complete Guide to Functional and Non-Functional QA (2026)",
  subtitle: "From unit tests to user acceptance: a comprehensive map of the testing landscape, what each type catches, and when to apply them.",
  description: "From unit tests to user acceptance: a comprehensive map of the testing landscape, what each type catches, and when to apply them.",
  readTime: "16 min",
  tags: ["Types", "Functional", "Non-Functional", "Regression Testing"],
  toc: [
    "What Is Functional Testing in Software Development?",
    "Why Is Non-Functional Testing Essential for Performance?",
    "What is the Difference Between Smoke and Sanity Testing?",
    "Key Takeaways and Next Action",
    "Frequently Asked Questions"
  ],
  sections: [
    {
      type: "lead",
      text: "Software testing is structured into functional and non-functional categories that evaluate distinct aspects of a system. Functional testing verifies that features execute according to specified business requirements, whereas non-functional testing measures system attributes like speed, security, and accessibility. This guide maps the testing landscape to help teams build comprehensive quality coverage."
    },
    {
      type: "h2",
      text: "What Is Functional Testing in Software Development?"
    },
    {
      type: "p",
      text: "Functional testing evaluates system compliance against specifications to confirm that software operations execute correctly under valid and invalid inputs. It focuses entirely on what the system does without evaluating the underlying code implementation, verifying components from isolated functions to complete business workflows."
    },
    {
      type: "p",
      text: "Functional testing operates on the black-box model. Testers do not need to understand how the system compiles or what algorithms exist in the source code. Instead, they provide input data to the system and evaluate the outputs against requirements. This verification spans several levels, each targeting a different type of defect. By verifying software at every level, teams prevent small logic errors from combining into complex integration failures."
    },
    {
      type: "h3",
      text: "Understanding the Levels of Functional Testing"
    },
    {
      type: "p",
      text: "Functional testing is executed sequentially across the software development lifecycle. The process begins at the component level with unit testing, moves to integration testing to verify interfaces, scales to system testing for complete workflows, and culminates in acceptance testing (UAT). Each level serves a distinct purpose, filtering out defects so they do not escape downstream."
    },
    {
      type: "table",
      headers: ["Testing Level", "Primary Objective", "Focus Scope", "Typical Verification Tools"],
      rows: [
        ["Unit Testing", "Verify logic correctness of isolated code pieces", "Functions, classes, single modules in isolation", "Jest, Vitest, JUnit, PyTest"],
        ["Integration Testing", "Verify correct communication between modules", "API endpoints, database connections, message queues", "Postman, Supertest, REST Assured"],
        ["System Testing", "Evaluate the complete, fully integrated application", "End-to-End user workflows, system configurations", "Selenium, Cypress, Playwright"],
        ["Acceptance (UAT)", "Confirm software satisfies customer business needs", "Real-world business transactions, customer workflows", "Beta testing, User surveys"]
      ]
    },
    {
      type: "p",
      text: "At the unit level, developers write scripts to check individual functions in isolation, using mocks to replace database or network connections. Once these units pass, integration testing verifies that separate modules communicate accurately. For example, testing if a login service successfully saves active sessions to a database. System testing takes the completed software and evaluates it as a single black box, running complete user journeys. Finally, User Acceptance Testing (UAT) allows target users to verify that the application satisfies their actual business requirements."
    },
    {
      type: "ul",
      items: [
        "Component Level validation: Unit tests run in milliseconds to verify code logic during active coding.",
        "System Level integration: Checking if microservices exchange data formats correctly over API channels.",
        "Operational validation: User acceptance testing validating workflows under realistic business scenarios."
      ]
    },
    {
      type: "h2",
      text: "Why Is Non-Functional Testing Essential for Performance?"
    },
    {
      type: "p",
      text: "Non-functional testing measures how well a system performs under specific operational conditions rather than checking if individual features work. It verifies essential quality attributes including page speed, security vulnerability levels, user experience usability, and cross-device compatibility, protecting applications from performance degradation."
    },
    {
      type: "p",
      text: "An application can calculate values with 100 percent accuracy, yet still fail in production if page loading times take longer than three seconds. Non-functional testing addresses these performance dimensions. It covers speed, security, accessibility, and reliability. If a system crashes under a sudden influx of concurrent users, or if it exposes customer credit card data to unauthorized users, the system has failed. Quality engineering teams must run non-functional checks alongside functional validations to ensure operational stability under stress."
    },
    {
      type: "h3",
      text: "Core Dimensions of Non-Functional Validation"
    },
    {
      type: "p",
      text: "To structure non-functional verification, teams categorize checks by their target quality attribute. Performance testing verifies response times, throughput, and resource utilization. Security testing assesses susceptibility to attacks. Usability checks measure navigation friction. Compatibility testing ensures correct rendering across browser versions and screen sizes."
    },
    {
      type: "ul",
      items: [
        "Performance Testing: Evaluates response speed, scalability, and memory stability under load (using k6 or JMeter).",
        "Security Testing: Scans application endpoints to identify vulnerabilities like SQL injection, cross-site scripting, and security misconfigurations.",
        "Usability Testing: Measures the effort required for users to navigate the interface and complete tasks without confusion.",
        "Compatibility Testing: Confirms correct rendering and functionality across different browsers, mobile devices, and operating systems."
      ]
    },
    {
      type: "callout",
      variant: "info",
      title: "Accessibility Compliance (a11y)",
      text: "Accessibility testing evaluates if your application can be navigated by users with visual, auditory, or motor impairments. Compliance with WCAG 2.1 specifications is legally mandated for public systems. Automating checks with tools like axe-core prevents common accessibility violations."
    },
    {
      type: "code",
      language: "javascript",
      code: `// Simple automated accessibility assertion using axe-core in Playwright
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage should have no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});`
    },
    {
      type: "h2",
      text: "What is the Difference Between Smoke and Sanity Testing?"
    },
    {
      type: "p",
      text: "Smoke testing and sanity testing verify build health at different stages of the development cycle. Smoke testing is a broad, shallow suite verifying that critical core paths work after a new build is deployed. Sanity testing is a narrow, deep verification focused on confirming a specific defect fix works as expected."
    },
    {
      type: "p",
      text: "These two testing types are often confused, but they occur at different points in the build pipeline. Smoke testing checks the entire system at a high level. It answers if the build is stable enough to start detailed testing. If the login page crashes during a smoke test, the build is immediately rejected. Sanity testing is executed later, after developers release a code patch for a specific bug. It focuses on the modified module and related components, checking if the bug was actually fixed without running the entire regression suite."
    },
    {
      type: "h3",
      text: "Comparing Pipeline Testing Strategies"
    },
    {
      type: "p",
      text: "Selecting the correct gate type is critical to prevent testing bottlenecks. Smoke tests are run automatically in CI pipelines on every code push, acting as a quick validation gate. Sanity tests are typically executed by QA engineers manually or as focused developer regression checks before final merge approvals are granted."
    },
    {
      type: "table",
      headers: ["Dimension", "Smoke Testing Process", "Sanity Testing Process"],
      rows: [
        ["Testing Scope", "Broad and shallow (covers main application paths)", "Narrow and deep (covers specific modified component)"],
        ["Objective", "Verify overall build stability for further testing", "Verify specific code fix behaves correctly"],
        ["Execution Trigger", "Executed on new major build deployment", "Executed after developer deploys bug fix"],
        ["Automation Fit", "Highly suitable for automated CI/CD runs", "Commonly manual or fast developer unit check"],
        ["Example Test Path", "Checking if login, cart, and logout load successfully", "Checking if custom discounts calculate correctly on checkout"]
      ]
    },
    {
      type: "callout",
      variant: "warning",
      title: "Optimizing Your Testing Pipeline",
      text: "Fail fast by executing automated smoke tests before running comprehensive end-to-end regression suites. If a smoke test fails, immediately reject the build to save pipeline resources."
    },
    {
      type: "h2",
      text: "Key Takeaways and Next Action"
    },
    {
      type: "ul",
      items: [
        "**Balanced Coverage**: Combine functional and non-functional testing to protect both correctness and performance.",
        "**Integration Verification**: Never assume passing unit tests guarantee a working integrated application.",
        "**Critical Gates**: Implement smoke tests to quickly reject unstable builds before wasting testing resources."
      ]
    },
    {
      type: "p",
      text: "Your next step: Audit your testing process and determine if you have automated smoke test runs gating your CI/CD deployments."
    },
    {
      type: "p",
      text: "Coming up next: Manual vs. Automated Testing: How to Build a High-ROI Hybrid QA Strategy."
    },
    {
      type: "h2",
      text: "Frequently Asked Questions"
    },
    {
      type: "h3",
      text: "What is the main difference between functional and non-functional testing?"
    },
    {
      type: "p",
      text: "Functional testing verifies what the software does by checking operations against requirements. Non-functional testing evaluates how well the system performs under conditions like heavy load or security threats. In brief, functional focuses on correctness, whereas non-functional focuses on operational quality."
    },
    {
      type: "h3",
      text: "Why do teams run integration tests if unit tests pass?"
    },
    {
      type: "p",
      text: "Teams run integration tests because passing unit tests only prove that components work in isolation. They cannot catch issues occurring at module boundaries, such as mismatched database schemas, broken API parameters, or incorrect communication protocol setups. Integration tests catch errors at these seams."
    },
    {
      type: "h3",
      text: "What is the purpose of user acceptance testing (UAT)?"
    },
    {
      type: "p",
      text: "The purpose of User Acceptance Testing is to confirm that the completed software is fit for purpose and satisfies the real-world operational needs of the customer. It is typically conducted by end users or business representatives before launching the system to production."
    },
    {
      type: "h3",
      text: "What are the main types of performance testing?"
    },
    {
      type: "p",
      text: "The main types of performance testing include load testing to check behavior under expected traffic, stress testing to find the breaking point, spike testing for sudden surges, and soak testing to detect memory leaks over time. Each type evaluates specific system limits."
    }
  ]
};
