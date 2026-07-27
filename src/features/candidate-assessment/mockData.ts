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
      title: "Reverse Linked List",
      body: "Given the head of a singly linked list, reverse the list, and return the reversed list.\n\n**Constraints:**\n- The number of nodes in the list is in the range [0, 5000]\n- -5000 ≤ Node.val ≤ 5000\n\n**Examples:**\n```\nInput: 1 → 2 → 3 → 4 → 5\nOutput: 5 → 4 → 3 → 2 → 1\n```",
      status: "unanswered",
      codeStarter: "function reverseList(head) {\n  // Your code here\n}",
      language: "javascript",
      testCases: [
        { id: "tc1", input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", visible: true },
        { id: "tc2", input: "[1,2]", expectedOutput: "[2,1]", visible: true },
        { id: "tc3", input: "[]", expectedOutput: "[]", visible: false },
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
      body: "Write a SQL query to find all employees who earn more than the average salary in their department. Return the employee name, department name, and salary.\n\n**Tables:**\n- `employees` (id, name, department_id, salary)\n- `departments` (id, name)",
      status: "unanswered",
      schema: "employees_departments",
      codeStarter: "SELECT \n  -- Your query here\nFROM employees e\nJOIN departments d ON e.department_id = d.id;",
    },
    {
      id: "db-2",
      type: "database",
      sectionId: "database",
      number: 2,
      title: "Order Analytics",
      body: "Write a query that returns the top 5 customers by total order value in the last 30 days. Include customer name, total orders, and total value.",
      status: "unanswered",
      schema: "orders",
      codeStarter: "-- Your query here",
    },
    {
      id: "db-3",
      type: "database",
      sectionId: "database",
      number: 3,
      title: "Recursive Category Tree",
      body: "Write a recursive CTE to retrieve all subcategories of a given parent category, including the depth level.",
      status: "unanswered",
      schema: "categories",
      codeStarter: "-- Your query here",
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
