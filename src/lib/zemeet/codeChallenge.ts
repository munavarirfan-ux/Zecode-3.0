import type { ZeMeetCodeChallenge, ZeMeetCodeChallengeFile, ZeMeetQuestionPoolItem } from "./types";

export const CODE_CHALLENGE_LANGUAGES = ["TypeScript", "JavaScript", "Python", "Go"] as const;

export const QUESTION_POOL: ZeMeetQuestionPoolItem[] = [
  {
    id: "rate-limiter",
    title: "Design a rate limiter",
    problemStatement:
      "Implement a token-bucket rate limiter API. Expose `allow(key: string): boolean` and document tradeoffs between token bucket vs sliding window.",
    requirements: [
      "Support configurable max tokens and refill rate",
      "Return false when the bucket is empty",
      "Handle concurrent requests safely (describe approach)",
    ],
    userStories: [
      "As an API gateway, I reject traffic when a client exceeds their quota",
      "As an operator, I can tune limits per API key without redeploying",
    ],
    examples: [
      { input: "allow('user-1') × 5 with maxTokens=3", output: "true, true, true, false, false" },
      { input: "wait 1s, refillPerSec=2, allow('user-1')", output: "true, true" },
    ],
    constraints: ["O(1) amortized per allow call", "No external libraries for core logic"],
    testCaseInstructions: "Run against the hidden suite after implementing allow().",
    testCases: [
      { id: "t1", label: "allows burst within limit", input: "max=3, calls=3", expectedOutput: "all true" },
      { id: "t2", label: "refills over time", input: "wait 1s, refill=2", expectedOutput: "2× true" },
      { id: "t3", label: "rejects when empty", input: "max=1, calls=2", expectedOutput: "true then false" },
    ],
    language: "TypeScript",
    starterCode: `export function createRateLimiter(maxTokens: number, refillPerSec: number) {
  // your implementation
}`,
  },
  {
    id: "lru-cache",
    title: "LRU cache",
    problemStatement:
      "Implement an LRU cache with O(1) get and put. The cache should evict the least recently used item when capacity is exceeded.",
    requirements: ["get(key) returns value or undefined", "put(key, value) updates recency", "capacity is fixed at construction"],
    userStories: ["As a platform engineer, I cache hot keys with predictable eviction"],
    examples: [{ input: "put(1,'a'); put(2,'b'); get(1)", output: "'a'" }],
    constraints: ["O(1) average time complexity", "Use only standard library"],
    testCaseInstructions: "Validate eviction order and capacity boundaries.",
    testCases: [
      { id: "t1", label: "returns inserted values", input: "put/get", expectedOutput: "match" },
      { id: "t2", label: "evicts LRU item", input: "capacity=2", expectedOutput: "oldest removed" },
    ],
    language: "TypeScript",
    starterCode: `export class LRUCache<K, V> {
  constructor(capacity: number) {}
  get(key: K): V | undefined { return undefined; }
  put(key: K, value: V): void {}
}`,
  },
  {
    id: "url-shortener",
    title: "URL shortener encode/decode",
    problemStatement: "Design encode and decode for a URL shortener using a base62 alphabet. Collisions must be handled.",
    requirements: ["encode(longUrl) returns short code", "decode(code) returns original URL", "Codes are deterministic for demo"],
    userStories: ["As a user, I share a short link that redirects correctly"],
    examples: [{ input: "encode('https://example.com/a')", output: "'abc12'" }],
    constraints: ["No database — in-memory map is fine for demo"],
    testCaseInstructions: "Round-trip encode/decode for multiple URLs.",
    testCases: [{ id: "t1", label: "round trip", input: "url", expectedOutput: "same url" }],
    language: "TypeScript",
    starterCode: `const map = new Map<string, string>();
export function encode(url: string): string {
  return "";
}
export function decode(code: string): string {
  return "";
}`,
  },
];

const STARTER_TEMPLATE = `export function createRateLimiter(maxTokens: number, refillPerSec: number) {
  let tokens = maxTokens;
  let last = Date.now();
  return {
    allow(_key: string) {
      const now = Date.now();
      const elapsed = (now - last) / 1000;
      tokens = Math.min(maxTokens, tokens + elapsed * refillPerSec);
      last = now;
      if (tokens >= 1) {
        tokens -= 1;
        return true;
      }
      return false;
    },
  };
}`;

export function createDefaultCodeChallenge(): ZeMeetCodeChallenge {
  const q = QUESTION_POOL[0];
  const solution = STARTER_TEMPLATE;
  const files: ZeMeetCodeChallengeFile[] = [
    { id: "main", name: "solution.ts", language: q.language, content: solution },
  ];
  return {
    status: "idle",
    problemTitle: q.title,
    problemStatement: q.problemStatement,
    requirements: q.requirements,
    userStories: q.userStories,
    examples: q.examples,
    constraints: q.constraints,
    testCaseInstructions: q.testCaseInstructions,
    testCases: q.testCases.map((t) => ({ ...t, passed: undefined })),
    language: q.language,
    languages: [...CODE_CHALLENGE_LANGUAGES],
    files,
    activeFileId: "main",
    candidateCode: solution,
    consoleOutput: "> Ready — click Run to execute tests",
    interviewerNotes: "",
    interviewerObservations: "",
    candidateEditingEnabled: true,
    finalStatus: "pending",
    autosaveStatus: "saved",
    challengeElapsedSeconds: 0,
    selectedQuestionId: q.id,
  };
}

export function challengeFromPoolItem(item: ZeMeetQuestionPoolItem): Partial<ZeMeetCodeChallenge> {
  return {
    selectedQuestionId: item.id,
    problemTitle: item.title,
    problemStatement: item.problemStatement,
    requirements: item.requirements,
    userStories: item.userStories,
    examples: item.examples,
    constraints: item.constraints,
    testCaseInstructions: item.testCaseInstructions,
    testCases: item.testCases.map((t) => ({ ...t, passed: undefined })),
    language: item.language,
    files: [
      {
        id: "main",
        name: item.language === "Python" ? "solution.py" : "solution.ts",
        language: item.language,
        content: item.starterCode,
      },
    ],
    activeFileId: "main",
    candidateCode: item.starterCode,
    consoleOutput: "> Ready — click Run to execute tests",
  };
}

export function formatChallengeTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const CODE_CHALLENGE_SYNC_PREFIX = "zemeet-code-challenge:";
