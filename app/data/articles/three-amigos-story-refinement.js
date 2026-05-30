export const a30 = {
  id: "three-amigos-story-refinement",
  cat: "Process",
  catColor: "#F43F5E",
  catBg: "rgba(244,63,94,.08)",
  iconName: "FileText",
  iconColor: "#F43F5E",
  num: "30",
  title: "The Three Amigos and Story Refinement: Collaborative Quality Design (2026)",
  subtitle: "Shift quality to the requirements phase: learn how product owners, developers, and testers collaborate to refine user stories before coding.",
  description: "Shift quality to the requirements phase: learn how product owners, developers, and testers collaborate to refine user stories before coding.",
  readTime: "13 min",
  tags: ["Process", "Agile", "Story Refinement", "Collaboration", "QA Role"],
  toc: [
    "Why Do Agile User Stories Require Collaborative Design?",
    "What Is the Three Amigos Process and Who Participates?",
    "How Do the Three Amigos Refine User Stories?",
    "Three Amigos Meeting Structure: A Quick Reference",
    "Key Takeaways and Next Action",
    "Frequently Asked Questions"
  ],
  sections: [
    {
      type: "lead",
      text: "The Three Amigos is an Agile collaboration practice that refines user stories through three core perspectives: business, development, and testing. By aligning on requirements before coding begins, teams prevent specification errors and define clear acceptance criteria. This guide covers roles, Gherkin syntax creation, and sprint readiness criteria."
    },
    {
      type: "h2",
      text: "Why Do Agile User Stories Require Collaborative Design?"
    },
    {
      type: "p",
      text: "In many software projects, requirements are defined by product owners in isolation and handed off to developers. Developers then write the code based on their own interpretation of the text. Finally, testers receive the compiled software and write tests, discovering that the specifications were ambiguous or incomplete. This siloed workflow results in costly rework."
    },
    {
      type: "p",
      text: "Collaborative design solves this problem by shifting quality assurance left to the requirements definition phase. When business, development, and testing perspectives align before coding starts, the team resolves assumptions and identifies technical bottlenecks early. This prevents requirements defects (which are the most expensive bugs to resolve in later phases of the SDLC) from ever entering the codebase. Refinement shifts testing from a downstream check to an upstream design activity."
    },
    {
      type: "callout",
      variant: "info",
      title: "The Shift-Left Requirements Philosophy",
      text: "Shifting left means evaluating user stories for completeness, testability, and edge cases before a developer writes a single line of production code. It ensures that the team builds the right features correctly on the first attempt."
    },
    {
      type: "ul",
      items: [
        "Shared Understanding: Eliminates communication gaps by ensuring all team members interpret the user story identically.",
        "Early Edge Case Detection: Tester perspectives help identify error flows and validation conditions before they are coded.",
        "Clear Definition of Ready: Establishes a strict boundary, preventing half-defined requirements from entering active sprints."
      ]
    },
    {
      type: "h2",
      text: "What Is the Three Amigos Process and Who Participates?"
    },
    {
      type: "p",
      text: "The Three Amigos process is a collaborative meeting where team members review upcoming user stories to align on scope, implementation feasibility, and testing scenarios. While the name implies exactly three participants, it refers to three core perspectives: business value, technical construction, and quality validation."
    },
    {
      type: "p",
      text: "To run a Three Amigos session, you gather representatives for each perspective. The Business perspective presents the user story objectives and business rules. The Developer perspective evaluates technical constraints, API contracts, and database requirements. The Tester perspective challenges assumptions and defines test scenarios. Depending on the complexity of the story, other roles (such as UX designers or database administrators) may also participate to clarify visual flows or data models."
    },
    {
      type: "table",
      headers: ["Perspective Role", "Primary Team Member", "Key Questions Asked", "Deliverables Provided"],
      rows: [
        ["Business / Product", "Product Owner / Business Analyst", "Why are we building this? What is the user value?", "User story summary, target market value, business rules"],
        ["Construction / Dev", "Software Engineer / Technical Lead", "How will we build this? Are there dependency blocks?", "Architectural outline, API definitions, technical constraints"],
        ["Validation / Test", "QA Engineer / Automation Tester", "What can go wrong? How will we verify this feature?", "Acceptance criteria, boundary test cases, edge scenarios"]
      ]
    },
    {
      type: "p",
      text: "Notice how the three perspectives complement each other. The Product Owner ensures the team builds the right thing. The Developer ensures the team builds it correctly. The QA Engineer ensures the team considers what could break. Together, they create a complete blueprint for the user story, reducing ambiguity and preventing downstream regression errors."
    },
    {
      type: "code",
      language: "gherkin",
      code: `# Gherkin scenario written collaboratively during a Three Amigos session
Feature: Premium Customer Discount
  As a registered gold member
  I want to receive a discount at checkout
  So that I am rewarded for my brand loyalty

  Scenario: Gold member buys high value items
    Given the user is logged in as a "Gold" member
    And the user's shopping cart total is $120.00
    When the user proceeds to the payment screen
    Then the system applies a 20% discount to the total
    And the user receives free shipping on the purchase`
    },
    {
      type: "h2",
      text: "How Do the Three Amigos Refine User Stories?"
    },
    {
      type: "p",
      text: "The refinement process begins during backlog preparation sessions, at least a week before the sprint planning meeting. The team focuses on breaking down large, ambiguous tasks (epics) into small, independent user stories. Each story must satisfy the INVEST criteria to ensure it can be completed within a single sprint."
    },
    {
      type: "p",
      text: "During the meeting, the Amigos review each user story. The Product Owner reads the summary. The QA engineer suggests negative scenarios (such as network timeouts or invalid form inputs) and translates them into acceptance criteria using Gherkin syntax (Given-When-Then structure). The Developer validates that the required API endpoints exist or outlines the database changes. Once the story has clear acceptance criteria, a clear test plan, and no technical blocks, it is marked as ready for sprint planning."
    },
    {
      type: "callout",
      variant: "warning",
      title: "The Gherkin Syntax Standard",
      text: "Use Gherkin syntax to write testable scenarios. Given defines the starting state, When defines the user action, and Then defines the expected outcome. This structure can be directly automated using tools like Cucumber."
    },
    {
      type: "ul",
      items: [
        "INVEST Evaluation: Verify that each refined user story is Independent, Negotiable, Valuable, Estimable, Small, and Testable.",
        "Scoping Limits: If a user story has more than five distinct scenarios, split it into smaller stories to maintain focus.",
        "Definition of Ready (DoR): Enforce a checklist (such as clear UI wireframes, defined API contracts, and QA acceptance criteria)."
      ]
    },
    {
      type: "h2",
      text: "Three Amigos Meeting Structure: A Quick Reference"
    },
    {
      type: "p",
      text: "Establishing a repeatable agenda for your Three Amigos sessions prevents meetings from dragging on and ensures consistent quality. Sessions should be timeboxed to thirty minutes per story. The focus is on active conversation and sketching out test scenarios, rather than writing long formal documentation."
    },
    {
      type: "p",
      text: "By keeping sessions short, team members remain engaged. The output of each session must be recorded directly in the issue tracking system (such as Jira or Linear), appending the Gherkin scenarios to the story description. This provides developers with a clear checklist of behaviors to implement and QA engineers with a starting point for writing automated tests. This structured loop is detailed below."
    },
    {
      type: "table",
      headers: ["Session Phase", "Duration", "Key Activities", "Output Record"],
      rows: [
        ["Phase 1: Story Presentation", "5 minutes", "Product Owner explains the business intent and basic rules", "Initial story review"],
        ["Phase 2: Technical Triage", "10 minutes", "Developer outlines architecture and database schemas", "API contract agreements"],
        ["Phase 3: Scenario Design", "10 minutes", "QA engineer drafts positive, negative, and boundary scenarios", "Gherkin acceptance criteria"],
        ["Phase 4: Readiness Check", "5 minutes", "Amigos verify story satisfies DoR checklist and estimate size", "Ready for Sprint flag set"]
      ]
    },
    {
      type: "ul",
      items: [
        "Timebox Enforcement: Respect team calendars by timeboxing discussions, scheduling follow-up sessions for complex blocks.",
        "Actionable Scenarios: Do not close the session until at least three distinct test scenarios have been drafted for the user story.",
        "Collaborative Ownership: All three amigos share responsibility for the story's success and post-deployment stability."
      ]
    },
    {
      type: "h2",
      text: "Key Takeaways and Next Action"
    },
    {
      type: "ul",
      items: [
        "**Early Alignment**: Meet before the sprint planning session to align business, development, and testing perspectives.",
        "**Testable Requirements**: Translate user story acceptance criteria into Gherkin scenarios (Given-When-Then) during the meeting.",
        "**Strict Gating**: Enforce your Definition of Ready strictly to prevent half-formed stories from blocking active sprint cycles."
      ]
    },
    {
      type: "p",
      text: "Your next step: Schedule a twenty-minute pilot Three Amigos session with a developer and product owner for a single upcoming user story. Draft three Gherkin scenarios and add them to the ticket."
    },
    {
      type: "p",
      text: "Coming up next: End of syllabus. Congratulations on completing the QAHub software testing course!"
    },
    {
      type: "h2",
      text: "Frequently Asked Questions"
    },
    {
      type: "h3",
      text: "Who participates in a Three Amigos meeting?"
    },
    {
      type: "p",
      text: "A Three Amigos meeting requires at least three perspectives: business (represented by the Product Owner or Business Analyst), construction (represented by a Software Developer), and validation (represented by a QA Engineer). Other roles, such as UX designers or database leads, may attend if needed."
    },
    {
      type: "h3",
      text: "How does Three Amigos differ from general backlog refinement?"
    },
    {
      type: "p",
      text: "Backlog refinement is a general team meeting focused on prioritizing tasks and estimating sizes. The Three Amigos meeting is a smaller, highly focused session designed to detail specific scenarios and write testable acceptance criteria for individual stories, preparing them for the sprint backlog."
    },
    {
      type: "h3",
      text: "What if a user story fails the Definition of Ready?"
    },
    {
      type: "p",
      text: "If a user story fails the Definition of Ready (for example, if UI designs are missing or API contracts are undefined), it must not enter the active sprint. The Amigos return it to the backlog backlog, and the Product Owner coordinates with design or architecture to resolve the blockers."
    },
    {
      type: "h3",
      text: "How do we document the outcomes of a Three Amigos session?"
    },
    {
      type: "p",
      text: "The outcomes of a Three Amigos session are documented as Gherkin scenarios directly inside the user story description in your tracking system (such as Jira). This ensures that developers write code that satisfies these exact criteria, and testers use the same scenarios to write automated suites."
    }
  ]
};
