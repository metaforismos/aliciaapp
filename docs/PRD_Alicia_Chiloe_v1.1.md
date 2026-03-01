# PRD: Las Aventuras de Alicia en Chiloé — v1.1

## Overview

Educational math game for children set on Chiloé Island, Chile. The player progresses through stages themed around Chiloé's geography and native ecosystems, solving math exercises to advance. v1.1 upgrades the UI layout, introduces a persistent bottom navigation bar, integrates culturally authentic visual assets, and adds audio controls.

---

## Target Platform

Web app (React). Mobile-first design (portrait, ~390x844 viewport). Future: Capacitor wrap for iOS/Android.

---

## Game Structure

### Narrative Frame
- **Title:** "Las aventuras de Alicia en Chiloé"
- **Stages (Etapas):** Each stage is a distinct Chiloé ecosystem/location (e.g., "El bosque oscuro", "El arroyo", "Los helechos", "El claro", "El reef")
- **Progression:** Linear. Each stage has N exercises (e.g., 3/5, shown as progress indicator). Completing all exercises unlocks the next stage.

### Stage Theming
Each stage MUST use native Chiloé flora/fauna as visual elements. The visual scene on the left side of the screen reflects the stage's ecosystem.

| Stage Name | Visual Elements | Native Species to Use |
|---|---|---|
| El bosque oscuro | Dense forest with native trees | Arrayanes (Luma apiculata), Coigües, Canelo |
| El arroyo | Stream/creek scene | Nalcas, ferns, water elements |
| Los helechos | Fern-dominated forest floor | Ampe (Lophosoria), Costilla de vaca |
| El claro | Forest clearing | Chilote wildlife: Pudú, Monito del monte |
| El reef (or coastal) | Rocky coast/tide pools | Chiloé coastal elements |

**Fauna:** The Pudú (small native deer) serves as the companion character visible in the scene. Other native animals (Monito del monte, Quetru, Zarapito) can appear contextually per stage.

---

## Screen Layout (v1.1)

### Header Bar
- **Left:** Stage title in bold italic (e.g., *Las aventuras de Alicia en Chiloé*) + subtitle (e.g., "Etapa 1: El bosque oscuro")
- **Right:** "Parents" button (opens parental controls/settings)

### Main Content Area — Split Layout
- **Left panel (~45% width):** Stage illustration scene. Animated or static scene with native trees, plants, and fauna per the stage theme. The Pudú companion appears here. Scene elements can animate subtly (e.g., leaves swaying, pudú walking).
- **Right panel (~55% width):** Exercise area.

### Exercise Area (Right Panel)
1. **Dialog Box (top):** Text area for clues, instructions, or exercise context sentences. Shows contextual hints or word problems. Example: "¿Cuántos arrayanes hay en total?"
2. **Math Problem Display:** Vertical arithmetic layout:
   - Numbers displayed large, clear, monospaced
   - Operator (+, -, ×) left-aligned
   - Horizontal line separator
   - Answer input boxes below the line (one box per digit of the answer)
   - Answer boxes highlight active input position
3. **Number Pad:**
   - 3×3 grid: digits 1-9
   - Bottom row: Backspace (⌫), 0, Confirm (✓ green)
   - Confirm button is green with white checkmark
   - Clear visual feedback on tap (press state)

### Bottom Navigation Bar (NEW in v1.1)
Persistent bar at the bottom of the screen with 5 buttons, evenly spaced:

| Button | Icon | Label | Action |
|---|---|---|---|
| Sound | 🔊/🔇 | "Sound off/on" | Toggle background music and SFX on/off. Icon toggles between speaker and muted speaker. |
| Mission | 🎯 | "Mission button" | Shows current stage objectives/mission description in a modal overlay |
| Clue | 💡 | "Clue button" | Provides a hint for the current exercise. May cost a "star" or have limited uses per exercise. |
| Rewards | 🏆 | "Rewards button" | Opens rewards/achievements panel showing collected items, stars, badges |
| Exit | 🚪 | "Exit button" | Exits current stage. Prompts confirmation ("¿Seguro que quieres salir?") before returning to stage select |

**Styling:** Warm earth-tone background (matching Chiloé palette), rounded buttons, clear labels below icons. Must be thumb-reachable on mobile.

---

## Functional Requirements

### FR-1: Audio System
- Background music per stage (loopable ambient tracks — forest sounds, water, birds)
- SFX: correct answer (positive chime), wrong answer (gentle error), button taps, stage complete fanfare
- Sound toggle in bottom bar persists across exercises within a session
- Default state: Sound ON
- Music should crossfade between stages

### FR-2: Exercise Engine
- Supports vertical arithmetic: addition, subtraction (v1.1 scope)
- Configurable operand ranges per stage/difficulty
- Answer input: digit-by-digit via number pad, filling answer boxes left to right (or right to left for carry-based problems)
- Validation on confirm (✓): correct → celebration animation + advance; incorrect → gentle shake + retry
- Progress indicator: "3/5" style counter per stage
- Carry/borrow support for multi-digit problems

