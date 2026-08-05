import type { AssessmentData, AssessmentSection, GuidelineSection } from "./types";

const GUIDELINES: GuidelineSection[] = [
  {
    id: "overview",
    title: "Assessment overview",
    items: [
      "This assessment tests your proficiency across multiple skill areas relevant to the role.",
      "You will encounter different question types including multiple choice, coding challenges, database queries, and more.",
      "Each section is independently timed within the overall assessment duration.",
      "Your progress is automatically saved after each answer submission.",
    ],
  },
  {
    id: "environment",
    title: "Environment requirements",
    items: [
      "Use a desktop or laptop computer with a stable internet connection.",
      "Use a modern browser (Chrome, Firefox, Safari, or Edge).",
      "Enable your webcam and microphone for proctoring.",
      "Close all other applications and browser tabs.",
      "Ensure your workspace is well-lit and free from distractions.",
    ],
  },
  {
    id: "code-submission",
    title: "Code submission",
    items: [
      "For coding questions, you may use the provided IDE with syntax highlighting and auto-complete.",
      "You can run your code against visible test cases before submitting.",
      "Hidden test cases will be evaluated after submission.",
      "Partial credit is awarded based on the number of test cases passed.",
    ],
  },
  {
    id: "compliance",
    title: "Compliance",
    items: [
      "Do not navigate away from the assessment window during the test.",
      "Do not use external resources, tools, or assistance.",
      "Screen activity and webcam feed are monitored throughout the assessment.",
      "Any suspicious activity will be flagged for review.",
    ],
  },
  {
    id: "navigation",
    title: "Exam navigation",
    items: [
      "Use the section navigator on the left to jump between sections and questions.",
      "You can mark questions for review and return to them later.",
      "Use Previous and Next buttons to navigate sequentially.",
      "You may submit individual sections or the entire assessment at once.",
    ],
  },
];

const MCQ_SECTION: AssessmentSection = {
  id: "mcq",
  type: "mcq",
  label: "Multiple Choice",
  questionCount: 3,
  weightage: 10,
  questions: [
    {
      id: "mcq-1",
      type: "mcq",
      sectionId: "mcq",
      number: 1,
      title: "REST API Methods",
      body: "Which HTTP method is idempotent and used to update a resource completely?",
      status: "unanswered",
      answerType: "single",
      options: [
        { id: "a", letter: "A", text: "POST" },
        { id: "b", letter: "B", text: "PUT" },
        { id: "c", letter: "C", text: "PATCH" },
        { id: "d", letter: "D", text: "DELETE" },
      ],
    },
    {
      id: "mcq-2",
      type: "mcq",
      sectionId: "mcq",
      number: 2,
      title: "Data Structures",
      body: "Which of the following data structures use LIFO (Last In, First Out) ordering? Select all that apply.",
      status: "answered",
      answerType: "multiple",
      options: [
        { id: "a", letter: "A", text: "Stack" },
        { id: "b", letter: "B", text: "Queue" },
        { id: "c", letter: "C", text: "Call stack" },
        { id: "d", letter: "D", text: "Priority queue" },
      ],
    },
    {
      id: "mcq-3",
      type: "mcq",
      sectionId: "mcq",
      number: 3,
      title: "Database Normalization",
      body: "Which normal form eliminates transitive dependencies?",
      status: "marked-for-review",
      answerType: "single",
      options: [
        { id: "a", letter: "A", text: "First Normal Form (1NF)" },
        { id: "b", letter: "B", text: "Second Normal Form (2NF)" },
        { id: "c", letter: "C", text: "Third Normal Form (3NF)" },
        { id: "d", letter: "D", text: "Boyce-Codd Normal Form (BCNF)" },
      ],
    },
  ],
};

