export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://softwaretestingbasics.io';

  const articles = [
    'software-testing-basics',
    'what-is-software-testing',
    'types-of-software-testing',
    'manual-vs-automated-testing',
    'test-driven-development',
    'black-box-vs-white-box',
    'testing-tools-frameworks',
    'bug-lifecycle',
    'writing-effective-test-cases',
    'performance-testing',
    'testing-best-practices',
    'verification-vs-validation',
    'psychology-of-software-testing',
    'api-and-integration-testing',
    'security-testing-essentials',
    'database-testing-guide',
    'usability-accessibility-testing',
    'mobile-application-testing',
    'shift-left-testing',
    'continuous-testing-cicd',
    'test-data-management',
    'behavior-driven-development',
    'exploratory-testing',
    'agile-testing-methodology',
    'equivalence-partitioning-bva',
    'decision-tables-state-transition',
    'mutation-testing',
    'cypress-vs-playwright',
    'static-code-analysis',
    'defect-metrics-analysis',
    'three-amigos-story-refinement',
  ];

  const articleEntries = articles.map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date(slug === 'software-testing-basics' ? '2026-07-17' : '2026-05-30'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-07-17'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...articleEntries,
  ];
}
