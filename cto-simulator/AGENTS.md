# CTO Simulator – Agent & Developer Documentation

This document describes the codebase so AI agents and developers can extend or modify the game without breaking existing behavior.

---

## 1. Project purpose

**CTO Simulator** is an interactive educational web game. The user plays as a CTO launching a startup and progresses through six levels that teach:

- Level 1: Project Planning (startup type, SMART goals, stakeholders, WBS)
- Level 2: Architecture (Monolithic, Microservices, Serverless)
- Level 3: Database Design (Relational vs NoSQL, indexing, normalization)
- Level 4: Git (merge conflicts, commands)
- Level 5: CI/CD (pipeline order)
- Level 6: Documentation (README, API docs)

Each level: **teach first** (briefing slides) → **then play** (decisions, XP, feedback). Progress is persisted in `localStorage`; no backend.

---

## 2. Tech stack and commands

| Tech | Use |
|------|-----|
| React 19 + TypeScript | UI |
| Vite 7 | Build and dev server |
| Tailwind CSS v4 | Styling (`@tailwindcss/vite`, `@import "tailwindcss"` in `src/index.css`) |
| React Router v6 | Routes: `/`, `/level/:id`, `/final` |
| Framer Motion | Animations (cards, layout transitions) |
| Zustand | Global game state + `persist` middleware (localStorage) |
| @dnd-kit (core, sortable, utilities) | Drag-and-drop (Level 1 WBS) |

**Commands**

- `npm install` – install dependencies  
- `npm run dev` – dev server at http://localhost:5173  
- `npm run build` – production build to `dist/`  
- `npm run preview` – serve `dist/` (after build)  

---

## 3. Source structure (what to edit)

```
cto-simulator/
├── src/
│   ├── App.tsx                 # Router, Route definitions, LevelRoute switch
│   ├── main.tsx
│   ├── index.css               # Tailwind import + CSS variables (--bg-primary, --accent-neon, etc.)
│   ├── types/
│   │   └── game.ts             # LevelId, GameState, LevelConfig, DEFAULT_LEVELS, INITIAL_HEALTH
│   ├── store/
│   │   └── gameStore.ts        # Zustand store: XP, health, levels, decisions, tooltipsEnabled; persist key: cto-simulator-game
│   ├── data/
│   │   ├── levels.ts           # LEVEL_ORDER, WBS correct order, STARTUP_TYPES, SMART_GOAL_OPTIONS, STAKEHOLDER_OPTIONS
│   │   ├── briefings.ts        # LEVEL1_BRIEFING … LEVEL6_BRIEFING (slides: title, body, tip). Use \n\n for paragraphs, \n for lines
│   │   └── glossary.ts         # GLOSSARY (keyword -> definition), GLOSSARY_KEYS_SORTED (for matching)
│   ├── components/
│   │   ├── GameLayout.tsx      # Shell: header (XP, level, health, Tooltips On/Off), Sidebar, Outlet
│   │   ├── Sidebar.tsx         # Level links + Summary + "Ctrl+Shift+R reset"
│   │   ├── XPBar.tsx
│   │   ├── LevelContainer.tsx  # Wrapper with title for level content
│   │   ├── ScenarioCard.tsx    # Card; title is ReactNode (can use textWithTooltips)
│   │   ├── DecisionButton.tsx  # label/description are ReactNode
│   │   ├── ResultPanel.tsx     # message, xpGained, variant, rememberTip; message/rememberTip run through textWithTooltips
│   │   ├── LevelBriefing.tsx   # Teach-first slides; levelId, slides, onStart; persists slide index in sessionStorage (cto-briefing-slide-{levelId})
│   │   ├── KeywordTooltip.tsx  # Click keyword to toggle tooltip (no hover); portal to body; close by re-clicking keyword or clicking elsewhere
│   │   ├── TextWithTooltips.tsx # textWithTooltips(str) -> ReactNode with glossary terms wrapped in KeywordTooltip
│   │   └── ResetKeyHandler.tsx  # Listens for Ctrl+Shift+R; resetGame(); navigate('/level/1')
│   ├── levels/
│   │   ├── Level1ProjectPlanning.tsx  # Full: briefing -> startup type -> SMART goal -> stakeholders -> WBS drag-drop; Next buttons; rememberTip per step
│   │   ├── Level2Architecture.tsx     # Briefing (4 slides) -> choose Monolith/Microservices/Serverless -> Complete level -> Next level
│   │   └── Level3Database.tsx … Level6Documentation.tsx  # Briefing + placeholder gameplay
│   └── pages/
│       ├── HomePage.tsx        # Landing; "Start game" -> /level/1
│       └── FinalScreen.tsx    # Total XP, decisions summary, "Startup Successfully Launched" if all 6 done; Restart / Back to levels
├── vite.config.ts              # React, Tailwind, SPA fallback (configureServer + configurePreviewServer) so refresh on /level/3 stays on level 3
├── index.html
├── README.md
└── AGENTS.md                   # This file
```

---

## 4. Data flow and key behaviors

- **Routing**  
  - `/` → HomePage  
  - `/level/:id` → GameLayout with LevelRoute; `id` 1–6 renders corresponding level component; invalid id → `<Navigate to="/level/1" />`.  
  - `/final` → GameLayout with FinalScreen.  
  - `GameLayout` reads `pathname`; sidebar and header use store’s `currentLevelId` (synced from URL in `LevelRoute`’s `useEffect` when `id` changes).

