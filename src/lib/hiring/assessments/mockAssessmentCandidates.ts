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
    score: 4,
    maxScore: 5,
    status: "Passed",
    candidateAnswer: "B — Keys help React identify list items across renders",
    correctAnswer: "B — Keys help React identify list items across renders",
    evaluatorNotes: "Correct on batching and key usage.",
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