const CODING_SECTION: AssessmentSection = {
  id: "coding",
  type: "coding",
  label: "Coding",
  questionCount: 3,
  weightage: 20,
  questions: [
    {
      id: "code-1",
      type: "coding",
      sectionId: "coding",
      number: 1,
      title: "Check Prime Number",
      body: "Write a function `isPrime(n)` that returns `true` if the given number `n` is a prime number and `false` otherwise.\n\n**Constraints:**\n- 1 ≤ n ≤ 10^6\n- The function should handle edge cases (n = 1, n = 2)\n\n**Examples:**\n```\nisPrime(7)  → true\nisPrime(12) → false\nisPrime(2)  → true\n```",
      status: "unanswered",
      codeStarter: "function isPrime(n) {\n  // Your code here\n}",
      language: "javascript",
      testCases: [
        { id: "tc1", input: "7", expectedOutput: "true", visible: true },
        { id: "tc2", input: "12", expectedOutput: "false", visible: true },
        { id: "tc3", input: "2", expectedOutput: "true", visible: true },
        { id: "tc4", input: "1", expectedOutput: "false", visible: false },
      ],
    },
    {
      id: "code-2",
      type: "coding",
      sectionId: "coding",
      number: 2,
      title: "Responsive Profile Card",
      status: "unanswered",
      frontend: true,
      difficulty: "Medium",
      estimatedMinutes: 15,
      points: 20,
      body: [
        "## Overview",
        "Build a polished, responsive **profile card** component using HTML, CSS, and a small amount of JavaScript. The starter files render a basic card — your job is to finish the styling and interaction so it matches the reference design.",
        "",
        "## Constraints",
        "- Use semantic HTML and keep the markup accessible.",
        "- The card must be centered and adapt from mobile to desktop.",
        "- Do not add external CSS frameworks.",
        "",
        "## Acceptance Criteria",
        "- The `Follow` button toggles to `Following` on click.",
        "- A visible hover state exists on the button.",
        "- Layout uses Flexbox or Grid.",
        "",
        "## Hints",
        "- `styles.css` already sets up the card surface — you mainly need the button.",
        "- Use `:hover` and a short `transition` for a smooth effect.",
      ].join("\n"),
      requirements: [
        "Responsive layout",
        "Hover effects",
        "Flexbox / Grid",
        "Accessibility (alt text, labels)",
        "Subtle animation",
        "Mobile support",
      ],
      referenceImage: `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="560" viewBox="0 0 480 560"><rect width="480" height="560" fill="#f4f4f7"/><rect x="90" y="110" width="300" height="340" rx="20" fill="#ffffff"/><circle cx="240" cy="200" r="48" fill="#e9d5ff"/><circle cx="240" cy="200" r="48" fill="none" stroke="#7100bd" stroke-width="3"/><rect x="180" y="272" width="120" height="18" rx="6" fill="#18181b"/><rect x="196" y="302" width="88" height="12" rx="6" fill="#7100bd"/><rect x="150" y="336" width="180" height="9" rx="4" fill="#d4d4d8"/><rect x="164" y="352" width="152" height="9" rx="4" fill="#d4d4d8"/><rect x="160" y="388" width="160" height="40" rx="20" fill="#7100bd"/><rect x="205" y="402" width="70" height="12" rx="6" fill="#ffffff"/></svg>`,
      assets: [
        {
          id: "a1",
          name: "avatar.svg",
          kind: "svg",
          src: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="32" fill="#e9d5ff"/><circle cx="32" cy="26" r="12" fill="#7100bd"/><path d="M12 56c0-12 9-18 20-18s20 6 20 18z" fill="#7100bd"/></svg>`,
        },
        {
          id: "a2",
          name: "check-icon.svg",
          kind: "icon",
          src: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="#ecfdf5"/><path d="M20 33l9 9 16-18" stroke="#10b981" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        },
        {
          id: "a3",
          name: "brand-font.woff2",
          kind: "font",
          src: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="#eff6ff"/><text x="32" y="42" font-size="30" font-family="serif" text-anchor="middle" fill="#2563eb">Aa</text></svg>`,
        },
        {
          id: "a4",
          name: "starter-kit.zip",
          kind: "zip",
          src: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="#fef3c7"/><rect x="28" y="14" width="8" height="36" fill="#d97706"/><rect x="28" y="14" width="8" height="6" fill="#92400e"/><rect x="28" y="26" width="8" height="6" fill="#92400e"/><rect x="28" y="38" width="8" height="6" fill="#92400e"/></svg>`,
        },
      ],
      files: [
        {
          name: "index.html",
          language: "html",
          content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />
    <title>Profile Card</title>
  </head>
  <body>
    <main class="card">
      <img
        class="avatar"
        src="https://i.pravatar.cc/120?img=13"
        alt="Portrait of Ava Chen"
      />
      <h1 class="name">Ava Chen</h1>
      <p class="role">Product Designer</p>
      <p class="bio">Designing calm, accessible interfaces for teams that ship fast.</p>
      <button class="follow" id="followBtn">Follow</button>
    </main>
    <script src="script.js"></script>
  </body>
</html>`,
        },
        {
          name: "styles.css",
          language: "css",
          content: `:root {
  --brand: #7100bd;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f4f4f7;
}
.card {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  max-width: 320px;
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--brand);
}
.name { margin: 16px 0 4px; font-size: 20px; color: #18181b; }
.role { margin: 0; color: var(--brand); font-weight: 600; }
.bio { color: #555; font-size: 14px; line-height: 1.5; }

/* TODO: style the .follow button and add a hover state */
.follow {
}
`,
        },
        {
          name: "script.js",
          language: "javascript",
          content: `const btn = document.getElementById("followBtn");
let following = false;

btn.addEventListener("click", () => {
  following = !following;
  btn.textContent = following ? "Following" : "Follow";
  console.log("Follow state:", following);
});
`,
        },
        {
          name: "package.json",
          language: "json",
          content: `{
  "name": "profile-card",
  "version": "1.0.0",
  "description": "Responsive profile card component challenge"
}
`,
        },
      ],
    },
    {
      id: "code-3",
      type: "coding",
      sectionId: "coding",
      number: 3,
      title: "Two Sum",
      body: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution.\n\n**Examples:**\n```\ntwoSum([2,7,11,15], 9) → [0, 1]\ntwoSum([3,2,4], 6)     → [1, 2]\n```",
      status: "unanswered",
      codeStarter: "function twoSum(nums, target) {\n  // Your code here\n}",
      language: "javascript",
      testCases: [
        { id: "tc1", input: "[2,7,11,15], 9", expectedOutput: "[0,1]", visible: true },
        { id: "tc2", input: "[3,2,4], 6", expectedOutput: "[1,2]", visible: true },
      ],
    },
  ],
};

