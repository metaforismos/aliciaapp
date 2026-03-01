# Skill: Voice System

## Description
Use this skill when building or modifying the voice/speech system. Voice is a core companion feature — it makes Alicia feel accompanied, reads problems aloud, gives hints, and celebrates. Uses Web Speech API (SpeechSynthesis) in Spanish (es-CL).

## Architecture
```typescript
// Hook-based voice system
function useVoice() {
  speak(text: string, options?: VoiceOptions): void;
  stop(): void;
  isSpeaking: boolean;
  isSupported: boolean;
}

interface VoiceOptions {
  rate?: number;      // 0.8-1.0 for children (slower than default)
  pitch?: number;     // 1.0-1.3 (slightly higher = friendlier)
  onEnd?: () => void; // Callback when speech finishes
  priority?: 'high' | 'normal'; // High interrupts current speech
}
```

## Voice line categories

### Greetings (session start)
```
"¡Hola Alicia! Tus amigos del bosque te esperan"
"¡Qué bueno que llegaste! {animalName} necesita tu ayuda"
"¡Bienvenida, Guardiana! ¿Lista para la aventura?"
```

### Exercise narration
- Read the full problem aloud: "¿Cuánto es trece más seis?"
- For word problems, read the story then the question
- Pace: slow, clear, with pauses between numbers

### Progressive hints (on wrong answer)
```
Hint 1 (motivational): "Piensa con calma, tú puedes. {animalName} confía en ti"
Hint 2 (strategic): "Prueba empezar por las unidades" / "Separa en decenas y unidades"
Hint 3 (visual): Trigger visual aid + "Mira, te voy a ayudar con una pista"
Hint 4 (guided): "Vamos paso a paso juntas. Primero, ¿cuánto es {digit} más {digit}?"
```

### Celebration (on correct)
Randomized, never repetitive:
```
"¡Genial! ¡{animalName} avanzó otro paso!"
"¡Muy bien, Alicia! ¡Eres increíble!"
"¡Sí! ¡Lo lograste!"
"¡Excelente! {animalName} está muy feliz"
"¡Bravo! Cada vez más cerca"
```

### Encouragement (on wrong, no hint yet)
```
"Casi, intenta de nuevo. Piensa con calma"
"No te preocupes, puedes intentarlo otra vez"
"Mmm, no fue esa. ¡Pero estás cerca!"
```

### Fun facts
Read unlocked fun facts with enthusiasm and wonder.

### Stage/chapter completion
```
"¡Lo lograste! ¡{animalName} completó esta etapa!"
"¡Increíble, Guardiana! Has ganado una insignia"
```

## Implementation notes

### Voice selection
```typescript
// Prefer es-CL (Chilean Spanish), fallback to es-MX, then any es-*
function selectVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  return voices.find(v => v.lang === 'es-CL')
    || voices.find(v => v.lang === 'es-MX')
    || voices.find(v => v.lang.startsWith('es'))
    || null;
}
```

### Queue system
- Voice lines queue (don't overlap)
- High priority interrupts (important feedback)
- Cancel queue on page navigation
- Respect user's voice setting (enabled/disabled in settings)

### Accessibility
- Voice is supplementary, not required — all info also shown as text
- Provide visual speech indicator (animated mouth/wave icon)
- Parent can disable voice in settings

### Performance
- Pre-warm SpeechSynthesis on first user interaction (click/tap)
- Cache voice selection (don't re-query voices every time)
- Handle edge case: speechSynthesis.getVoices() returns empty on first call (use voiceschanged event)
