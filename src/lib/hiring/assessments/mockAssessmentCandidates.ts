import type {
  AssessmentCandidateRecord,
  AssessmentQuestionResult,
  AssessmentSectionScore,
} from "./types";

const NAMES = [
  { name: "Priya Sharma", email: "priya.sharma@email.com", linkedin: "linkedin.com/in/priyasharma" },
  { name: "James Okonkwo", email: "j.okonkwo@corp.io", linkedin: "linkedin.com/in/jokonkwo" },
  { name: "Elena Vasquez", email: "elena.v@studio.dev" },
  { name: "Marcus Webb", email: "marcus.webb@hire.co", linkedin: "linkedin.com/in/marcuswebb" },
  { name: "Aisha Khan", email: "aisha.khan@mail.com" },
  { name: "Noah Fischer", email: "noah.fischer@tech.de", linkedin: "linkedin.com/in/noahfischer" },
  { name: "Sofia Lindström", email: "sofia.l@nordic.io" },
  { name: "Daniel Park", email: "daniel.park@startup.com", linkedin: "linkedin.com/in/danielpark" },
  { name: "Yuki Tanaka", email: "yuki.tanaka@global.jp" },
  { name: "Olivia Grant", email: "olivia.grant@agency.com", linkedin: "linkedin.com/in/oliviagrant" },
  { name: "Ravi Menon", email: "ravi.menon@dev.in" },
  { name: "Chloe Bennett", email: "chloe.b@design.io", linkedin: "linkedin.com/in/chloebennett" },
];

function buildCandidates(assessmentId: string, count: number): AssessmentCandidateRecord[] {
  const statuses: AssessmentCandidateRecord["status"][] = [
    "Qualified",
    "Attempted",
    "Pending",
    "Not Qualified",
    "Malpractice Detected",
    "Expired",
    "Attempted",
    "Qualified",
    "Pending",
    "Attempted",
    "Not Qualified",
    "Qualified",
  ];

  return Array.from({ length: count }, (_, i) => {
    const person = NAMES[i % NAMES.length];
    const status = statuses[i % statuses.length];
    const hasAttempt = status !== "Pending" && status !== "Expired";
    const qualified =
      status === "Qualified" ? true : status === "Not Qualified" ? false : status === "Malpractice Detected" ? false : null;
    const score = hasAttempt ? 55 + ((i * 7) % 40) : null;
    const malpracticeSignals =
      status === "Malpractice Detected"
        ? (["Tab switch detected", "Copy attempt"] as const)
        : i % 5 === 0 && hasAttempt
          ? (["Tab switch detected"] as const)
          : [];

    return {
      id: `ac-${assessmentId}-${i + 1}`,
      assessmentId,
      name: person.name,
      email: person.email,
      linkedin: person.linkedin,
      phone: i % 3 === 0 ? "+1 555 0100" : undefined,
      resumeUrl: i % 2 === 0 ? "/resumes/demo.pdf" : undefined,
      status,
      score,
      qualified,
      durationMinutes: hasAttempt ? 42 + (i % 35) : null,
      attemptedAt: hasAttempt ? `May ${10 + (i % 8)}, 2026` : null,
      inviteSentAt: `May ${4 + (i % 6)}, 2026`,
      malpracticeSignals: [...malpracticeSignals],
      completionPercent: hasAttempt ? 70 + (i % 28) : status === "Pending" ? 0 : null,
    };
  });
}

export const SEED_ASSESSMENT_CANDIDATES: AssessmentCandidateRecord[] = [
  ...buildCandidates("asm-frontend-react", 12),
  ...buildCandidates("asm-backend-core", 8),
  ...buildCandidates("asm-sql-analytics", 6),
];