### FR-3: Stage Scene Rendering
- Each stage loads a scene composition from assets specific to that stage's theme
- Scene uses layered illustrations (background, midground trees/plants, foreground character)
- The Pudú character reacts to correct/incorrect answers (happy jump, sad look)
- Trees and plants should be identifiable as Chiloé native species (arrayanes with characteristic orange bark, canelo with broad leaves, etc.)

### FR-4: Navigation & Progression
- Stage select screen (map or list) showing locked/unlocked stages
- Linear unlock: complete Stage N to unlock Stage N+1
- Progress saved to localStorage (or backend if available)
- Parents button: opens settings (sound, reset progress, language)

### FR-5: Clue System
- Each exercise can have 1-2 associated hints
- Hints show in the Dialog Box area
- Pressing Clue button reveals next available hint
- Visual indicator if hints are available (💡 with badge count)

### FR-6: Rewards System
- Stars earned per exercise (3 stars max based on attempts: 1st try = 3★, 2nd = 2★, 3rd+ = 1★)
- Stage completion badge
- Rewards panel shows aggregate stars and badges per stage

### FR-7: Bottom Bar State Management
- Bottom bar is always visible during gameplay
- Sound button shows current state (on/off icon)
- Clue button shows available hint count or grays out if none left
- Exit always prompts confirmation

---

## Visual Design Specifications

### Color Palette (Chiloé-inspired)
- **Primary:** Forest green (#2D5016)
- **Secondary:** Warm brown (#8B6914)
- **Accent:** Orange (#E88B2E) — for progress bars, active states
- **Background:** Warm cream (#FFF8F0)
- **Correct:** Green (#4CAF50)
- **Error:** Soft red (#E57373)
- **Bottom bar bg:** Dark earth (#3E2C1A)

### Typography
- **Title:** Bold italic serif or rounded sans-serif
- **Exercise numbers:** Large, monospaced or tabular figures, minimum 48px
- **UI labels:** Clean sans-serif, 12-14px
- **Dialog box text:** Friendly rounded font, 16-18px

### Art Style
- Illustrated, warm, slightly stylized (not hyper-realistic)
- Consistent with Chilean children's book illustration style
- Arrayán trees: distinctive smooth orange/cinnamon bark with green canopy
- Pudú: cute, proportionally accurate but child-friendly

---

## Data Model (Simplified)

```typescript
interface Stage {
  id: string;
  name: string;                    // "El bosque oscuro"
  theme: ChiloeTheme;             // enum: BOSQUE_OSCURO, ARROYO, HELECHOS, CLARO, REEF
  exercises: Exercise[];
  sceneAssets: SceneConfig;
  backgroundMusic: string;         // audio file path
}

interface Exercise {
  id: string;
  type: 'addition' | 'subtraction';
  operand1: number;
  operand2: number;
  answer: number;
  hints: string[];                 // ["Cuenta los arrayanes del lado izquierdo"]
  contextText?: string;            // dialog box text
}

interface UserProgress {
  currentStage: string;
  stagesCompleted: Record<string, StageResult>;
  soundEnabled: boolean;
}

interface StageResult {
  completed: boolean;
  stars: number;                   // total stars earned
  exerciseResults: { exerciseId: string; attempts: number; stars: number }[];
}
```

---

## Out of Scope (v1.1)
- Multiplication/division exercises
- User accounts/authentication
- Backend persistence (localStorage only)
- Multiple languages (Spanish only)
- Adaptive difficulty
- Non-math subjects

---

## Success Metrics
- Child can complete a stage without adult help
- Average time per exercise: < 60 seconds
- Sound toggle works without reloading
- All native Chiloé species are visually distinguishable and named correctly

---

## Assets Required
- Illustrated backgrounds per stage (5 stages)
- Arrayán tree illustrations (multiple sizes/angles)
- Other native tree illustrations: Coigüe, Canelo, Luma
- Pudú character sprite sheet (idle, happy, sad)
- Native fauna illustrations: Monito del monte, Quetru
- Bottom bar icons (5)
- Audio: 5 ambient tracks + SFX set
- Number pad component (reusable)

---

## Implementation Notes for Claude
- Build as a single-page React app
- Use Tailwind for styling
- Component structure: `<GameShell>` → `<Header>`, `<StageScene>`, `<ExercisePanel>`, `<BottomBar>`
- Exercise generation can be algorithmic (random within configured ranges per stage)
- For v1.1 prototype, placeholder colored rectangles are acceptable for scene illustrations; focus on layout, interaction, and logic correctness
- Number pad should handle multi-digit answers with cursor position management
- Sound system: use Howler.js or native Web Audio API
