/**
 * Glossary: keyword -> short definition for tooltips across the app.
 * Keys are lowercase for lookup; display uses the original word in text.
 *
 * Where tooltips appear (text run through textWithTooltips):
 * - Briefings: slide title, body, tip (LevelBriefing)
 * - ResultPanel: message, rememberTip (all levels)
 * - Level content: ScenarioCard titles, descriptions, option labels (Level1–Level6)
 * - Sidebar: mission brief per level (LEVEL_MISSION_BRIEFS)
 */

export const GLOSSARY: Record<string, string> = {
  stakeholder:
    'A person or group with an interest in the project or the power to affect it (e.g. investors, users, your team).',
  stakeholders:
    'People or groups with an interest in the project or the power to affect it (e.g. investors, users, your team).',
  saas: 'Software as a Service — software sold as a subscription (e.g. monthly). Focus: recurring revenue, usage metrics.',
  'e-commerce': 'Selling products online. Focus: conversion, inventory, payments, shipping.',
  'e‑commerce': 'Selling products online. Focus: conversion, inventory, payments, shipping.',
  marketplace:
    'A platform connecting two sides (e.g. buyers and sellers). Focus: trust, liquidity, both sides growing.',
  'dev tools': 'Developer tools: APIs, SDKs, and products for developers. Focus: docs, API design, developer experience.',
  'developer tools': 'APIs, SDKs, and products for developers. Focus: docs, API design, developer experience.',
  smart: 'SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound — so you can track and hit them.',
  wbs: 'Work Breakdown Structure — breaking the project into ordered phases (research → requirements → design → build → test → deploy).',
  'work breakdown structure':
    'WBS: breaking the project into ordered phases. Right order = research → requirements → design → build → test → deploy.',
  investors: 'People or organizations that fund the startup. They care about growth, metrics, and returns.',
  'end users': 'People who actually use your product. Their satisfaction drives retention and growth.',
  monolith: 'One single deployable application. Simple to start; can be harder to scale parts independently.',
  monolithic: 'Architecture with one single deployable application. Simple to start; scaling is often all-or-nothing.',
  microservices:
    'Architecture with many small, independent services. Each can scale and deploy separately; more operational complexity.',
  serverless:
    'Code runs in short-lived functions; you don’t manage servers. Pay per use; good for variable or bursty traffic.',
  architecture:
    'How the system is structured and deployed (e.g. one app vs many services vs serverless).',
  'ci/cd': 'Continuous Integration / Continuous Deployment — automated build, test, and deploy on every change.',
  readme: 'A file (usually README.md) that explains the project: how to set it up, run it, and use it.',
  api: 'Application Programming Interface — how other code or users call your service (endpoints, request/response format).',
  normalization:
    'Structuring database data to avoid duplication and keep it consistent (e.g. separate tables for related entities).',
  relational: 'Relational database: data in tables with rows and columns; links between tables (e.g. SQL, PostgreSQL).',
  nosql: 'NoSQL: databases that are not strictly table-based (e.g. document, key-value). Often used for flexible or very large data.',
  indexing:
    'Adding indexes on database columns so queries on those columns run faster (trade-off: slower writes).',
  'merge conflict':
    'When two branches change the same part of a file, Git can’t merge automatically; you must resolve it by hand.',
  kpi: 'Key Performance Indicator — a measurable value that shows how well you’re meeting a goal (e.g. revenue, signups).',
  kpis: 'Key Performance Indicators — measurable values that show how well you’re meeting goals (e.g. revenue, signups).',
  q1: 'First quarter of the year (January–March). Used for deadlines in goals.',
  q2: 'Second quarter of the year (April–June). Often used for deadlines in SMART goals.',
  q3: 'Third quarter of the year (July–September). Used for deadlines in goals.',
  q4: 'Fourth quarter of the year (October–December). Used for deadlines in goals.',
  deadline: 'A fixed date or time by which something must be done. SMART goals are time-bound with a clear deadline.',
  measurable: 'Something you can measure with a number or clear criteria (e.g. 20% growth, 1000 users). Needed for SMART goals.',
  qa: 'Quality Assurance — testing to make sure the product works before release.',
  scope: 'What is (and isn’t) included in the project. Clear scope helps the team and stakeholders stay aligned.',

  // Level 1 – Planning (user story, risk, review schedule)
  'user story':
    'Agile format: "As a [role], I want [something] so that [benefit]." Keeps requirements testable and scope clear.',
  'risk assessment': 'Identifying and evaluating project risks so you can plan mitigation. Often reviewed quarterly.',
  devtools: 'Developer tools (APIs, SDKs, products for developers). Same as "developer tools"; often written DevTools.',

  // Level 2 – Architecture (ACID, sagas, cold start, etc.)
  acid:
    'Atomicity, Consistency, Isolation, Durability — properties of relational transactions. One DB, one transaction boundary.',
  sagas: 'Pattern for distributed transactions across services: a sequence of local steps with compensation if something fails.',
  'eventual consistency':
    'In distributed systems, data may be temporarily inconsistent but will converge; used when strong consistency is costly.',
  'cold start': 'Delay when a serverless function or scaled-down service starts from zero; first request can be slower.',
  polyglot: 'Using multiple programming languages or tech stacks; microservices and serverless allow different runtimes per service.',
  observability: 'Understanding system behavior via logs, metrics, and traces — especially important in distributed and serverless systems.',
  deployment: 'Releasing built and tested code to an environment (e.g. production). Pipeline stages lead to deploy.',

  // Level 3 – Database (normal forms, transaction, schema)
  transaction:
    'A group of database operations that succeed or fail together (ACID). Relational DBs make transactions straightforward.',
  schema: 'Structure of data (tables, columns, or document shape). Relational = fixed schema; NoSQL often = flexible schema.',
  'horizontal scaling': 'Adding more machines (nodes) to handle load; NoSQL and distributed systems often scale horizontally.',
  '1nf': 'First normal form: atomic values, no repeating groups. Foundation for 2NF and 3NF.',
  '2nf': 'Second normal form: 1NF plus no partial dependencies on the primary key.',
  '3nf': 'Third normal form: 2NF plus no transitive dependencies.',
  bcnf: 'Boyce–Codd normal form: stricter than 3NF; every determinant is a candidate key.',
  'normal form': 'A level of database normalization (1NF, 2NF, 3NF, BCNF) that reduces redundancy and anomalies.',

  // Level 4 – Git
  git: 'Version control system for tracking code changes. Commands: clone, add, commit, push, pull, branch, merge.',
  commit: 'Save a snapshot of staged changes locally (e.g. git commit -m "message"). Commit before push.',
  push: 'Send your committed changes to the remote repo (e.g. GitHub). Run after git commit.',
  pull: 'Fetch and merge the latest changes from the remote into your local branch. Run to sync before you push.',
  branch: 'A parallel line of development. Create with git checkout -b <name>; merge when the feature is ready.',

  // Level 5 – CI/CD
  pipeline: 'Automated sequence of steps (e.g. build → test → security scan → deploy). CI/CD runs the pipeline on each change.',
  'security scan': 'Automated check for vulnerabilities (e.g. in dependencies or code). Often a stage before deploy in CI/CD.',
  'source control': 'Managing code changes with a VCS like Git. First stage in a typical pipeline (commit triggers the rest).',

  // Level 6 – Documentation
  'environment variables':
    'Config values (e.g. DATABASE_URL) set outside the code. READMEs should document which env vars the app needs.',
};

/** Sorted list of glossary keys by length descending, for matching longer phrases first. */
export const GLOSSARY_KEYS_SORTED = Object.keys(GLOSSARY).sort(
  (a, b) => b.length - a.length
);
