# Skill: Game Screen Builder

## Description
Use this skill when creating new game screens, levels, or interactive pages for AliciaApp. Every screen must feel like a game — animated, responsive to touch, with animal characters reacting to player actions.

## Rules

### Screen structure
Every game screen follows this pattern:
```tsx
// 1. Full-screen container with themed background
// 2. Animal character with reactive animations (idle → action → celebrate/worry)
// 3. Interactive game area (exercise, choice, exploration)
// 4. Feedback layer (voice + visual + haptic)
// 5. Progress indicator (huellas, sendero position)
```

### Animation requirements
- **Page enter:** Slide/fade in with Framer Motion (duration 0.4s, spring physics)
- **Animal idle:** Subtle breathing/swaying loop (infinite, gentle)
- **On correct:** Animal celebrates (jump + particles + sound). Duration: 1.5s
- **On wrong:** Animal hides/worries gently (shrink + peek). Duration: 1s. NEVER angry or sad.
- **Progress advance:** Trail animation showing movement forward (0.8s)
- **Stage complete:** Full-screen celebration with confetti + badge reveal

### Touch targets
- All interactive elements: minimum 48x48px (better: 56x56px)
- Number pad buttons: 64x64px minimum
- Generous padding between tap targets (12px gap minimum)
- Visual feedback on every tap (scale down 0.95 + color shift)

### Background theming
Each chapter has a background palette from its Chiloé habitat:
- Pudú (forest): Deep greens, fern patterns, dappled light
- Bandurrias (prairie/wetland): Golden greens, sky blues, grass textures
- Zorrito Darwin (night forest): Dark blues, moonlight, fireflies
- Monito del Monte (canopy): Moss greens, branch patterns, misty
- Güiña (night): Deep purples, starlight, tree silhouettes
- Chungungo (coast): Ocean blues, rocky grays, sea foam

### State machine
Every game screen uses a state machine:
```
INTRO → PLAYING → FEEDBACK → (NEXT_EXERCISE | STAGE_COMPLETE | CHAPTER_COMPLETE)
```
- INTRO: Animal speaks, problem appears with animation
- PLAYING: Player interacts, timer runs
- FEEDBACK: Result shown, animal reacts, voice speaks
- Transitions are animated, never instant

### Mobile-first layout
```
┌─────────────────┐
│   Animal (30%)   │  ← Animated character + speech bubble
│                  │
├─────────────────┤
│  Exercise (40%)  │  ← Vertical operation / question
│                  │
├─────────────────┤
│  Input (30%)     │  ← Number pad / choices
└─────────────────┘
```

### Voice integration
Every screen transition triggers voice:
- Screen enter: animal greeting or problem narration
- Correct answer: random celebration phrase
- Wrong answer: encouragement + hint (progressive)
- Stage complete: fun fact narration

### Performance
- Preload next exercise while showing feedback
- SVG animals, not raster images
- Lazy load chapter assets
- Keep main thread free during animations (use CSS transforms, not layout properties)