const QUESTION_SEEDS: Omit<AssessmentQuestionResult, "id" | "candidateId" | "assessmentId">[] = [
  {
    tab: "Coding",
    title: "Implement debounced search hook",
    difficulty: "Medium",
    language: "TypeScript",
    score: 18,
    maxScore: 20,
    testCasesPassed: "8/10",
    status: "Partial",
    problemStatement:
      "Build a reusable `useDebouncedSearch` hook that accepts a query string and delay, returning the debounced value. Handle cleanup on unmount.",
    submittedCode: `export function useDebouncedSearch(q: string, ms = 300) {
  const [value, setValue] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setValue(q), ms);
    return () => clearTimeout(t);
  }, [q, ms]);
  return value;
}`,
    expectedOutput: "Debounced value updates after delay; no memory leaks.",
    actualOutput: "8/10 tests passed; 2 timeout on rapid unmount.",
    executionOutput: "All visible tests passed. 2 edge cases timed out.",
    evaluatorNotes: "Solid hook structure; missing cleanup on unmount in one branch.",
    aiSummary: "Candidate demonstrates strong React patterns with minor timing edge gaps.",
    testCaseResults: [
      { name: "Returns initial value", passed: true },
      { name: "Debounces updates", passed: true },
      { name: "Cleans up on unmount", passed: false, expected: "clearTimeout", actual: "—" },
    ],
  },
  {
    tab: "Coding",
    title: "Array deduplication utility",
    difficulty: "Easy",
    language: "TypeScript",
    score: 0,
    maxScore: 50,
    testCasesPassed: "0/12",
    status: "Failed",
    problemStatement: "Implement `uniqueBy<T>(items: T[], key: keyof T): T[]` preserving first occurrence order.",
    submittedCode: "// incomplete submission",
  },
  {
    tab: "Debug Snippet",
    title: "Fix stale closure in effect",
    difficulty: "Hard",
    language: "JavaScript",
    score: 12,
    maxScore: 50,
    testCasesPassed: "5/6",
    status: "Partial",
    originalSnippet: `useEffect(() => {
  fetchStats(userId).then(setStats);
}, []); // bug: stale userId`,
    candidateFixedSnippet: `useEffect(() => {
  let cancelled = false;
  fetchStats(userId).then((data) => {
    if (!cancelled) setStats(data);
  });
  return () => { cancelled = true; };
}, [userId]);`,
    expectedFix: "Add userId to dependency array and guard async updates.",
    submittedCode: "// see candidate fixed snippet",
    testCaseResults: [
      { name: "Re-renders on userId change", passed: true },
      { name: "No stale data", passed: true },
      { name: "Race on rapid switch", passed: false },
    ],
  },
  {
    tab: "MCQ",
    title: "React reconciliation fundamentals",
    difficulty: "Easy",
    score: 5,
    maxScore: 5,
    status: "Passed",
    candidateAnswer: "B",
    correctAnswer: "B",
    mcqAnswerType: "single",
    mcqOptions: [
      { letter: "A", text: "Keys are only needed for styling list items with CSS", isCorrect: false, isSelected: false },
      { letter: "B", text: "Keys help React identify which list items have changed, been added, or removed across renders", isCorrect: true, isSelected: true },
      { letter: "C", text: "Keys are used to encrypt component state between renders", isCorrect: false, isSelected: false },
      { letter: "D", text: "Keys allow React to skip rendering the virtual DOM entirely", isCorrect: false, isSelected: false },
    ],
  },
  {
    tab: "MCQ",
    title: "What is one potential challenge of using schema-on-read in a data lake?",
    difficulty: "Medium",
    score: 0,
    maxScore: 5,
    status: "Failed",
    candidateAnswer: "D",
    correctAnswer: "C",
    mcqAnswerType: "single",
    mcqOptions: [
      { letter: "A", text: "It requires all data to be transformed before ingestion", isCorrect: false, isSelected: false },
      { letter: "B", text: "Schema-on-read eliminates the need for data governance", isCorrect: false, isSelected: false },
      { letter: "C", text: "Queries may fail or return unexpected results if the underlying data format changes", isCorrect: true, isSelected: false },
      { letter: "D", text: "It prevents any form of data cataloging or metadata management", isCorrect: false, isSelected: true },
    ],
  },
  {
    tab: "MCQ",
    title: "Which of the following are valid React hook rules?",
    difficulty: "Medium",
    score: 3,
    maxScore: 5,
    status: "Partial",
    candidateAnswer: "A, C",
    correctAnswer: "A, B, C",
    mcqAnswerType: "multiple",
    mcqOptions: [
      { letter: "A", text: "Only call hooks at the top level of a function component", isCorrect: true, isSelected: true },
      { letter: "B", text: "Don't call hooks inside loops, conditions, or nested functions", isCorrect: true, isSelected: false },
      { letter: "C", text: "Only call hooks from React function components or custom hooks", isCorrect: true, isSelected: true },
      { letter: "D", text: "Hooks can be called conditionally as long as the order doesn't change", isCorrect: false, isSelected: false },
    ],
  },
  {
    tab: "MCQ",
    title: "What does the useEffect cleanup function do?",
    difficulty: "Easy",
    score: 0,
    maxScore: 5,
    status: "Skipped",
    candidateAnswer: "",
    correctAnswer: "A",
    mcqAnswerType: "single",
    mcqOptions: [
      { letter: "A", text: "Runs before the component unmounts or before the effect re-runs to prevent memory leaks", isCorrect: true, isSelected: false },
      { letter: "B", text: "Automatically cancels all pending API requests", isCorrect: false, isSelected: false },
      { letter: "C", text: "Resets the component state to its initial values", isCorrect: false, isSelected: false },
      { letter: "D", text: "Removes the component from the virtual DOM tree", isCorrect: false, isSelected: false },
    ],
  },
  {
    tab: "Comprehension",
    title: "Server-Side Rendering vs Client-Side Rendering",
    difficulty: "Medium",
    score: 3,
    maxScore: 5,
    status: "Partial",
    comprehensionPassage: `Server-Side Rendering (SSR) and Client-Side Rendering (CSR) represent two fundamentally different approaches to delivering web content to users. In SSR, the server generates the full HTML for each page request and sends it to the browser, which can display it immediately. This approach dominated early web development and has seen a resurgence with frameworks like Next.js and Nuxt.js.

CSR, popularized by single-page application frameworks like React and Angular, takes a different approach. The server sends a minimal HTML shell along with JavaScript bundles. The browser then executes the JavaScript to render the page content dynamically. This means the initial page load may show a blank screen or loading spinner while scripts are downloaded and executed.

The performance implications differ significantly between the two approaches. SSR typically achieves a faster First Contentful Paint (FCP) because the browser receives pre-rendered HTML. However, the page may not become interactive until JavaScript hydration completes — a metric known as Time to Interactive (TTI). CSR applications often have a slower FCP but can provide smoother subsequent navigations since only data needs to be fetched, not entire pages.

Search Engine Optimization (SEO) has historically favored SSR because crawlers could easily parse the pre-rendered HTML. While modern search engines like Google can now execute JavaScript and index CSR content, there remains a crawl budget consideration — pages that require JavaScript execution consume more crawler resources and may be indexed less frequently.

Caching strategies also differ between the approaches. SSR pages can be cached at the CDN edge, delivering near-instant responses for popular pages. However, personalized content requires cache invalidation or bypass strategies. CSR applications cache the application shell and rely on API-level caching for data, which provides more granular control but introduces complexity in cache coherence.`,
    comprehensionQuestions: [
      {
        id: "cq-1",
        question: "According to the passage, what is the primary advantage of SSR over CSR for initial page load?",
        status: "Passed",
        options: [
          { letter: "A", text: "SSR provides smoother subsequent page navigations", isCorrect: false, isSelected: false },
          { letter: "B", text: "SSR achieves a faster First Contentful Paint because the browser receives pre-rendered HTML", isCorrect: true, isSelected: true },
          { letter: "C", text: "SSR eliminates the need for JavaScript entirely", isCorrect: false, isSelected: false },
          { letter: "D", text: "SSR uses less server resources than CSR", isCorrect: false, isSelected: false },
        ],
      },
      {
        id: "cq-2",
        question: "What does the passage identify as a limitation of SSR regarding interactivity?",
        status: "Passed",
        options: [
          { letter: "A", text: "SSR pages can never become interactive", isCorrect: false, isSelected: false },
          { letter: "B", text: "SSR requires a separate mobile application", isCorrect: false, isSelected: false },
          { letter: "C", text: "The page may not become interactive until JavaScript hydration completes", isCorrect: true, isSelected: true },
          { letter: "D", text: "SSR prevents the use of modern JavaScript frameworks", isCorrect: false, isSelected: false },
        ],
      },
      {
        id: "cq-3",
        question: "Why does the passage suggest that SEO still favors SSR despite modern crawlers executing JavaScript?",
        status: "Failed",
        options: [
          { letter: "A", text: "Because Google cannot index JavaScript content at all", isCorrect: false, isSelected: true },
          { letter: "B", text: "Because JavaScript-rendered pages consume more crawler resources and may be indexed less frequently", isCorrect: true, isSelected: false },
          { letter: "C", text: "Because CSR applications cannot have meta tags", isCorrect: false, isSelected: false },
          { letter: "D", text: "Because SSR pages load faster on mobile networks", isCorrect: false, isSelected: false },
        ],
      },
      {
        id: "cq-4",
        question: "According to the passage, what challenge does personalized content present for SSR caching?",
        status: "Passed",
        options: [
          { letter: "A", text: "Personalized content cannot be delivered via SSR", isCorrect: false, isSelected: false },
          { letter: "B", text: "It requires cache invalidation or bypass strategies", isCorrect: true, isSelected: true },
          { letter: "C", text: "CDN edge caching is incompatible with SSR", isCorrect: false, isSelected: false },
          { letter: "D", text: "Personalized pages must always use CSR instead", isCorrect: false, isSelected: false },
        ],
      },
      {
        id: "cq-5",
        question: "Which caching advantage does the passage attribute to CSR applications?",
        status: "Failed",
        options: [
          { letter: "A", text: "CSR applications don't need any caching", isCorrect: false, isSelected: false },
          { letter: "B", text: "CSR provides automatic cache invalidation", isCorrect: false, isSelected: true },
          { letter: "C", text: "API-level caching provides more granular control over cached data", isCorrect: true, isSelected: false },
          { letter: "D", text: "CSR caches entire pages at the CDN edge", isCorrect: false, isSelected: false },
        ],
      },
    ],
  },
  {
    tab: "Database",
    title: "Optimize candidate pipeline query",
    difficulty: "Medium",
    language: "SQL",
    score: 9,
    maxScore: 10,
    testCasesPassed: "4/4",
    status: "Passed",
    submittedCode: "SELECT c.id, c.name FROM candidates c\nINNER JOIN applications a ON ...\nWHERE a.status = 'active';",
  },
  {
    tab: "Open Ended",
    title: "Component API design tradeoffs",
    difficulty: "Medium",
    score: 7,
    maxScore: 10,
    status: "Partial",
    candidateAnswer:
      "I would prefer composition over configuration props to keep the API flexible. Document breaking changes and provide codemods for major bumps.",
    evaluatorNotes: "Clear prose; could expand on accessibility.",
  },
  {
    tab: "Fill in the Blanks",
    title: "HTTP status codes",
    difficulty: "Easy",
    score: 5,
    maxScore: 5,
    status: "Passed",
    candidateAnswer: "201 Created, 204 No Content, 429 Too Many Requests",
    correctAnswer: "201 Created, 204 No Content, 429 Too Many Requests",
  },
];

export function buildQuestionResultsForCandidate(
  candidateId: string,
  assessmentId: string,
): AssessmentQuestionResult[] {
  return QUESTION_SEEDS.map((q, i) => ({
    ...q,
    id: `aqr-${candidateId}-${i}`,
    candidateId,
    assessmentId,
  }));
}

/** Default sectional totals for demo when questions are sparse */
export const DEFAULT_SECTION_SCORES: AssessmentSectionScore[] = [
  { section: "Coding", score: 18, maxScore: 50 },
  { section: "Debug Snippet", score: 12, maxScore: 50 },
];
