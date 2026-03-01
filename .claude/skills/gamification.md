# Skill: Gamification System

## Description
Use this skill when building reward systems, progression mechanics, achievements, and motivational feedback. The gamification in AliciaApp is EMOTIONAL and PURPOSE-DRIVEN — not just points and badges. Every reward ties to helping an animal.

## Core systems

### 1. Huellas (Paw Prints) — Per-exercise reward
```typescript
interface HuellasResult {
  count: 1 | 2 | 3;
  reason: string;
}

function calculateHuellas(attempts: number): HuellasResult {
  if (attempts === 1) return { count: 3, reason: '¡Perfecto al primer intento!' };
  if (attempts === 2) return { count: 2, reason: '¡Muy bien, lo lograste!' };
  return { count: 1, reason: '¡Seguiste intentando, eso es ser valiente!' };
}
```
- Always award at least 1 huella (effort is always rewarded)
- Visual: animated paw prints stamping onto the screen (staggered, 0.3s each)
- Sound: soft stamp sound per huella
- Huellas accumulate per stage and chapter

### 2. Sendero (Trail) — Chapter progress
Each chapter has 5 stages. Each stage requires N exercises to complete.
```
Stage 1: 5 exercises (introduction, easy)
Stage 2: 7 exercises
Stage 3: 8 exercises
Stage 4: 8 exercises
Stage 5: 6 exercises (climax, slightly easier for narrative satisfaction)
```

Visual representation:
```
[Stage 1]---🐾---[Stage 2]---🐾---[Stage 3]---🐾---[Stage 4]---🐾---[Stage 5]
    🦌→                                                              (goal)
```
- Animal sprite walks along the path
- Path has themed environment details (trees, rocks, water)
- Completed stages glow/bloom
- Current stage pulses gently
- Locked stages are dimmed silhouettes

### 3. Insignias de Guardiana (Guardian Badges)
Awarded when completing a full chapter (all 5 stages).
```typescript
interface Badge {
  id: string;
  animalId: string;
  title: string;           // "Guardiana del Pudú"
  description: string;     // "Ayudaste a Pascual a encontrar a su mamá"
  unlockedAt: Date;
  illustration: string;    // SVG badge with animal
}
```
- Full-screen celebration animation on unlock
- Badge is a circular emblem with the animal inside
- Confetti + animal celebration + voice congratulation
- Badge appears in profile and Refugio

### 4. El Refugio (The Refuge) — Collection gallery
```
┌──────────────────────────┐
│      🏔️ El Refugio       │
│                          │
│  [🦌]  [🐦]  [🔒]       │
│ Pascual Berta  ???       │
│                          │
│  [🔒]  [🔒]  [🔒]       │
│  ???    ???    ???        │
└──────────────────────────┘
```
- Completed animals are colored, animated (idle loop), clickable
- Locked animals are gray silhouettes with "?"
- Clicking a completed animal shows: name, badge, fun facts unlocked, huellas earned
- The Refugio grows over time — Alicia builds her sanctuary

### 5. Datos Curiosos (Fun Facts)
Unlocked at stage completion within chapters.
```typescript
interface FunFact {
  id: string;
  chapterId: string;
  stageNumber: number;
  text: string;           // In simple Spanish for a 7yo
  category: 'behavior' | 'habitat' | 'conservation' | 'fun';
}
```
- Presented on a special "¿Sabías que...?" card
- Read aloud by voice system
- Collected in a "Cuaderno de Campo" (Field Notebook) subsection of Refugio
- Real facts about Chiloé wildlife

### 6. Racha (Streak)
```typescript
interface Streak {
  currentDays: number;
  longestStreak: number;
  lastPlayedDate: string;
}
```
- Counts consecutive days of completing at least 1 session
- Visual: animals gathering (more animals = longer streak)
- Day 1: One animal waves
- Day 3: Three animals together
- Day 7: All unlocked animals celebrate together
- Streak break is gentle: "¡Tus amigos te extrañaron!" (Your friends missed you!)
- NEVER punish or show negative emotion for streak breaks

### 7. Logros Especiales (Special Achievements)
```typescript
const ACHIEVEMENTS = [
  { id: 'no_fingers', title: 'Pensé sin dedos', condition: '5 correct without long pauses' },
  { id: 'five_streak', title: '5 seguidas', condition: '5 consecutive correct' },
  { id: 'ten_streak', title: '10 seguidas', condition: '10 consecutive correct' },
  { id: 'explorer', title: 'Exploradora', condition: 'Try all exercise types' },
  { id: 'persistent', title: 'Nunca me rindo', condition: 'Complete exercise after 3+ attempts' },
  { id: 'speedster', title: 'Rayo veloz', condition: '5 correct under 10s each' },
  { id: 'nature_lover', title: 'Amante de la naturaleza', condition: 'Read all fun facts in a chapter' },
];
```
- Achievement popup: slide in from top, animal holding the badge
- Achievemnt NEVER for speed over accuracy
- "Persistent" achievement is KEY — rewards effort over correctness

## Anti-patterns (DO NOT)
- Never show leaderboards or comparisons
- Never take away earned rewards
- Never use red/negative colors for wrong answers (use gentle amber)
- Never count down lives or hearts
- Never lock content due to poor performance
- Never show a "game over" screen
- Wrong answers = animal hides briefly, then encourages retry
- Time pressure only for optional speed challenges, NEVER for normal play
