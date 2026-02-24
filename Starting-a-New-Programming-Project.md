# 📘 Starting a New Programming Project

**A complete book: project setup, design, tools, and learning path**

---

## 🎨 How to read this document

| Meaning | How it looks in the text |
|--------|---------------------------|
| <span style="color:#2563eb">**Key concept**</span> | <span style="color:#2563eb">Blue — important terms and ideas</span> |
| <span style="color:#059669">**Tip / Do this**</span> | <span style="color:#059669">Green — recommendations and success tips</span> |
| <span style="color:#d97706">**Important / Warning**</span> | <span style="color:#d97706">Orange — pay attention</span> |
| <span style="color:#7c3aed">**Category / Label**</span> | <span style="color:#7c3aed">Purple — section or type</span> |
| <span style="color:#dc2626">**Avoid / Critical**</span> | <span style="color:#dc2626">Red — don’t do this or critical note</span> |

> **Preview tip:** Open this file in **VS Code** or **Cursor** and use **Markdown Preview** (e.g. `Ctrl+Shift+V`) to see the colors and formatting. The table above shows the color legend.
>
> **Expandable sections:** Each chapter below is **clickable** — click the ▶ heading to expand or collapse that section. View in **Markdown Preview** for expand/collapse to work.

---

## 📑 Table of Contents

