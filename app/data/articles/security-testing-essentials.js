export const a14 = {
  id: "security-testing-essentials",
  cat: "Testing Types",
  catColor: "#A78BFA",
  catBg: "rgba(167,139,250,.08)",
  iconName: "Layers",
  iconColor: "#A78BFA",
  num: "14",
  title: "Security Testing Essentials: OWASP Top 10 and Penetration Testing (2026)",
  subtitle: "An introduction to software security: testing for injection vulnerabilities, configuring secure authentication, and running static code scanners.",
  description: "An introduction to software security: testing for injection vulnerabilities, configuring secure authentication, and running static code scanners.",
  readTime: "11 min",
  tags: ["Testing Types", "Security", "OWASP", "Vulnerabilities"],
  toc: [
    "What is Security Testing and Why is it Critical?",
    "What is the OWASP Top 10 and How Do You Test for It?",
    "How Do Dynamic and Static Security Scans Differ?",
    "Key Takeaways and Next Action",
    "Frequently Asked Questions"
  ],
  sections: [
    {
      type: "lead",
      text: "Security testing is the engineering discipline used to identify vulnerabilities, verify authentication protocols, and protect applications from external threats. Shipping code without security validation risks exposing sensitive customer data and violating regulatory compliance standards. This guide reviews security threats, automated validation methods, and penetration testing fundamentals."
    },
    {
      type: "h2",
      text: "What is Security Testing and Why is it Critical?"
    },
    {
      type: "p",
      text: "Security testing evaluates a software system's resilience against malicious attacks and checks if the application protects sensitive data records. It focuses on identifying architectural weaknesses, incorrect permissions configurations, and code vulnerabilities to prevent unauthorized access and data leakage."
    },
    {
      type: "p",
      text: "In an era of rising cyber threats, security cannot be treated as a secondary project phase. A single vulnerability can expose database records containing customer passwords or credit card data, resulting in massive financial penalties and brand damage. Security testing goes beyond standard functional validation. While standard QA checks if features work under normal circumstances, security testing actively attacks the application. It simulates unauthorized actions to verify that user roles, encryption routines, and session states are fully protected against malicious exploits."
    },
    {
      type: "ul",
      items: [
        "Confidentiality: Ensuring that sensitive data resources are accessed only by authorized user roles.",
        "Integrity: Verifying that transactions and database records are modified only via approved services.",
        "Availability: Ensuring that host servers are protected against denial of service (DoS) attacks."
      ]
    },
    {
      type: "callout",
      variant: "danger",
      title: "Data Exposure Consequences",
      text: "Failing to secure user data results in severe regulatory penalties under frameworks like GDPR or HIPAA. Automating vulnerability scans early protects against expensive lawsuits and data recovery costs."
    },
    {
      type: "h2",
      text: "What is the OWASP Top 10 and How Do You Test for It?"
    },
    {
      type: "p",
      text: "The OWASP Top 10 is a standardized document outlining the most critical security vulnerabilities found in web applications today. The list includes common threats like SQL injection, broken user authentication, XML external entities, cross-site scripting (XSS), and insecure configurations."
    },
    {
      type: "p",
      text: "Injection attacks occur when untrusted user input is sent directly to an interpreter as part of a command. In SQL injection, an attacker inputs SQL parameters into a login form to bypass authentication checks. QA teams test for this by submitting strings containing SQL commands (like 'OR 1=1') and verifying the input is rejected. Developers prevent this by parameterizing queries. This ensures that user inputs are treated as literal data parameters, not executable SQL syntax."
    },
    {
      type: "code",
      language: "javascript",
      code: `// INSECURE: Vulnerable to SQL Injection (Direct string concatenation)
const query = "SELECT * FROM users WHERE user = '" + inputUser + "' AND pass = '" + inputPass + "'";

// SECURE: Parameterized Query (User input treated as data)
const query = "SELECT * FROM users WHERE user = ? AND pass = ?";
db.query(query, [inputUser, inputPass]);`
    },
    {
      type: "h2",
      text: "How Do Dynamic and Static Security Scans Differ?"
    },
    {
      type: "p",
      text: "Static and dynamic security scans find application vulnerabilities at different stages of development. Static Application Security Testing (SAST) evaluates source code files without executing them, whereas Dynamic Application Security Testing (DAST) runs security scans against active staging environments."
    },
    {
      type: "p",
      text: "Integrating both scanner types into your CI/CD pipeline provides comprehensive security coverage. SAST tools analyze source code files during compile steps. They check for hardcoded secrets, insecure API imports, and buffer overflow weaknesses. However, SAST cannot identify deployment configuration issues. DAST tools solve this by attacking the running application. They send malformed payloads and scan response headers to check for insecure cookie configurations and open ports."
    },
    {
      type: "table",
      headers: ["Scanner Criteria", "Static Analysis (SAST)", "Dynamic Scanning (DAST)"],
      rows: [
        ["Testing State", "Static check (inspects code files without compiling)", "Dynamic check (scans the running application)"],
        ["Target Audited", "Source code files, packages, local configurations", "Running endpoints, ports, active headers"],
        ["Syllabus Timing", "Early coding phase, integrated into git hooks", "Testing and staging phase before release"],
        ["Vulnerabilities Found", "Hardcoded API keys, insecure functions, package flaws", "Cross-site scripting (XSS), cookie settings, open ports"],
        ["Typical Tools", "SonarQube, Snyk, ESLint-plugin-security", "OWASP ZAP, Burp Suite, Acunetix"]
      ]
    },
    {
      type: "callout",
      variant: "warning",
      title: "Hardcoded Secrets Warning",
      text: "Never commit API keys or database credentials into your source code. Git repositories are easily compromised. Use environment variables and secrets managers to store sensitive configurations."
    },
    {
      type: "h2",
      text: "Key Takeaways and Next Action"
    },
    {
      type: "ul",
      items: [
        "**Secure Inputs**: Parameterize all database queries and sanitize user fields to prevent injection vulnerabilities.",
        "**Pipeline Scans**: Integrate automated SAST scanning into your git checkout processes to block insecure code merges.",
        "**Config Protection**: Review HTTP headers and cookie flags on staging servers to ensure transport layer security."
      ]
    },
    {
      type: "p",
      text: "Your next step: Execute an automated vulnerability scan against your local application codebase using a tool like Snyk or npm audit."
    },
    {
      type: "p",
      text: "Coming up next: Database Testing Guide: SQL Queries, Data Integrity, and Schema Validation."
    },
    {
      type: "h2",
      text: "Frequently Asked Questions"
    },
    {
      type: "h3",
      text: "What is the OWASP Top 10 in application security?"
    },
    {
      type: "p",
      text: "The OWASP Top 10 is an industry document that lists the most common and critical security risks in web applications. It serves as a checklist for developers and QA engineers to ensure that authentication, inputs, configurations, and data storage systems are secure."
    },
    {
      type: "h3",
      text: "How does SQL injection occur?"
    },
    {
      type: "p",
      text: "SQL injection occurs when an application concatenates untrusted user inputs directly into SQL command strings. This allows attackers to input database characters (like single quotes) to execute arbitrary database queries, exposing or deleting user records."
    },
    {
      type: "h3",
      text: "What is the difference between SAST and DAST?"
    },
    {
      type: "p",
      text: "SAST is a static code review that scans source files for vulnerabilities during coding. DAST is a dynamic security scan that attacks the running application during staging to find runtime vulnerabilities like broken cookies or header configuration flaws."
    },
    {
      type: "h3",
      text: "What is penetration testing in software QA?"
    },
    {
      type: "p",
      text: "Penetration testing is a simulated attack executed by security experts to identify weaknesses in an application's infrastructure and logic. Unlike automated scans, penetration testing relies on human creativity to discover complex logic vulnerabilities."
    }
  ]
};
