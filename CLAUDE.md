# AliciaApp — Las aventuras de Alicia en Chiloé

## What is this
Gamified math learning web app for Alicia (7yo, 2° básico, Chiloé). She explores Chiloé helping native animals by solving math exercises. Each animal has a story, personality, and progression tied to math difficulty. Characters speak in first person (no omniscient narrator) following the narrative engine.

## Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS 3
- **Build:** Vite
- **State:** Zustand (global game state, progress, settings)
- **Animations:** Framer Motion (page transitions, animal reactions, sendero progress)
- **Backend:** Supabase (Auth, Postgres, Edge Functions)
- **Voice:** Web Speech API (SpeechSynthesis) — Spanish es-CL
- **Deploy:** Vercel

## Architecture

### Directory structure
```
src/
  components/       # Reusable UI components
    ui/             # Base UI (Button, Card, Input, Modal)
    animals/        # Animal SVG components with animation states
    exercises/      # VerticalOperation, NumberPad, HintSystem
    gamification/   # PawPrints, Badge, Streak, ProgressTrail
    voice/          # VoiceProvider, SpeakButton
  pages/            # Route-level pages
    Home/           # El Bosque — chapter map
    Chapter/        # Sendero view for a chapter
    Exercise/       # Active exercise screen
    Result/         # Post-exercise animation
    Refuge/         # Animal collection gallery
    FactCard/       # "¿Sabías que...?" screen
    ParentDashboard/# PIN-protected parent view
  engine/           # Core game logic (NO UI)
    math/           # Exercise generators by type
    adaptive/       # Difficulty algorithm
    progression/    # Chapter/stage/unlock logic
  store/            # Zustand stores
    useGameStore.ts # Progress, current chapter, stage
    useSettingsStore.ts # Voice, difficulty, session config
  hooks/            # Custom React hooks
    useVoice.ts     # Web Speech API wrapper
    useExercise.ts  # Exercise state machine
    useTimer.ts     # Session timer
  data/             # Static game data
    chapters.ts     # Chapter definitions (animal, stages, math level)
    animals.ts      # Animal profiles, personality, facts
    messages.ts     # Voice lines (celebration, hints, intro)
  types/            # TypeScript types
    game.ts         # Exercise, Chapter, Stage, Progress types
    math.ts         # Operation, Difficulty, ExerciseResult
  lib/              # External service wrappers
    supabase.ts     # Supabase client
  styles/           # Global styles, Tailwind config
```

### Key patterns
- **Engine is pure logic.** `engine/` has zero React imports. It generates exercises, evaluates answers, and decides difficulty. Testable with plain unit tests.
- **Components are dumb.** They render props and call callbacks. Game logic lives in hooks that call engine functions.
- **Zustand for game state.** Progress, current chapter/stage, streaks, achievements — all in Zustand with persistence to localStorage (and sync to Supabase when online).
- **Each animal is a React component** with animation states: idle, walking, hiding, celebrating, worried. Controlled via props.

## Game design rules

### Math exercises
- Vertical format ALWAYS (like a notebook). Never horizontal.
- Input is digit-by-digit, right to left (unidades → decenas → centenas).
- Carry ("me llevo") shows visually as a small "1" above the next column.
- NEVER show the correct answer immediately. Use progressive hints (4 levels).
- Wrong answer = animal hides/worries but NEVER loses progress.
- 70% operational exercises / 30% thinking exercises (número misterioso, completa la operación, estimación).

### Progression
- 3 correct in a row → advance difficulty
- 2 wrong in a row → reduce difficulty or number range
- Each chapter = 5 stages on a visual trail
- Completing all stages = Guardian badge + animal goes to Refuge

### Voice
- Always Spanish (es-CL locale)
- Tone: warm, encouraging, never judgmental
- Read problems aloud automatically
- Celebrate effort, not just correctness

### Visual identity
- Chiloé forest palette: deep greens (#2D5016, #4A7C2E), earthy browns (#8B6914, #5C3D1A), river blues (#2E6B8A, #4A9CC7), sunset oranges (#D4722A, #E8943D)
- Typography: rounded, minimum 24px for numbers, 18px for text
- Watercolor/naturalistic but child-friendly illustration style
- Animals must look cute but respect real appearance
- Backgrounds: Valdivian forest, palafitos, rocky coast, wetlands

## Conventions
- All user-facing text in Spanish (Chilean)
- Code, comments, variable names, commits in English
- Component files: PascalCase (AnimalCard.tsx)
- Hooks: camelCase with use prefix (useExercise.ts)
- Engine functions: camelCase (generateExercise, evaluateAnswer)
- Types: PascalCase interfaces (Exercise, Chapter, Stage)
- Tailwind for all styling — no CSS modules or styled-components
- Framer Motion for all animations — no CSS animations for game elements

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run test` — Run tests
- `npm run lint` — Lint check

## Important notes
- This is for a 7-year-old. Everything must be intuitive, forgiving, and fun.
- Mobile-first responsive design. Touch targets minimum 44px.
- No punishment mechanics. Errors are learning opportunities.
- Session length: 10-15 minutes max. Respect attention span.
- Parent dashboard behind 4-digit PIN.