const OPEN_ENDED_SECTION: AssessmentSection = {
  id: "open-ended",
  type: "open-ended",
  label: "Open-ended",
  questionCount: 2,
  weightage: 15,
  questions: [
    {
      id: "oe-1",
      type: "open-ended",
      sectionId: "open-ended",
      number: 1,
      title: "System Design",
      body: "Design a URL shortening service similar to bit.ly.\n\nYour answer should cover:\n\n- **High-level architecture** — what components are needed?\n- **Data model** — how would you store the mappings?\n- **API design** — what endpoints would you expose?\n- **Scalability** — how would you handle millions of requests per day?\n- **Trade-offs** — what choices did you make and why?",
      status: "unanswered",
    },
    {
      id: "oe-2",
      type: "open-ended",
      sectionId: "open-ended",
      number: 2,
      title: "Technical Communication",
      body: "Explain the concept of **database indexing** to a non-technical stakeholder. Include:\n\n1. What problem does indexing solve?\n2. A real-world analogy\n3. When should you add or avoid indexes?\n4. Any downsides to over-indexing?",
      status: "unanswered",
    },
  ],
};

const COMPREHENSION_SECTION: AssessmentSection = {
  id: "comprehension",
  type: "comprehension",
  label: "Comprehension",
  questionCount: 3,
  weightage: 15,
  questions: [
    {
      id: "comp-1",
      type: "comprehension",
      sectionId: "comprehension",
      number: 1,
      title: "Microservices Architecture",
      body: "Read the passage below and answer the following questions.",
      status: "unanswered",
      passage: "Microservices architecture is an approach to software development where a large application is built as a suite of small, independently deployable services. Each service runs its own process and communicates through lightweight mechanisms, typically HTTP-based APIs.\n\nUnlike monolithic architectures where all functionality exists in a single codebase, microservices allow teams to develop, deploy, and scale individual components independently. This approach offers benefits such as technology diversity (each service can use different programming languages or databases), fault isolation (a failure in one service doesn't bring down the entire system), and independent scaling (services under heavy load can be scaled without affecting others).\n\nHowever, microservices introduce complexity in areas such as distributed data management, inter-service communication, and operational overhead. Organizations must invest in robust monitoring, service discovery, and deployment automation to successfully operate a microservices-based system.",
      subQuestions: [
        {
          id: "comp-1-q1",
          body: "What is the primary communication mechanism between microservices according to the passage?",
          answerType: "single",
          options: [
            { id: "a", letter: "A", text: "Message queues" },
            { id: "b", letter: "B", text: "HTTP-based APIs" },
            { id: "c", letter: "C", text: "Shared databases" },
            { id: "d", letter: "D", text: "Remote procedure calls" },
          ],
        },
        {
          id: "comp-1-q2",
          body: "Which of the following are mentioned as benefits of microservices?",
          answerType: "multiple",
          options: [
            { id: "a", letter: "A", text: "Technology diversity" },
            { id: "b", letter: "B", text: "Reduced development time" },
            { id: "c", letter: "C", text: "Fault isolation" },
            { id: "d", letter: "D", text: "Independent scaling" },
          ],
        },
        {
          id: "comp-1-q3",
          body: "What does the passage identify as a challenge of microservices?",
          answerType: "single",
          options: [
            { id: "a", letter: "A", text: "Limited programming language support" },
            { id: "b", letter: "B", text: "Distributed data management complexity" },
            { id: "c", letter: "C", text: "Inability to scale" },
            { id: "d", letter: "D", text: "Single point of failure" },
          ],
        },
      ],
    },
  ],
};

