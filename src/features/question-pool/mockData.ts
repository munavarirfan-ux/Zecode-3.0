import { getSubtypeOptions } from "./questionSubtypes";
import type { Curator, DatabaseSchema, Question, QuestionType } from "./types";

export const CURATORS: Curator[] = [
  { id: "c1", name: "Priya Nair", avatarGradient: ["#7C3AED", "#EC4899"] },
  { id: "c2", name: "Marcus Chen", avatarGradient: ["#06B6D4", "#3B82F6"] },
  { id: "c3", name: "Elena Rossi", avatarGradient: ["#F97316", "#F59E0B"] },
  { id: "c4", name: "James Okonkwo", avatarGradient: ["#6366F1", "#8B5CF6"] },
  { id: "c5", name: "Sofia Martins", avatarGradient: ["#10B981", "#06B6D4"] },
];

export const DATABASE_SCHEMAS: DatabaseSchema[] = [
  {
    id: "banking_db",
    label: "Banking",
    tables: [
      { name: "customers", columns: ["id", "name", "email", "created_at"] },
      { name: "accounts", columns: ["id", "customer_id", "type", "balance"] },
      { name: "transactions", columns: ["id", "account_id", "amount", "posted_at"] },
      { name: "loans", columns: ["id", "customer_id", "principal", "rate"] },
      { name: "branches", columns: ["id", "city", "manager_id"] },
    ],
    relationships: [
      { from: "accounts.customer_id", to: "customers.id" },
      { from: "transactions.account_id", to: "accounts.id" },
      { from: "loans.customer_id", to: "customers.id" },
    ],
  },
  {
    id: "ecommerce_db",
    label: "E-commerce",
    tables: [
      { name: "users", columns: ["id", "email", "joined_at"] },
      { name: "products", columns: ["id", "sku", "price", "category_id"] },
      { name: "orders", columns: ["id", "user_id", "status", "total"] },
      { name: "order_items", columns: ["id", "order_id", "product_id", "qty"] },
      { name: "categories", columns: ["id", "name", "parent_id"] },
      { name: "reviews", columns: ["id", "product_id", "user_id", "rating"] },
    ],
    relationships: [
      { from: "orders.user_id", to: "users.id" },
      { from: "order_items.order_id", to: "orders.id" },
      { from: "order_items.product_id", to: "products.id" },
    ],
  },
  {
    id: "hr_db",
    label: "HR",
    tables: [
      { name: "employees", columns: ["id", "name", "dept_id", "hired_on"] },
      { name: "departments", columns: ["id", "name", "location"] },
      { name: "roles", columns: ["id", "title", "level"] },
      { name: "employee_roles", columns: ["employee_id", "role_id"] },
      { name: "payroll", columns: ["id", "employee_id", "amount", "paid_at"] },
    ],
    relationships: [
      { from: "employees.dept_id", to: "departments.id" },
      { from: "employee_roles.employee_id", to: "employees.id" },
      { from: "payroll.employee_id", to: "employees.id" },
    ],
  },
];

const SKILLS = [
  "JavaScript",
  "Python",
  "SQL",
  "React",
  "System Design",
  "Data Structures",
  "Algorithms",
] as const;

const TAG_POOL = [
  "Arrays",
  "Strings",
  "OOP",
  "Async",
  "SQL Joins",
  "Debugging",
  "React State",
  "API Design",
] as const;

const TITLES: Record<QuestionType, string[]> = {
  coding: [
    "Implement LRU cache with O(1) operations",
    "Merge intervals from unsorted input",
    "Design rate limiter token bucket",
    "Serialize binary tree to array",
    "Find longest substring without repeat",
    "Implement debounce utility",
    "Parse nested JSON paths safely",
    "Rotate matrix in-place",
  ],
  database: [
    "7-day retention by signup cohort",
    "Top spenders with rolling window",
    "Detect duplicate transactions",
    "Monthly revenue by product category",
    "Active employees without payroll row",
    "Cart abandonment funnel query",
  ],
  mcq: [
    "HTTP caching semantics",
    "React reconciliation fundamentals",
    "Event loop ordering in Node",
    "CAP theorem trade-offs",
    "Index types in PostgreSQL",
    "REST idempotency principles",
  ],
  comprehension: [
    "API rate limiting design brief",
    "Microservices migration case study",
    "Observability strategy excerpt",
    "Payment reconciliation narrative",
  ],
  "open-ended": [
    "Describe a production incident you resolved",
    "How do you prioritize tech debt?",
    "Explain your approach to code reviews",
    "Trade-offs in your last architecture decision",
  ],
  "fill-blank": [
    "Complete the async/await error handling snippet",
    "Fill missing SQL JOIN clause",
    "Complete React hook dependency array",
    "Fill TypeScript generic constraint",
  ],
  debug: [
    "Fix off-by-one in binary search",
    "Resolve race in promise chain",
    "Debug incorrect memoization key",
    "Fix SQL injection vulnerable query builder",
  ],
};

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