1. [Project Planning Phase](#1-project-planning-phase)
2. [System Design Fundamentals](#2-system-design-fundamentals)
3. [Development Environment Setup](#3-development-environment-setup)
4. [Project Management Tools](#4-project-management-tools)
5. [DevOps and CI/CD Pipeline](#5-devops-and-cicd-pipeline)
6. [Documentation](#6-documentation)
7. [Practical Exercises](#7-practical-exercises)
8. [Learning Resources & Core Java](#8-learning-resources--core-java)

---

## Understanding Project Setup

<span style="color:#2563eb">**Setting up a project properly**</span> is crucial for its long-term success. This guide walks you through all essential aspects of project initialization.

---

<details open>
<summary><strong>▶ 1. Project Planning Phase</strong></summary>
<div style="margin-left: 1.5em;">

## 1. Project Planning Phase

### 📌 Comprehensive Guide to Project Planning Phase

#### 1.1 <span style="color:#7c3aed">Requirements Analysis</span> Deep Dive

- Stakeholder Interview Process
- Business Process Analysis
- Market Analysis Techniques

#### 1.2 <span style="color:#7c3aed">SMART Objectives</span> Development Process

- Step-by-Step Objective Creation

#### 1.3 <span style="color:#7c3aed">Stakeholder Management</span> Framework

- Stakeholder Analysis Matrix
- Engagement Strategy Development

#### 1.4 <span style="color:#7c3aed">Timeline Development</span> Methodology

- Work Breakdown Structure (WBS)
- Critical Path Analysis

#### 1.5 <span style="color:#7c3aed">Resource Estimation</span> Framework

- Human Resources Planning
- Technical Resource Planning
- Financial Resource Planning

#### 1.6 <span style="color:#7c3aed">Risk Assessment</span> Framework

- Risk Identification Methods
- Risk Analysis Process

#### 1.7 <span style="color:#7c3aed">Implementation Tools</span>

- Recommended Tool Categories

**📅 Regular Review Schedule**

| When | What to review |
|------|----------------|
| **Monthly** | Timeline and resources |
| **Quarterly** | Risk assessment |
| **Semi-annual** | Business needs alignment |

> <span style="color:#059669">**✅ Success Tip:**</span> Customize this framework to your organization’s needs and keep documentation consistent throughout the project lifecycle.

</div>
</details>

---

<details>
<summary><strong>▶ 2. System Design Fundamentals</strong></summary>
<div style="margin-left: 1.5em;">

## 2. System Design Fundamentals

### 📌 System Design: A Comprehensive Guide

#### 2.1 <span style="color:#2563eb">Architecture Patterns</span>

Architecture patterns are the <span style="color:#2563eb">**foundational structure**</span> of software systems. Understanding them helps you choose the right design for your project.

<details>
<summary>▸ Monolithic Architecture</summary>
<div style="margin-left: 1em;">

##### <span style="color:#7c3aed">Monolithic Architecture</span>

A <span style="color:#2563eb">traditional unified model</span>: all components are in one application, interconnected and interdependent.

**Key characteristics**

| Aspect | Description |
|--------|-------------|
| <span style="color:#2563eb">Single Codebase</span> | All functionality in one codebase |
| <span style="color:#2563eb">Shared Database</span> | One database for all operations |
| <span style="color:#2563eb">Single Deployment Unit</span> | Entire app deployed as one unit |

**✅ Advantages**

- Simple development and debugging
- Straightforward end-to-end testing
- Fast performance (in-process calls)
- Simple deployment

**⚠️ Disadvantages**

- <span style="color:#d97706">Scaling challenges</span> — must scale the whole app even if only one part needs it
- <span style="color:#d97706">Technology lock-in</span> — hard to adopt new tech
- <span style="color:#d97706">Single point of failure</span>

</div>
</details>

<details>
<summary>▸ Microservices Architecture</summary>
<div style="margin-left: 1em;">

##### <span style="color:#7c3aed">Microservices Architecture</span>

Application is a <span style="color:#2563eb">collection of loosely coupled services</span>, each implementing a business capability.

**Key characteristics**

| Aspect | Description |
|--------|-------------|
| <span style="color:#2563eb">Service Independence</span> | Develop, deploy, scale each service separately |
| <span style="color:#2563eb">Distributed Computing</span> | Services talk over the network |
| <span style="color:#2563eb">Database per Service</span> | Each service has its own database |

**✅ Advantages**

- Independent scaling per service
- Different technologies per service
- Fault isolation (one service failing doesn’t take down others)
- Teams can work independently

**⚠️ Challenges**

- <span style="color:#d97706">Distributed complexity</span> — network, data consistency
- <span style="color:#d97706">More operations</span> — deployment, monitoring
- <span style="color:#d97706">Harder integration testing</span>

</div>
</details>

<details>
<summary>▸ Serverless Architecture</summary>
<div style="margin-left: 1em;">

##### <span style="color:#7c3aed">Serverless Architecture</span>

Build and run applications <span style="color:#2563eb">without managing servers</span> yourself.

**Key components**

| Component | Meaning |
|----------|--------|
| <span style="color:#2563eb">FaaS</span> (Function as a Service) | Code runs in stateless containers |
| <span style="color:#2563eb">BaaS</span> (Backend as a Service) | Third-party services for server logic |
| <span style="color:#2563eb">Event-driven</span> | Functions run when events happen |

**✅ Advantages**

- Pay only for compute time used
- Auto-scaling
- No server management
- Quick updates per function

**⚠️ Considerations**

- <span style="color:#d97706">Cold starts</span> — first request can be slower
- <span style="color:#d97706">Vendor lock-in</span>
- <span style="color:#d97706">Resource limits</span> — time and memory caps

</div>
</details>

<details>
<summary>▸ Database Design</summary>
<div style="margin-left: 1em;">

#### 2.2 <span style="color:#2563eb">Database Design</span>

Good database design is crucial for <span style="color:#2563eb">performance, scalability, and maintenance</span>.

##### Relational vs NoSQL

| | <span style="color:#7c3aed">Relational</span> | <span style="color:#7c3aed">NoSQL</span> |
|---|-----------------------------------------------|------------------------------------------|
| **Structure** | Tables, rows, columns | Document, key-value, column-family, graph |
| **Properties** | ACID (Atomicity, Consistency, Isolation, Durability) | Flexible schema, horizontal scaling |
| **Use cases** | Complex queries, transactions, structured data | Big data, real-time, unstructured data |
| **Examples** | PostgreSQL, MySQL, Oracle | MongoDB, Redis, Cassandra |

##### Data modeling

- Entity Relationship Diagrams (ERD)
- Cardinality and relationships
- Schema design patterns
- Data access patterns

##### Normalization (normal forms)

| Form | Rule |
|------|------|
| **1NF** | Atomic values, no repeating groups |
| **2NF** | 1NF + no partial dependencies |
| **3NF** | 2NF + no transitive dependencies |
| **BCNF** | Stricter 3NF |

##### Indexing and optimization

- **Index types:** Single-column, composite, unique, partial
- **✅ Do:** Index often-queried columns; monitor usage; maintain indexes
- **⚠️ Consider:** Impact on write performance

> <span style="color:#059669">**Remember:**</span> System design is not one-size-fits-all. Consider your requirements, constraints, and trade-offs. Monitor and optimize your architecture and database over time.

</div>
</details>

</div>
</details>

---

<details>
<summary><strong>▶ 3. Development Environment Setup</strong></summary>
<div style="margin-left: 1.5em;">

## 3. Development Environment Setup

### <span style="color:#2563eb">Version Control: Git</span>

**What Git does:** Tracks changes, keeps history, and lets you collaborate. Each <span style="color:#2563eb">**commit**</span> is a snapshot you can return to.

**📥 Install Git (Windows)**

- Download from [git-scm.com](https://git-scm.com/download/win) and run the installer.
- In a terminal, run: `git --version` to confirm.

**⚙️ One-time configuration**

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**📋 Essential Git commands**

| Command | Purpose |
|--------|---------|
| `git clone <url>` | Download a repo to your computer |
| `git status` | See changed, new, or staged files |
| `git add <file>` or `git add .` | Stage changes for commit |
| `git commit -m "message"` | Save a snapshot locally |
| `git push` | Send commits to remote (e.g. GitHub) |
| `git pull` | Get latest from remote |
| `git branch` | List or create branches |
| `git checkout -b my-branch` | Create and switch to a branch |
| `git log --oneline` | Short commit history |

**✅ Typical workflow**

1. **Clone:** `git clone https://github.com/owner/repo.git`
2. Edit files.
3. **Stage:** `git add .` or `git add path/to/file`
4. **Commit:** `git commit -m "Describe what you did"`
5. **Push:** `git push origin main` (if you have permission)

> <span style="color:#d97706">**⚠️ Windows — long paths:**</span> If you see “path too long” errors, run once:  
> `git config --global core.longpaths true`

---

### <span style="color:#2563eb">IDE Configuration</span>

**Choose an IDE**

- **Cursor / VS Code** — Lightweight; add extensions (Java, Git, Markdown).
- **IntelliJ IDEA** — Strong for Java; Community Edition is free.

**✅ Recommended setup**

1. Install IDE and language support (e.g. Java Extension Pack or JDK).
2. Set JDK (e.g. JDK 17 or 21) in `JAVA_HOME` or IDE settings.
3. Use built-in Git (Source Control panel) for commit and push.
4. Use a clear layout (e.g. `src/main/java`, `src/test/java` for Maven).

**Environment variables**

- List variables your app needs (e.g. `DATABASE_URL`, `API_KEY`).
- Use a `.env` file locally; add `.env` to `.gitignore`.
- Document required variables in the README.

</div>
</details>

---

<details>
<summary><strong>▶ 4. Project Management Tools</strong></summary>
<div style="margin-left: 1.5em;">

## 4. Project Management Tools

### <span style="color:#2563eb">Jira</span>

**What it is:** Tool for tracking tasks, bugs, and projects. Work is organized in <span style="color:#7c3aed">projects</span>, <span style="color:#7c3aed">issues</span> (stories/tasks/bugs), and <span style="color:#7c3aed">boards</span>.

**Core concepts**

| Concept | Meaning |
|---------|--------|
| **Project** | Container for all issues (e.g. “Website Redesign”) |
| **Issue types** | Epic, Story, Task, Bug, etc. |
| **Board** | To Do → In Progress → Done (Kanban or Scrum) |
| **Sprint** | Time-boxed iteration (e.g. 2 weeks) with a goal |

**✅ Getting started**

1. Create or join a project.
2. Add issues to the backlog.
3. Plan a sprint (move issues from backlog to sprint).
4. Move issues across columns as work happens.
5. Close sprint and run a short retrospective.

> <span style="color:#059669">**Tip:**</span> Write clear titles and descriptions; use labels; link related issues; keep backlog ordered by priority.

---

### <span style="color:#2563eb">Agile Methodologies</span>

**Agile** = delivering value in <span style="color:#2563eb">small, frequent increments</span> with feedback and adaptation.

**<span style="color:#7c3aed">Scrum</span>**

| | |
|---|--|
| **Roles** | Product Owner, Scrum Master, Development Team |
| **Artifacts** | Product Backlog, Sprint Backlog, Increment |
| **Ceremonies** | Sprint Planning, Daily Standup, Sprint Review, Retrospective |
| **Sprint length** | Often 1–2 weeks |

**<span style="color:#7c3aed">Kanban</span>**

- Focus on **flow** and **limit WIP** (work in progress).
- Board: To Do, In Progress, Review, Done.
- No fixed sprints; pull work when there is capacity.
- Good when work is ongoing or uneven.

**User stories:** *“As a [user], I want [something] so that [benefit].”* Acceptance criteria define “done.”

</div>
</details>

---

<details>
<summary><strong>▶ 5. DevOps and CI/CD Pipeline</strong></summary>
<div style="margin-left: 1.5em;">

## 5. DevOps and CI/CD Pipeline

### 📌 Why We Need CI/CD

In modern development, CI/CD pipelines give you:

**✅ Faster time to market**

- Automated build and deployment
- Fast feedback on changes
- Parallel testing
- Consistent releases

**✅ Quality**

- Automated testing catches bugs early
- Consistent code quality checks
- Fewer human errors in deployment
- Security scanning

**✅ Cost efficiency**

- Less manual testing and deployment
- Faster bug detection and fixes
- Better use of resources

---

### 📋 Core components of a CI/CD pipeline

| # | Component | Examples |
|---|-----------|----------|
| 1 | Source Control (SCM) | Git, GitHub |
| 2 | Build & package tools | Maven, Gradle (Java) |
| 3 | Code quality & testing | Static analysis, coverage, JUnit |
| 4 | Security scanning | SAST, dependency check |
| 5 | Containers & orchestration | Docker, Kubernetes |
| 6 | Monitoring | Logs, metrics, alerts |
| 7 | Performance testing | Load tests |

**✅ Best practices**

- Thoughtful pipeline design
- Quality gates (e.g. tests must pass before deploy)
- Treat the pipeline as a product — maintain and improve it

> <span style="color:#d97706">**Important:**</span> Review and update pipeline components regularly so they match your team’s needs and industry practice.

</div>
</details>

---

<details>
<summary><strong>▶ 6. Documentation</strong></summary>
<div style="margin-left: 1.5em;">

## 6. Documentation

### 📌 Technical documentation

**System architecture**

- High-level: components, relationships, data flow, tech stack, infrastructure, security
- Per component: responsibilities, integrations, dependencies, configuration

**API documentation**

- Overview: auth, rate limits, base URLs, versioning
- Per endpoint: HTTP method, request/response, parameters, errors, examples

**Setup guides**

- Dev environment: required software, env vars, dependencies, local config
- Deployment: build steps, deployment workflow, configuration, infrastructure

**Troubleshooting**

- Common issues and fixes
- Error messages and debugging
- Monitoring, logs, backup, security response

---

### 📌 Code documentation

**Inline comments**

- Single-line for brief notes
- Block comments for complex logic
- `TODO` for future work
- `WARNING` for risks

**Function documentation**

- Purpose and behavior
- Parameters and types
- Return value and exceptions
- Usage examples

**README**

- Project overview and purpose
- Installation and configuration
- Usage examples
- Contributing and license

**Changelog**

- Semantic versioning (MAJOR.MINOR.PATCH)
- Release date, new features, bug fixes, breaking changes

> <span style="color:#059669">**Remember:**</span> Documentation is a living artifact. Keep it updated and review it regularly so it stays accurate and useful.

</div>
</details>

---

<details>
<summary><strong>▶ 7. Practical Exercises</strong></summary>
<div style="margin-left: 1.5em;">

## 7. Practical Exercises

- Start with a sample project
- Build a simple web application
- Set up a CI/CD pipeline
- Add automated testing
- Write and maintain documentation

</div>
</details>

---

<details>
<summary><strong>▶ 8. Learning Resources & Core Java</strong></summary>
<div style="margin-left: 1.5em;">

## 8. Learning Resources & Core Java

### 📌 Core Java learning path

**Fundamentals**

- Variables, types, operators, control flow (if/else, loops)
- Methods, parameters, return values
- Arrays and basic I/O

**OOP**

- Classes and objects; encapsulation (private fields, getters/setters)
- Inheritance and polymorphism; abstract classes and interfaces
- Composition vs inheritance

**Core APIs**

- **Collections:** List, Set, Map — when to use which
- **Exceptions:** try/catch/finally; checked vs unchecked; custom exceptions
- **File I/O:** Reading/writing files; try-with-resources
- **JDBC:** Connect to a database; queries; transactions

**Design & quality**

- **SOLID:** Single responsibility, Open/closed, Liskov, Interface segregation, Dependency inversion
- **Design patterns:** e.g. Singleton, Factory, Observer, Strategy
- **Unit testing:** JUnit; writing and running tests

**Modern Java (8+)**

- Lambdas and functional interfaces
- Streams: filter, map, reduce, collect
- Optional for null safety

**📚 Recommended books**

- *Effective Java* (Joshua Bloch) — best practices
- *Head First Java* — beginner-friendly
- *Core Java* (Cay Horstmann) — reference

**🌐 Online**

- [Oracle Java tutorials](https://docs.oracle.com/javase/tutorial/)
- Practice: LeetCode, HackerRank, or project-based repos (e.g. EVAITCS curriculum)

</div>
</details>

---

## Reminders

> <span style="color:#059669">**✅ Remember:**</span> A strong foundation in project setup saves time and reduces technical debt. Understand each part before moving on.

> <span style="color:#059669">**💡 Pro tip:**</span> Create a template or checklist from this guide for your future projects.

---

## 📎 All original Notion links

| Topic | Link |
|-------|------|
| Starting a New Programming Project | https://watery-whale-92f.notion.site/Starting-a-New-Programming-Project-1c0408cc99df80589669f95c0ad5abb0?pvs=143 |
| Project Planning Phase | https://watery-whale-92f.notion.site/Project-Planning-Phase-1c0408cc99df80f7a171f090a901ebbd?pvs=25 |
| System Design Fundamentals | https://watery-whale-92f.notion.site/System-Design-Fundamentals-1c0408cc99df807a89a0e0cba073db88?pvs=25 |
| Development Environment Setup | https://watery-whale-92f.notion.site/Development-Environment-Setup-1c0408cc99df8004a326ed71143f5cd0?pvs=25 |
| Project Management Tools | https://watery-whale-92f.notion.site/Project-Management-Tools-1c0408cc99df80a7abcac61a69d7afce?pvs=25 |
| CI/CD Pipeline | https://watery-whale-92f.notion.site/CI-CD-Pipeline-1c0408cc99df80609b3fcab8c3c01fe9?pvs=25 |
| Documentation | https://watery-whale-92f.notion.site/Documentation-1c0408cc99df80b6b0c3cf29b24fb702?pvs=25 |
| Core Java | https://watery-whale-92f.notion.site/Core-Java-184408cc99df8031a47df8ca2cba0270?pvs=25 |