const DATABASE_SECTION: AssessmentSection = {
  id: "database",
  type: "database",
  label: "Database",
  questionCount: 3,
  weightage: 20,
  questions: [
    {
      id: "db-1",
      type: "database",
      sectionId: "database",
      number: 1,
      title: "Employee Department Query",
      status: "unanswered",
      schema: "employees_departments",
      difficulty: "Medium",
      estimatedMinutes: 12,
      points: 15,
      body: [
        "## Overview",
        "Find all employees who earn **more than the average salary** in their own department. Return the employee name, their department name, and their salary.",
        "",
        "Order the results by salary from highest to lowest.",
      ].join("\n"),
      requirements: [
        "Return employee name, department, salary",
        "Compare against per-department average",
        "Use a JOIN between employees and departments",
        "Use GROUP BY / aggregation for the average",
        "Sort by salary descending",
        "No duplicate rows",
      ],
      constraints: [
        "Salaries are non-null positive integers.",
        "Every employee belongs to exactly one department.",
        "Use standard ANSI SQL only.",
      ],
      dbTables: [
        {
          name: "employees",
          columns: [
            { name: "id", type: "INT", pk: true },
            { name: "name", type: "VARCHAR(120)" },
            { name: "department_id", type: "INT", fk: true },
            { name: "salary", type: "DECIMAL(10,2)" },
            { name: "hired_at", type: "DATE", nullable: true },
          ],
        },
        {
          name: "departments",
          columns: [
            { name: "id", type: "INT", pk: true },
            { name: "name", type: "VARCHAR(80)" },
            { name: "location", type: "VARCHAR(80)", nullable: true },
          ],
        },
      ],
      erDiagram: `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="360" viewBox="0 0 560 360"><rect width="560" height="360" fill="#f8fafc"/><g><rect x="40" y="70" width="200" height="150" rx="10" fill="#ffffff" stroke="#7100bd" stroke-width="1.5"/><rect x="40" y="70" width="200" height="30" rx="10" fill="#7100bd"/><text x="52" y="90" font-family="monospace" font-size="13" fill="#fff" font-weight="bold">employees</text><text x="52" y="122" font-family="monospace" font-size="12" fill="#7100bd">🔑 id INT</text><text x="52" y="144" font-family="monospace" font-size="12" fill="#334155">name VARCHAR</text><text x="52" y="166" font-family="monospace" font-size="12" fill="#0ea5e9">department_id INT</text><text x="52" y="188" font-family="monospace" font-size="12" fill="#334155">salary DECIMAL</text><text x="52" y="210" font-family="monospace" font-size="12" fill="#94a3b8">hired_at DATE</text></g><g><rect x="330" y="110" width="190" height="110" rx="10" fill="#ffffff" stroke="#7100bd" stroke-width="1.5"/><rect x="330" y="110" width="190" height="30" rx="10" fill="#7100bd"/><text x="342" y="130" font-family="monospace" font-size="13" fill="#fff" font-weight="bold">departments</text><text x="342" y="162" font-family="monospace" font-size="12" fill="#7100bd">🔑 id INT</text><text x="342" y="184" font-family="monospace" font-size="12" fill="#334155">name VARCHAR</text><text x="342" y="206" font-family="monospace" font-size="12" fill="#94a3b8">location VARCHAR</text></g><path d="M240 150 H330" stroke="#0ea5e9" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#0ea5e9"/></marker></defs><text x="255" y="142" font-family="sans-serif" font-size="10" fill="#0ea5e9">FK</text></svg>`,
      codeStarter:
        "SELECT e.name, d.name AS department, e.salary\nFROM employees e\nJOIN departments d ON e.department_id = d.id\n-- your logic here\nORDER BY e.salary DESC;",
      queryColumns: ["name", "department", "salary"],
      queryRows: [
        ["Ava Chen", "Engineering", 142000],
        ["Marcus Webb", "Engineering", 138000],
        ["Priya Sharma", "Sales", 121500],
        ["Noah Fischer", "Design", 118000],
        ["Elena Vasquez", "Sales", 116000],
      ],
    },
    {
      id: "db-2",
      type: "database",
      sectionId: "database",
      number: 2,
      title: "Order Analytics",
      status: "unanswered",
      schema: "orders",
      difficulty: "Hard",
      estimatedMinutes: 15,
      points: 20,
      body: [
        "## Overview",
        "Return the **top 5 customers** by total order value in the last 30 days. Include customer name, total number of orders, and total value.",
      ].join("\n"),
      requirements: [
        "Return customer name, order count, total value",
        "Restrict to the last 30 days",
        "Aggregate with GROUP BY",
        "Sort by total value descending",
        "Limit to 5 rows",
      ],
      constraints: ["Only count orders with status = 'completed'."],
      dbTables: [
        {
          name: "customers",
          columns: [
            { name: "id", type: "INT", pk: true },
            { name: "name", type: "VARCHAR(120)" },
            { name: "email", type: "VARCHAR(160)" },
            { name: "created_at", type: "DATE" },
          ],
        },
        {
          name: "orders",
          columns: [
            { name: "id", type: "INT", pk: true },
            { name: "customer_id", type: "INT", fk: true },
            { name: "status", type: "VARCHAR(24)" },
            { name: "amount", type: "DECIMAL(10,2)" },
            { name: "placed_at", type: "DATE" },
          ],
        },
      ],
      codeStarter: "SELECT c.name, COUNT(o.id) AS orders, SUM(o.amount) AS total\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\n-- your logic here\nORDER BY total DESC\nLIMIT 5;",
      queryColumns: ["name", "orders", "total"],
      queryRows: [
        ["Olivia Grant", 12, 8420],
        ["Daniel Park", 9, 7310],
        ["Yuki Tanaka", 8, 6650],
        ["Aisha Khan", 7, 5990],
        ["Ravi Menon", 6, 5120],
      ],
    },
    {
      id: "db-3",
      type: "database",
      sectionId: "database",
      number: 3,
      title: "Recursive Category Tree",
      status: "unanswered",
      schema: "categories",
      difficulty: "Hard",
      estimatedMinutes: 18,
      points: 25,
      body: [
        "## Overview",
        "Write a **recursive CTE** to retrieve all subcategories of a given parent category, including the depth level of each node.",
      ].join("\n"),
      requirements: [
        "Use a recursive CTE",
        "Return category id, name, and depth",
        "Start from a given parent id",
        "Order by depth then name",
      ],
      constraints: ["A category's parent_id is NULL for root categories."],
      dbTables: [
        {
          name: "categories",
          columns: [
            { name: "id", type: "INT", pk: true },
            { name: "name", type: "VARCHAR(120)" },
            { name: "parent_id", type: "INT", fk: true, nullable: true },
          ],
        },
      ],
      codeStarter: "WITH RECURSIVE tree AS (\n  -- anchor member\n\n  -- recursive member\n)\nSELECT * FROM tree ORDER BY depth, name;",
      queryColumns: ["id", "name", "depth"],
      queryRows: [
        [10, "Electronics", 0],
        [21, "Laptops", 1],
        [22, "Phones", 1],
        [34, "Gaming Laptops", 2],
        [35, "Ultrabooks", 2],
      ],
    },
  ],
};

