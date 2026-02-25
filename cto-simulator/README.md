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
- **Zustand** for game state (with localStorage persistence per user)
- **Firebase Auth** for sign-in (same account works from any device)
- **Firestore** for syncing game progress (XP, levels) across devices
- **@dnd-kit** for drag-and-drop (Level 1 WBS)

Progress is stored in **Firestore** when you're logged in (same on every device) and in localStorage as cache.

## Firebase setup (required for login and progress sync)

1. **Enable Email/Password:** Run `npm run firebase:open-auth` (opens Firebase Console). Click **Email/Password** → **Enable** → **Save**.
2. **Create Firestore database:** Firebase Console → **Build** → **Firestore Database** → **Create database** → choose a location → **Start in test mode** (or production with rules below). This lets the app save/load your progress across devices.
3. **Optional – secure Firestore rules:** In Firestore → **Rules**, use: `allow read, write: if request.auth != null && request.path[1] == request.auth.uid;` so users can only read/write their own `users/{uid}` document.
4. **Local:** `.env` with `VITE_FIREBASE_*` is already set (see `.env.example`). Restart dev server after editing.
5. **Vercel (production):** Run `npm run vercel:env` and paste each printed line into Vercel → Project → Settings → Environment Variables. Then redeploy.

Sign up and log in with email/password; your progress (XP, levels) syncs to any device.

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

## For learners: English → Persian dictionary

A comprehensive **English → Persian** dictionary of hard and medium-hard terms and phrases from the codebase is available for study or translation:

- **Markdown (readable):** [docs/EN_FA_DICTIONARY.md](./docs/EN_FA_DICTIONARY.md) — tables of terms, acronyms, phrases, and UI labels with Persian equivalents.
- **TypeScript (programmatic):** `src/data/enFaDictionary.ts` — exports `EN_FA_HARD`, `EN_FA_MEDIUM_HARD`, `EN_FA_PHRASES`, `EN_FA_UI_LABELS`, `EN_FA_DICTIONARY`, and `translateToPersian(english)` for use in the app (e.g. i18n or Persian tooltips).
