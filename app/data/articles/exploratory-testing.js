export const a22 = {
  id: "exploratory-testing",
  cat: "Methodology",
  catColor: "#34D399",
  catBg: "rgba(52,211,153,.08)",
  iconName: "Code",
  iconColor: "#34D399",
  num: "22",
  title: "Exploratory Testing: Session-Based Testing Charters and Finding Unscripted Bugs (2026)",
  subtitle: "Unscripted QA excellence: implementing session-based test management (SBTM), drafting test charters, and logging exploratory bugs.",
  readTime: "10 min",
  tags: ["Methodology", "Exploratory Testing", "SBTM", "Test Design"],
  toc: [
    "What Is Exploratory Testing and How Does It Differ from Scripted Runs?",
    "What is Session-Based Test Management (SBTM)?",
    "How Do You Design an Effective Test Charter?",
    "Frequently Asked Questions",
    "Key Takeaways and Next Action"
  ],
  sections: [
    {
      type: "lead",
      text: "Exploratory testing is a structured, creative testing approach where testers simultaneously design, execute, and learn from tests. Rather than executing passive checklists, exploratory testers use real-time discoveries to guide their next investigations. This guide details exploratory concepts, Session-Based Test Management (SBTM), and charter design."
    },
    {
      type: "h2",
      text: "What Is Exploratory Testing and How Does It Differ from Scripted Runs?"
    },
    {
      type: "p",
      text: "Exploratory testing is an active test design methodology where learning, test execution, and result analysis occur concurrently. It relies on the tester's cognitive skills and product knowledge to probe boundaries, identifying unscripted defects that static checklists miss."
    },
    {
      type: "p",
      text: "Scripted testing requires QA to follow predefined steps (like 'step 1: enter text, step 2: click button'). While this is suitable for automated regression suites, it limits human creativity. If a tester only checks what is listed in the document, they will miss defects occurring just outside that path. Exploratory testing is not ad-hoc testing: it is a disciplined process. The tester defines a target focus area, dynamically structures tests based on system feedback, and actively pursues anomalies. This is highly effective at discovering complex boundary conditions, usability issues, and security flaws."
    },
    {
      type: "ul",
      items: [
        "Cognitive Exploration: Testers use domain knowledge and experience to find software weaknesses.",
        "Dynamic Feedback Loop: Let discoveries in Test A immediately shape the parameters of Test B.",
        "Unscripted Discovery: Exposing boundary defects that structured test suites do not check."
      ]
    },
    {
      type: "callout",
      variant: "info",
      title: "Exploratory vs. Ad-Hoc Testing",
      text: "Exploratory testing is highly structured and tracked, using charters and time-boxing to establish goals. Ad-hoc testing is unstructured, random bug-hunting without accountability metrics."
    },
    {
      type: "h2",
      text: "What is Session-Based Test Management (SBTM)?"
    },
    {
      type: "p",
      text: "Session-Based Test Management is a management framework that provides structure and accountability to exploratory testing. It organizes exploratory runs into uninterrupted, time-boxed sessions focused on a specific test charter, documented with session reports."
    },
    {
      type: "p",
      text: "Teams sometimes reject exploratory testing because it seems difficult to track. SBTM solves this. It structures testing into time-boxed blocks (typically 60 to 90 minutes). During this time, the tester works without distractions (no meetings or emails) to execute a single charter. The tester records their steps, environment state, and bug files. At the end of the session, they compile a session report and participate in a short debrief with the development lead, sharing discoveries and product insights."
    },
    {
      type: "table",
      headers: ["SBTM Element", "Time Allocation / Role", "Primary Documentation", "Core Goal"],
      rows: [
        ["Charter Definition", "Before the session starts", "A single-sentence mission statement outlining focus", "Align testing focus on high-risk features"],
        ["Time-Boxed Session", "60 to 90 minutes of uninterrupted work", "Real-time notes containing steps and data logs", "Deep, distraction-free product exploration"],
        ["Session Report", "15 minutes after session completion", "Standardized Markdown log sheet summary", "Record testing coverage, bugs, and time metrics"],
        ["Triage Debrief", "10 minute review meeting", "Brief team sync with the lead developer", "Share results, discuss bugs, and prioritize fixes"]
      ]
    },
    {
      type: "callout",
      variant: "warning",
      title: "Time-Boxing Discipline",
      text: "During a time-boxed session, avoid pausing to write detailed bug tickets. Log brief notes of anomalies and write the formal tickets after the session completes to maintain testing momentum."
    },
    {
      type: "h2",
      text: "How Do You Design an Effective Test Charter?"
    },
    {
      type: "p",
      text: "Designing an effective test charter involves writing a single-sentence mission statement that defines the testing target, methods, and expected discoveries. A well-designed charter outlines: Explore [Feature], with [Tools/Inputs], to discover [Vulnerabilities/Behaviors]."
    },
    {
      type: "p",
      text: "A charter provides focus without restricting creativity. If a charter is too broad (like 'test pricing page'), the tester will lose direction. If it is too narrow (like 'test discount input with integer values'), it leaves no room for exploration. By using Elisabeth Hendrickson's charter template, QA engineers establish clear targets while preserving exploratory freedom."
    },
    {
      type: "callout",
      variant: "info",
      title: "Worked Example: Exploratory Test Run",
      text: "Tester Charlie is running a session using this charter: 'Explore checkout payment flows with invalid characters and network drops to identify data corruption bugs.' During the run, Charlie inputs emoji characters in the cardholder name field. The system accepts it. Next, Charlie starts a payment request and immediately disables the network connection. The application spins indefinitely with no timeout. Charlie records in his notes: '1. Emoji name accepted. 2. Network drop during payment creates infinite loading state.'"
    },
    {
      type: "p",
      text: "Notice how Charlie followed the charter's mission to target inputs and network drops. If he had followed a standard script, he would only have checked valid name formats and active network connections. By exploring, Charlie discovered two critical bugs: a validation gap in the name field and an infinite loading state that blocks user recovery. Charlie documented these issues, attached the console errors, and updated the team in the debrief session."
    },
    {
      type: "h2",
      text: "Frequently Asked Questions"
    },
    {
      type: "h3",
      text: "What is exploratory testing?"
    },
    {
      type: "p",
      text: "Exploratory testing is a testing approach where testers design, run, and learn from tests concurrently. It uses the tester's experience and analytical skills to actively probe the application, uncovering edge cases that pre-written checklists miss."
    },
    {
      type: "h3",
      text: "What is a test charter in SBTM?"
    },
    {
      type: "p",
      text: "A test charter is a single-sentence mission statement that defines the goal and boundaries of an exploratory session. It outlines what features to explore, what inputs or tools to use, and what specific behaviors or bugs to look for."
    },
    {
      type: "h3",
      text: "Why is time-boxing important in exploratory testing?"
    },
    {
      type: "p",
      text: "Time-boxing is important because it provides structure and keeps testing focused. By dedicating an uninterrupted 60 to 90 minute block to a specific charter, testers dive deep into feature behaviors without being distracted by emails or chat messages."
    },
    {
      type: "h3",
      text: "What happens during an SBTM debrief?"
    },
    {
      type: "p",
      text: "During an SBTM debrief, the tester reviews their session report with the lead developer or product manager. They discuss discovered bugs, share insights about system behavior, evaluate coverage areas, and decide if follow-up sessions are required."
    },
    {
      type: "h2",
      text: "Key Takeaways and Next Action"
    },
    {
      type: "ul",
      items: [
        "**Disciplined Design**: Exploratory testing is structured learning, not random ad-hoc bug hunting.",
        "**Targeted Charters**: Structure sessions using clear, action-oriented charters to maintain testing focus.",
        "**Accountable SBTM**: Document exploratory runs using session reports and hold brief team debriefs."
      ]
    },
    {
      type: "p",
      text: "Your next step: Draft a test charter using the Hendrickson template for your application's user profile settings screen."
    },
    {
      type: "p",
      text: "Coming up next: Agile Testing Methodology: Quality Engineering in Scrum and Kanban Frameworks."
    }
  ]
};