const FILL_BLANK_SECTION: AssessmentSection = {
  id: "fill-blank",
  type: "fill-blank",
  label: "Fill in the Blank",
  questionCount: 2,
  weightage: 10,
  questions: [
    {
      id: "fb-1",
      type: "fill-blank",
      sectionId: "fill-blank",
      number: 1,
      title: "JavaScript Concepts",
      body: "Complete the following statements about JavaScript:\n\n1. The `___` keyword is used to declare a block-scoped variable that cannot be reassigned.\n2. A `___` is a function that returns another function and has access to the outer function's variables.\n3. The `___` method creates a new array with all elements that pass a test implemented by the provided function.",
      status: "unanswered",
      blanks: [
        { id: "b1", label: "Keyword for immutable block-scoped variable" },
        { id: "b2", label: "Function concept with outer scope access" },
        { id: "b3", label: "Array method for filtering" },
      ],
    },
    {
      id: "fb-2",
      type: "fill-blank",
      sectionId: "fill-blank",
      number: 2,
      title: "SQL Fundamentals",
      body: "Complete the following SQL statements:\n\n1. The `___` clause is used to filter groups created by GROUP BY.\n2. A `___` JOIN returns all rows from the left table and matched rows from the right table.\n3. The `___` constraint ensures that all values in a column are different.",
      status: "unanswered",
      blanks: [
        { id: "b1", label: "Clause for filtering groups" },
        { id: "b2", label: "Type of join" },
        { id: "b3", label: "Constraint for uniqueness" },
      ],
    },
  ],
};

