# Skill: Math Exercise Engine

## Description
Use this skill when building or modifying the math exercise generation system. The engine is PURE LOGIC — zero React imports. It generates exercises, evaluates answers, manages difficulty progression, and handles the adaptive algorithm.

## Exercise types

### Vertical operations (70% of exercises)
```typescript
interface VerticalExercise {
  type: 'vertical';
  operation: 'addition' | 'subtraction';
  operandA: number;
  operandB: number;
  correctAnswer: number;
  hasCarry: boolean;       // For addition
  hasBorrow: boolean;      // For subtraction
  digits: number;          // 1, 2, or 3 digit numbers
  level: DifficultyLevel;
}
```

### Thinking exercises (30% of exercises)
```typescript
type ThinkingExercise =
  | { type: 'mystery_number'; description: string; equation: string; answer: number }
  | { type: 'complete_operation'; left: string; operator: string; right: string; blank: 'left' | 'right' | 'result'; answer: number }
  | { type: 'compare'; expressionA: string; expressionB: string; answer: 'greater' | 'less' | 'equal' }
  | { type: 'estimation'; expression: string; options: number[]; answer: number }
  | { type: 'decomposition'; target: number; answer: [number, number][] }
  | { type: 'word_problem'; story: string; operation: 'addition' | 'subtraction'; numbers: number[]; answer: number }
```

## Difficulty levels

| Level | Chapter | Operation | Range | Constraints |
|-------|---------|-----------|-------|-------------|
| 1 | Pudú | Addition no carry | 1-20 | Sum ≤ 20, no digit sum > 9 |
| 2 | Bandurrias | Subtraction no borrow | 1-20 | No digit requires borrowing |
| 3 | Zorrito | Addition with carry | 10-99 | At least one carry required |
| 4 | Monito | Subtraction with borrow | 10-99 | At least one borrow required |
| 5 | Güiña | Mixed add/sub | 10-99 | Random operation selection |
| 6 | Chungungo | Add/sub 3 digits | 100-999 | May include carry/borrow |

## Generation rules

### Addition without carry (Level 1)
```
For each digit position: digitA + digitB ≤ 9
Range: operandA ∈ [1, 15], operandB ∈ [1, 20 - operandA]
Example: 13 + 6 = 19 ✓ (3+6=9 ≤ 9, 1+0=1 ≤ 9)
Example: 15 + 7 = 22 ✗ (violates range and could carry)
```

### Subtraction without borrow (Level 2)
```
For each digit position: digitA ≥ digitB
operandA > operandB always
Range: operandA ∈ [2, 20], operandB ∈ [1, operandA - 1]
Example: 17 - 5 = 12 ✓ (7≥5, 1≥0)
Example: 13 - 7 = 6 ✗ (3 < 7, requires borrow)
```

### Addition with carry (Level 3)
```
At least one digit position where digitA + digitB ≥ 10
Range: operandA ∈ [10, 89], operandB ∈ [10, 99 - operandA]
MUST generate a carry (reject and regenerate if no carry)
```

### Subtraction with borrow (Level 4)
```
At least one digit position where digitA < digitB
Range: operandA ∈ [20, 99], operandB ∈ [10, operandA - 1]
MUST require borrow (reject and regenerate if not)
```

## Adaptive algorithm
```typescript
interface AdaptiveState {
  currentLevel: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  exerciseHistory: ExerciseResult[];  // Last 20
  weakPatterns: string[];             // e.g., "carry_ones", "borrow_tens"
}

function adaptDifficulty(state: AdaptiveState): AdaptiveState {
  if (state.consecutiveCorrect >= 3) {
    // Level up (within chapter bounds)
    return { ...state, currentLevel: Math.min(state.currentLevel + 1, chapterMaxLevel) };
  }
  if (state.consecutiveWrong >= 2) {
    // Reduce difficulty: shrink number range first, then level down
    return reduceRange(state) || levelDown(state);
  }
  return state;
}
```

## Evaluation
- Vertical exercises: compare digit-by-digit entry with correct answer
- Track per-digit accuracy (to detect carry/borrow confusion)
- Track time per exercise (flag if > 60s as possible frustration)
- Award huellas: 3 (first try), 2 (second try), 1 (third+ try)

## Contextualization
Every exercise can have an optional narrative wrapper:
```typescript
interface ExerciseContext {
  animalName: string;
  storyLine: string;  // "Pascual encontró 8 hojas y 5 ramas"
  operation: VerticalExercise;
}
```
Word problems MUST use the current chapter's animal and scenario.

## Testing
The engine must have comprehensive unit tests:
- Every level generates valid exercises within constraints
- No carry exercises actually produce carries (Level 1, 2)
- Carry exercises always require carries (Level 3)
- Adaptive algorithm advances and retreats correctly
- Exercise distribution maintains 70/30 ratio over 100+ exercises
