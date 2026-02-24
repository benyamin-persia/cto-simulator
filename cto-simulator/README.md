# CTO Simulator

An interactive educational web game that turns a software engineering curriculum into a playable strategy simulation. You play as a CTO launching a startup and progress through six levels: Project Planning, Architecture, Database Design, Git, CI/CD, and Documentation.

## How to run

```bash
cd cto-simulator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack

- **React** (latest) + TypeScript
- **Vite** for build and dev server
- **Tailwind CSS** (v4) for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Zustand** for game state (with localStorage persistence)
- **@dnd-kit** for drag-and-drop (Level 1 WBS)

No backend; progress is stored in `localStorage`.

## Project structure

```
src/
  components/     # GameLayout, XPBar, Sidebar, LevelContainer, ScenarioCard, DecisionButton, ResultPanel
  store/          # Zustand game store (XP, health, levels, decisions)
  data/           # Level config and level content (levels.ts)
  types/          # game.ts (LevelId, GameState, LevelConfig)
  levels/         # Level1ProjectPlanning (full), Level2–6 (scaffolded)
  pages/          # HomePage, FinalScreen
  App.tsx         # Router and route definitions
```

## Levels

1. **Project Planning** – Choose startup type, SMART goal, stakeholders, and order WBS tasks (drag and drop). Fully implemented.
2. **Architecture** – Choose Monolithic / Microservices / Serverless. Scaffolded.
3. **Database Design** – Relational vs NoSQL, indexing, normalization. Scaffolded.
4. **Git** – Merge conflict simulation and Git commands. Scaffolded.
5. **CI/CD** – Drag-and-drop pipeline builder. Scaffolded.
6. **Documentation** – README and API docs review. Scaffolded.

Complete Level 1 to unlock Level 2; progress is saved. The **Summary** screen shows total XP, decision summary, and a “Startup Successfully Launched” message when all six levels are completed.

## Adding new levels or content

- Level metadata: `src/types/game.ts` (`DEFAULT_LEVELS`) and `src/data/levels.ts`.
- New level component: add under `src/levels/` and register in `App.tsx` inside `LevelRoute`.

## Documentation for agents

See **[AGENTS.md](./AGENTS.md)** for detailed documentation aimed at AI agents and developers: full source structure, data flow, how to add levels/briefings/glossary terms, and conventions.