function buildQuestions(): Question[] {
  const types: QuestionType[] = [
    "coding",
    "database",
    "mcq",
    "comprehension",
    "open-ended",
    "fill-blank",
    "debug",
  ];
  const statuses = ["published", "published", "published", "draft", "draft", "archived"] as const;
  const difficulties = ["easy", "medium", "hard"] as const;
  const questions: Question[] = [];
  let n = 1;

  for (const type of types) {
    const titles = TITLES[type];
    const count = type === "mcq" ? 10 : type === "coding" ? 9 : 7;
    for (let i = 0; i < count; i++) {
      const curator = pick(CURATORS, n);
      const skill = pick(SKILLS, n + i);
      const tagCount = 1 + (n % 3);
      const tags = Array.from({ length: tagCount }, (_, t) => pick(TAG_POOL, n + t));
      const status = pick(statuses, n);
      const difficulty = pick(difficulties, n + i);
      const title = titles[i % titles.length];
      const subtypeOptions = getSubtypeOptions(type);
      const subtype =
        subtypeOptions.length > 0
          ? subtypeOptions[n % subtypeOptions.length]?.id
          : undefined;

      const base: Question = {
        id: `qp-${n}`,
        number: n,
        title,
        bodyMarkdown: `## ${title}\n\nEvaluate the candidate on **${skill}** fundamentals. Provide clear constraints and sample I/O where applicable.`,
        type,
        subtype,
        difficulty,
        status,
        skill,
        tags,
        curator,
        meta: {
          createdAt: new Date(2025, (n % 12), 1 + (n % 20)).toISOString(),
          updatedAt: new Date(2026, (n % 5), 1 + (n % 25)).toISOString(),
          lastUsedAt: n % 4 === 0 ? undefined : new Date(2026, 4, 1 + (n % 15)).toISOString(),
          usageCount: status === "draft" ? 0 : 1 + (n % 12),
          usedInAssessments:
            status === "draft"
              ? []
              : [`Senior Backend — ${1 + (n % 3)}`, `Product Designer — ${1 + (n % 2)}`].slice(0, 1 + (n % 2)),
        },
      };

      if (type === "mcq") {
        base.mcqOptions = [
          { id: "a", label: "Option A — baseline answer", isCorrect: false },
          { id: "b", label: "Option B — partially correct", isCorrect: n % 2 === 0 },
          { id: "c", label: "Option C — distractor", isCorrect: false },
          { id: "d", label: "Option D — best practice", isCorrect: n % 2 !== 0 },
        ];
      }
      if (type === "coding" || type === "debug") {
        base.testCases = [
          { id: "t1", input: "[1,2,3]", expected: "6", hidden: false },
          { id: "t2", input: "[]", expected: "0", hidden: true },
        ];
      }
      if (type === "database") {
        base.schemaId = pick(["banking_db", "ecommerce_db", "hr_db"], n);
      }

      questions.push(base);
      n++;
    }
  }

  return questions;
}

export const MOCK_QUESTIONS = buildQuestions();

export const POOL_STATS = {
  total: 417,
  published: 312,
  drafts: 105,
  mostUsedType: "MCQ",
  mostUsedCount: 142,
} as const;

export function getTypeCounts(questions: Question[]): Record<QuestionType | "all", number> {
  const counts = {
    all: questions.length,
    coding: 0,
    database: 0,
    mcq: 0,
    comprehension: 0,
    "open-ended": 0,
    "fill-blank": 0,
    debug: 0,
  } satisfies Record<QuestionType | "all", number>;
  for (const q of questions) counts[q.type]++;
  return counts;
}