- **Game state (Zustand + persist)**  
  - `totalXp`, `currentLevelId`, `startupHealth`, `levels` (per-level unlocked/completed), `decisionsByLevel`, `tooltipsEnabled`.  
  - `completeLevel(levelId)` marks level completed, unlocks next, adds `completionXp`.  
  - `recordDecisions(levelId, obj)` merges into `decisionsByLevel[levelId]`.  
  - `resetGame()` restores initial state (keeps `tooltipsEnabled`).  
  - Persist key: `cto-simulator-game`.

- **Briefings**  
  - Each level can show `LevelBriefing` first (`showBriefing` state in level component).  
  - Slides from `src/data/briefings.ts`. Body: string with `\n\n` = new paragraph, `\n` = new line (rendered with `whitespace-pre-line`).  
  - Current slide index stored in `sessionStorage`: `cto-briefing-slide-{levelId}` so refresh keeps the same slide.

- **Keyword tooltips**  
  - Glossary in `src/data/glossary.ts` (lowercase keys; display keeps original casing).  
  - `textWithTooltips(text)` in `TextWithTooltips.tsx` splits text by glossary terms (whole words, case-insensitive) and wraps matches in `KeywordTooltip`.  
  - Tooltips: **click** keyword to toggle; **no** hover; close by clicking the keyword again or **clicking anywhere else** (no × close button).  
  - Header button "Tooltips On/Off" toggles `tooltipsEnabled` in store (persisted). When off, keywords keep accent color but no popup.

- **Reset**  
  - Ctrl+Shift+R anywhere: `resetGame()` + `navigate('/level/1')`.  
  - Sidebar shows "Ctrl+Shift+R reset".

- **Feedback and Next**  
  - Level 1 (and Level 2) show `ResultPanel` + "Next" / "Next level" / "Try again"; no auto-advance.  
  - `ResultPanel` supports `rememberTip`; both message and rememberTip are run through `textWithTooltips`.

---

## 5. How to extend (for agents)

### Add or edit a level

1. **Metadata**  
   - `src/types/game.ts`: extend `DEFAULT_LEVELS` if adding a new level (id, title, shortTitle, description, completionXp).  
   - `src/data/levels.ts`: add to `LEVEL_ORDER` if new level.

2. **Route**  
   - `App.tsx`: in `LevelRoute`, add a `case` for the level `id` and return the new level component.

3. **Level component**  
   - Under `src/levels/`, create e.g. `LevelNName.tsx`.  
   - Use `LevelBriefing` (with `levelId={N}`, `levelTitle`, `slides`, `onStart`) when `showBriefing` is true; then render gameplay with `LevelContainer`, `ScenarioCard`, `DecisionButton`, `ResultPanel`.  
   - Call `recordDecisions(N, { ... })`, `completeLevel(N)`, `addXp(...)`, `setStartupHealth(...)` as needed; navigate to next level or `/final` when done.

### Add or edit briefing content

- **File:** `src/data/briefings.ts`.  
- **Structure:** `LEVELn_BRIEFING: BriefingSlide[]` with `{ title, body, tip? }`.  
- **Body:** string; use `\n\n` for new paragraphs and `\n` for line breaks inside a paragraph (rendered with `whitespace-pre-line`).  
- **Tooltips:** Any word that exists in `src/data/glossary.ts` (key = lowercase) will be wrapped automatically when body is rendered via `textWithTooltips(slide.body)` in `LevelBriefing`.

### Add glossary terms (tooltips)

- **File:** `src/data/glossary.ts`.  
- Add an entry: `keyword: 'Short definition.'`.  
- Keys are lowercase; match is whole-word and case-insensitive.  
- `GLOSSARY_KEYS_SORTED` is derived from `Object.keys(GLOSSARY)` sorted by length descending (so longer phrases match first). No need to edit it by hand.

### Add “remember” tips

- In level components, when calling `setFeedback(...)`, include `rememberTip: 'One line to remember.'`.  
- Shown in `ResultPanel`; `rememberTip` is also run through `textWithTooltips`.

### Styling

- Use Tailwind classes.  
- Theme: CSS variables in `src/index.css` (e.g. `--bg-primary`, `--accent-neon`, `--text-muted`). Prefer these for consistency.

---

## 6. Conventions

- **No backend:** All state in Zustand + localStorage; optional sessionStorage for briefing slide.  
- **Level order:** Unlock by completing the previous level; `completeLevel(id)` unlocks `id + 1`.  
- **Comments:** In-code comments explain non-obvious logic (e.g. portal for tooltips, SPA fallback in vite.config).  
- **Accessibility:** Tooltip trigger has `role="button"`, `tabIndex={0}`, `aria-label`; tooltip has `role="tooltip"`.  
- **Build:** Run `npm run build` after changes; fix any TypeScript or lint errors before committing.

---

## 7. Deployment note

For production (e.g. static host), configure the server to serve `index.html` for all routes (SPA fallback). The Vite config already adds SPA fallback for `npm run dev` and `npm run preview`; other hosts need their own config (e.g. `_redirects` on Netlify, `vercel.json` on Vercel).

---

## 8. Quick reference: where is X?

| What | Where |
|------|--------|
| Level list and unlock logic | `src/store/gameStore.ts`, `src/types/game.ts` |
| Level content (options, correct answers) | `src/data/levels.ts` |
| Briefing slides (teach-first text) | `src/data/briefings.ts` |
| Tooltip definitions | `src/data/glossary.ts` |
| Route definitions | `src/App.tsx` |
| Header (XP, level, health, Tooltips toggle) | `src/components/GameLayout.tsx` |
| Sidebar and reset hint | `src/components/Sidebar.tsx` |
| Keyword tooltip behavior | `src/components/KeywordTooltip.tsx`, `TextWithTooltips.tsx` |
| SPA fallback (refresh stays on same URL) | `vite.config.ts` (plugin `spa-fallback`) |
