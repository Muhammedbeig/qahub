export const a7 = {
  id: "bug-lifecycle",
  cat: "Lifecycle",
  catColor: "#F97316",
  catBg: "rgba(249,115,22,.08)",
  iconName: "Bug",
  iconColor: "#F97316",
  num: "08",
  title: "The Bug Lifecycle Explained: From Discovery to Closure with Severity vs. Priority (2026)",
  subtitle: "From first discovery to final closure: the stages every defect moves through, severity vs. priority, what makes a great bug report, and how teams track it all.",
  description: "From first discovery to final closure: the stages every defect moves through, severity vs. priority, what makes a great bug report, and how teams track it all.",
  readTime: "11 min",
  tags: ["Defects", "Lifecycle", "Tracking"],
  toc: [
    "What Are the Primary Stages of the Bug Lifecycle?",
    "How Do Severity and Priority Differ in Bug Triage?",
    "What Components Make a Perfect Bug Report?",
    "Key Takeaways and Next Action",
    "Frequently Asked Questions"
  ],
  sections: [
    {
      type: "lead",
      text: "A defect lifecycle defines the precise sequence of states a software bug moves through from its initial reporting to its final verification and closure. Establishing a standardized defect workflow ensures transparent communication between QA engineers and development teams. This lesson details the bug lifecycle states and prioritization rules."
    },
    {
      type: "h2",
      text: "What Are the Primary Stages of the Bug Lifecycle?"
    },
    {
      type: "p",
      text: "The bug lifecycle is a structured sequence of workflow phases designed to manage software defects. Its primary stages include New (discovery), Assigned (ownership), Open (active code investigation), Fixed (resolution complete), Retest (QA verification), and Verified or Closed (fix confirmed), alongside Reopened if issues persist."
    },
    {
      type: "p",
      text: "Standardizing the transitions in a defect's lifecycle prevents confusion and ensures accountability. When a QA engineer discovers a bug, they create a ticket in the tracking system, setting the status to New. The development lead reviews this ticket. If it is verified as a valid defect, the status changes to Assigned and a developer is given ownership. Once the developer starts actively writing code to resolve the defect, the status transitions to Open or In Progress. When the code fix is merged and deployed to the testing server, the developer marks the issue as Fixed. The reporting QA engineer then performs a Retest. If the fix passes, the status changes to Verified and then Closed. If the issue is still reproducible, the ticket is immediately Reopened, restarting the loop."
    },
    {
      type: "ol",
      items: [
        "New: Discovered by the tester and documented in the project backlog.",
        "Assigned: Approved by the lead developer and allocated to a specific programmer.",
        "Open: Checked by the developer to diagnose root causes and write the resolution code.",
        "Fixed: Resolved by the developer, with code merged and deployed to the test server.",
        "Retest: Re-evaluated by the QA engineer using the exact original steps.",
        "Verified / Closed: Closed permanently after confirming the defect is resolved.",
        "Reopened: Returned to Assigned state if retesting demonstrates the bug still exists."
      ]
    },
    {
      type: "callout",
      variant: "info",
      title: "Maintaining QA Context",
      text: "Whenever possible, assign the retest phase to the same QA engineer who discovered and reported the bug. They possess the exact steps, test data, and user context required to verify the fix."
    },
    {
      type: "h2",
      text: "How Do Severity and Priority Differ in Bug Triage?"
    },
    {
      type: "p",
      text: "Severity and priority measure different dimensions of a software defect during triage sessions. Severity describes the technical impact of a bug on system operations, determined by QA. Priority represents the business urgency of deploying the fix, determined by product owners and stakeholders."
    },
    {
      type: "p",
      text: "Conflating severity and priority is a common mistake that disrupts project timelines. Severity is an objective measure of functional damage. For instance, if an application crashes whenever a user clicks a button, the severity is High. Priority is a subjective business decision. If the crash occurs only on a legacy settings screen that is scheduled for deletion next week, the priority to fix it is Low. Conversely, a typo in the main corporate logo on the landing page has a Low technical severity (no code breaks), but possesses a High business priority because it affects brand image. Triage meetings resolve these differences by aligning development capacity with immediate release targets."
    },
    {
      type: "table",
      headers: ["Classification", "High Priority (Fix Immediately)", "Low Priority (Defer or Backlog)"],
      rows: [
        ["High Severity (Critical)", "System crash blocking the main signup flow", "Database crash occurring only during a rare quarterly data export"],
        ["Low Severity (Minor)", "Misspelling of the company name on the homepage", "Cosmetic alignment issue on a settings page viewed only by admins"]
      ]
    },
    {
      type: "callout",
      variant: "warning",
      title: "Preventing Triage Bloat",
      text: "Avoid marking every bug as High Priority. Conflating technical severity with business urgency dilutes development focus, causing critical delivery deadlines to slide."
    },
    {
      type: "h2",
      text: "What Components Make a Perfect Bug Report?"
    },
    {
      type: "p",
      text: "A perfect bug report is a detailed document that provides developers with all necessary data to reproduce and resolve a defect without delay. It must contain a descriptive title, environment details, exact step by step reproduction guides, expected and actual results, and visual evidence files."
    },
    {
      type: "p",
      text: "A poorly written bug report leads to back-and-forth communication that delays resolutions. If a developer cannot reproduce the bug on their local setup, they cannot fix it. A high-quality report provides environment contexts, including operating systems, browser versions, and screen scales. It outlines the exact preconditions, such as requiring a logged-in user with specific database permissions. It lists clear, numbered actions, avoiding vague descriptions. Finally, attaching console log files, network traces (HAR files), and visual recordings helps developers diagnose the root cause immediately."
    },
    {
      type: "code",
      language: "markdown",
      code: `# [CHECKOUT] Silent Failure on Card Payments with Spaces

## Environment
- **Browser:** Chrome 124 (macOS)
- **Environment:** Staging URL (v2.4.1)

## Reproduction Steps
1. Navigate to the pricing page and add the Premium Plan to the cart.
2. Click checkout and enter valid customer details.
3. Enter credit card number containing spaces: "4111 1111 1111 1111".
4. Click the payment submission button.

## Expected Result
The system strips whitespace and displays a success confirmation.

## Actual Result
The payment fails silently with no error message. The cart remains full but user is not redirected.

## Attachments
- [payment-failure-network-log.har]
- [ui-silent-failure-screenshot.png]`
    },
    {
      type: "h2",
      text: "Key Takeaways and Next Action"
    },
    {
      type: "ul",
      items: [
        "**Clear States**: Define bug tracking transitions explicitly to avoid communication bottlenecks.",
        "**Conflation Warning**: Never conflate high technical severity with high release priority.",
        "**Triage Cadence**: Hold regular triage sessions to review incoming bugs and assign priority ratings."
      ]
    },
    {
      type: "p",
      text: "Your next step: Check your bug tracking tool (such as Jira or Linear) and configure automated templates for bug reporting."
    },
    {
      type: "p",
      text: "Coming up next: Writing Effective Test Cases: Anatomy, Templates, and Boundary Analysis Tricks."
    },
    {
      type: "h2",
      text: "Frequently Asked Questions"
    },
    {
      type: "h3",
      text: "What is the difference between bug severity and priority?"
    },
    {
      type: "p",
      text: "Severity is the technical impact of a bug on the application's functionality, rated by the testing team. Priority is the business urgency of fixing the bug, decided by product managers. A typo on a homepage has low severity but high priority, while a rare memory leak has high severity but low priority."
    },
    {
      type: "h3",
      text: "When should a bug be marked as reopened?"
    },
    {
      type: "p",
      text: "A bug should be reopened if the testing team executes the original reproduction steps on the resolved build and finds the defect still occurs. It can also be reopened if the fix introduces a secondary defect that blocks the same user path."
    },
    {
      type: "h3",
      text: "Who decides the priority of a defect?"
    },
    {
      type: "p",
      text: "The priority of a defect is decided by product managers, project managers, and business stakeholders during triage meetings. They evaluate release schedules, customer impact, financial risk, and developer capacity to determine when a fix must be deployed."
    },
    {
      type: "h3",
      text: "Why is standardizing the bug lifecycle important?"
    },
    {
      type: "p",
      text: "Standardizing the bug lifecycle is important because it prevents communication friction between QA and developers. It ensures that every team member understands what a bug status means, who is responsible for the next action, and how to track defect trends over time."
    }
  ]
};