const DEBUG_SECTION: AssessmentSection = {
  id: "debug",
  type: "debug",
  label: "Debug Snippet",
  questionCount: 2,
  weightage: 10,
  questions: [
    {
      id: "debug-1",
      type: "debug",
      sectionId: "debug",
      number: 1,
      title: "Fix Array Flattening",
      body: "The following function is supposed to flatten a nested array but contains bugs. Find and fix them.",
      status: "unanswered",
      bugDescription: "The function should take a deeply nested array and return a flat array. Currently it throws a TypeError for certain inputs and doesn't handle all nesting levels.",
      buggyCode: "function flatten(arr) {\n  let result = [];\n  for (let i = 0; i <= arr.length; i++) {\n    if (Array.isArray(arr[i])) {\n      result.push(flatten(arr[i]));\n    } else {\n      result.push(arr[i]);\n    }\n  }\n  return result;\n}",
      language: "javascript",
      testCases: [
        { id: "tc1", input: "[1, [2, [3, 4]], 5]", expectedOutput: "[1, 2, 3, 4, 5]", visible: true },
        { id: "tc2", input: "[[1, 2], [3, [4, 5]]]", expectedOutput: "[1, 2, 3, 4, 5]", visible: true },
      ],
    },
    {
      id: "debug-2",
      type: "debug",
      sectionId: "debug",
      number: 2,
      title: "Fix Binary Search",
      body: "The binary search implementation below has logical errors. Fix it so it correctly returns the index of the target element, or -1 if not found.",
      status: "unanswered",
      bugDescription: "The function enters an infinite loop for certain inputs and returns incorrect indices for edge cases.",
      buggyCode: "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length;\n  while (left < right) {\n    let mid = (left + right) / 2;\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid;\n    } else {\n      right = mid;\n    }\n  }\n  return -1;\n}",
      language: "javascript",
      testCases: [
        { id: "tc1", input: "[1,3,5,7,9], 5", expectedOutput: "2", visible: true },
        { id: "tc2", input: "[1,3,5,7,9], 4", expectedOutput: "-1", visible: true },
      ],
    },
  ],
};

export const MOCK_ASSESSMENT: AssessmentData = {
  id: "assessment-001",
  title: "Data Analyst Technical Assessment",
  role: "Data Analyst",
  candidateName: "Irfan",
  duration: 60,
  totalQuestions: 18,
  expiresAt: "2026-08-15T23:59:59Z",
  skills: ["SQL", "Python", "Data Modeling", "REST APIs", "Problem Solving", "System Design"],
  sections: [
    MCQ_SECTION,
    CODING_SECTION,
    OPEN_ENDED_SECTION,
    COMPREHENSION_SECTION,
    DATABASE_SECTION,
    FILL_BLANK_SECTION,
    DEBUG_SECTION,
  ],
  guidelines: GUIDELINES,
};
