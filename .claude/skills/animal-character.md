# Skill: Animal Character Creator

## Description
Use this skill when creating or modifying animal characters for AliciaApp. Each animal is a React SVG component with multiple animation states driven by Framer Motion. Animals must look cute but faithful to their real appearance — they are native Chiloé fauna.

## Character component structure
```tsx
interface AnimalProps {
  state: 'idle' | 'walking' | 'celebrating' | 'hiding' | 'worried' | 'eating' | 'sleeping';
  size?: 'sm' | 'md' | 'lg';
  direction?: 'left' | 'right';
  speechBubble?: string;
  onClick?: () => void;
}
```

## Animation states

### idle
- Subtle breathing (scale Y 1.0 → 1.02, 2s loop)
- Occasional blink (every 3-5s random)
- Tail/ear micro-movement
- This is the default state

### walking
- Body bob (translate Y ±3px, 0.5s loop)
- Leg alternation if applicable
- Forward lean
- Used during sendero advancement

### celebrating
- Jump up (translate Y -20px, spring back)
- Eyes become happy crescents (◠◠)
- Sparkle particles around
- Optional: spin for small animals
- Duration: 1.5s then return to idle

### hiding
- Shrink to 60% scale
- Peek from behind element (translate X partially off-screen)
- Wide worried eyes visible
- Used on wrong answers — must feel gentle, not punishing

### worried
- Slight tremble (rotate ±2deg, fast)
- Brow furrow
- Ears/tail down
- Brief, transitions to idle in 1s

### eating / sleeping
- Context-specific per animal story
- Used in chapter narrative moments

## Design principles

### Anatomy accuracy
- Pudú: tiny deer, 40cm, reddish-brown fur, round ears, NO antlers on baby
- Bandurria: tall wading bird, long curved beak, gray plumage, pink legs
- Zorrito Darwin: small dark fox, reddish ears, bushy tail, 2.5kg
- Monito del monte: tiny marsupial, huge dark eyes, prehensile tail, fits in palm
- Güiña: tiny spotted wild cat, round face, some are melanistic (all black)
- Chungungo: small sea otter, sleek wet fur, webbed feet, whiskers

### Style guide
- Clean SVG paths, not overly detailed
- Rounded shapes for friendliness
- Large expressive eyes (30% of head)
- Soft color gradients within the animal's natural palette
- No outlines (filled shapes only)
- Maximum 3-4 colors per animal base

### Speech bubbles
- Rounded rectangle with tail pointing to animal
- White background, 80% opacity
- Text in Comic-style rounded font
- Appears with pop animation (scale 0 → 1, spring)
- Auto-dismiss after voice finishes reading

## File organization
Each animal lives in `src/components/animals/`:
```
animals/
  Pudu.tsx          # Pascual
  Bandurria.tsx     # Berta & Bruno
  ZorritoDarwin.tsx # Darwin
  MonitoDelMonte.tsx # Momo
  Guina.tsx         # Luna
  Chungungo.tsx     # Neptuno
  types.ts          # Shared AnimalProps interface
  animations.ts     # Shared Framer Motion variants
```
