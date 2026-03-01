---
name: narrative-engine
description: Motor narrativo de "Las Aventuras de Alicia en Chiloé". Usar SIEMPRE que se genere o modifique cualquier texto que el jugador lee o escucha — diálogos, speech bubbles, mensajes de celebración, hints, narración de etapas, fun facts, intros de capítulos, mensajes de error, streaks, o cualquier string visible en la app. Este skill define QUIÉN habla, CÓMO habla, y QUÉ dice en cada momento. Trigger cuando se mencione: diálogo, mensaje, texto, voz, narración, burbuja, speech bubble, saludo, celebración, pista, hint, fun fact, intro, story, personaje habla, tono, personalidad del personaje, narrativa, guion, script.
---

# Narrative Engine — Las Aventuras de Alicia en Chiloé

## La regla de oro

**No existe un narrador omnisciente.** Cada palabra que el jugador lee o escucha sale de la boca de un personaje concreto. Si no hay un personaje presente en la escena, Alicia piensa en voz alta. Nunca hay una "voz del juego" describiendo lo que pasa en tercera persona.

### Qué significa esto en la práctica

```
❌ PROHIBIDO (narrador omnisciente):
"¡Excelente, Alicia! ¡Pascual está saltando de alegría!"
"Pascual te saluda."
"Tu amigo tiene algo que contarte."
"Los animales de Chiloé te mandan saludos."

✅ CORRECTO (personaje habla directo):
Pascual: "¡Lo hiciste, Alicia! ¡Sabía que podías! *salta entre los helechos*"
Pascual: "¡H-hola! Soy Pascual... perdón, es que soy un poco tímido."
Pascual: "¿Sabías que soy el ciervo más chiquitito del mundo? ¡Mido lo mismo que tu mochila!"
```

La diferencia es fundamental: el jugador siente que habla CON Pascual, no que alguien le cuenta sobre Pascual.

---

## Estructura narrativa: quién habla y cuándo

### Los 3 tipos de voz en el juego

| Voz | Cuándo se usa | Ejemplo |
|-----|---------------|---------|
| **Personaje del capítulo** | Durante toda la aventura del capítulo: saludos, reacciones, celebraciones, datos curiosos, despedidas | Pascual: "¡Esa era difícil y la sacaste igual! Oye, ¿te cuento algo? Mi mamá me está esperando..." |
| **Alicia (pensamiento)** | Menú principal, selección de capítulos, transiciones entre mundos, cuando no hay un personaje presente | Alicia: "Hmm, ¿por dónde empiezo hoy? ¡El bosque se ve misterioso!" |
| **Seres mitológicos (guías)** | Apariciones especiales: el Alerce Sabio al inicio del juego, la Pincoya en misiones marinas, el Trauco en acertijos | El Alerce: "Pequeña Alicia, los animales del bosque necesitan una amiga valiente..." |

**NO existe** una cuarta voz de "sistema" o "narrador". Incluso los mensajes de UI (streaks, logros, advertencias de tiempo) se atribuyen a un personaje.

---

## Personalidades y voces de los personajes

Cada personaje tiene una forma de hablar única. La personalidad no es decorativa — se refleja en vocabulario, ritmo, muletillas y tipo de humor.

### Pascual el Pudú (Capítulo 1)
- **Personalidad:** Tímido, curioso, se asusta fácil pero es valiente cuando importa
- **Forma de hablar:** Frases cortas, a veces tartamudea de nervios. Usa diminutivos. Se disculpa por todo. Hace preguntas todo el tiempo
- **Muletillas:** "¿Sabías que...?", "Es que...", "Perdón, es que me dio susto"
- **Humor:** Inocente, se ríe de sí mismo por asustarse
- **Tono emocional:** Cálido, tierno, genera protección
- **Voz TTS:** Rate 0.85, pitch 1.3 (voz aguda, pausada, tímida)

```
Saludo: "¡A-Alicia! ¡Viniste! Yo... es que me perdí y está muy oscuro aquí..."
Correcto: "¡Sí, sí, sí! ¡Esa era! *asoma la nariz entre los helechos* ¡Eres muy lista!"
Incorrecto: "Mmm, esa no era... ¡pero no te preocupes! A mí me cuesta hasta caminar sin tropezarme, jiji."
Hint: "Oye Alicia, ¿y si pruebas contando desde el número más grande? A mí me funciona con las hojas."
Dato curioso: "¿Sabías que soy el ciervo más chiquitito del mundo? ¡Mido como 35 centímetros! Más chico que tu mochila."
Etapa completa: "¡Alicia, mira! ¡Puedo ver el arroyo desde aquí! ¿Seguimos juntos? ...¿sí?"
```

### Berta y Bruno las Bandurrias (Capítulo 2)
- **Personalidad:** Ruidosos, sociables, dramáticos. Hablan los dos, a veces se interrumpen
- **Forma de hablar:** Exclamaciones, frases largas, se emocionan con todo. Berta es la líder, Bruno es más torpe y cariñoso
- **Muletillas:** "¡BRUNOOO!", "¡Espera, espera!", "¡Qué emoción!"
- **Humor:** Comedia de pareja, se pelean jugando, exageran todo
- **Tono emocional:** Alegre, enérgico, ruidoso, contagioso
- **Voz TTS:** Rate 1.0, pitch 1.1 (rápido, expresivo)

```
Saludo:
  Berta: "¡ALICIA! ¡Por fin! ¡La tormenta nos separó y no encuentro a Bruno!"
  Bruno: "¡¡Berta!! ¿Eres tú? ¡¡Estoy aquí!! ...¿dónde es aquí?"
Correcto:
  Berta: "¡ESO! ¡Sabía que Alicia podía! ¡Bruno, escuchaste?"
  Bruno: "¡Sí, sí! ¡Es la mejor! ¡Hagamos bulla para celebrar! ¡CRAAA!"
Incorrecto:
  Berta: "¡No era esa, pero tranquila! A Bruno le toma como diez intentos encontrar comida y míralo, sigue vivo."
  Bruno: "¡Oye! ...bueno, es verdad."
```

### Darwin el Zorrito (Capítulo 3)
- **Personalidad:** Valiente, aventurero, un poco presumido pero con buen corazón. Líder natural
- **Forma de hablar:** Seguro de sí mismo, usa lenguaje de explorador. Cuenta todo como si fuera una hazaña épica
- **Muletillas:** "¡Mira esto!", "Según mis cálculos...", "Un buen explorador siempre..."
- **Humor:** Se cree muy serio pero hace cosas torpes, como chocar con ramas
- **Tono emocional:** Confianza, aventura, inspiración
- **Voz TTS:** Rate 0.9, pitch 1.0 (voz firme, decidida)

```
Saludo: "¡Alicia! Justo la exploradora que necesitaba. Tengo hambre y el bosque es grande. ¿Vamos?"
Correcto: "¡Excelente cálculo! Según mis observaciones, eres tan inteligente como Charles Darwin. Bueno, casi."
Incorrecto: "Hmm, no era esa. Pero un buen explorador nunca se rinde con el primer intento. ¡Yo una vez me perdí tres días y aquí estoy!"
Hint: "Mira, Alicia: un explorador siempre empieza por lo que sabe. ¿Qué número conoces seguro?"
Dato curioso: "¿Sabías que me descubrió Charles Darwin en persona? En 1834. Por eso me llamo Darwin. Modesto, ¿no?"
```

### Momo el Monito del Monte (Capítulo 4)
- **Personalidad:** Dormilón, dulce, lento para reaccionar pero sorprendentemente sabio. Habla como recién despertado
- **Forma de hablar:** Bosteza entre frases. Usa metáforas de sueño y comida. Todo lo compara con dormir
- **Muletillas:** "*bostezo*", "Mmm qué rico...", "Es como cuando dormís y..."
- **Humor:** Se queda dormido a medio diálogo, confunde cosas por sueño
- **Tono emocional:** Paz, ternura, calma
- **Voz TTS:** Rate 0.75, pitch 1.2 (lento, suave, como susurrando)

```
Saludo: "Mmm... *bostezo* ...¿Alicia? Ah, hola... Recién desperté del invierno y... tengo muuucha hambre..."
Correcto: "*abre los ojos grandes* ¡Esa era! ¡Ahora sí puedo buscar mis frutitas! ...después de una siestita."
Incorrecto: "No te preocupes, Alicia... yo me equivoco de rama todo el tiempo cuando tengo sueño. Intenta de nuevo con calma..."
Hint: "Sabes... cuando no puedo encontrar una fruta, cierro los ojos y pienso despacio. Prueba contar despacito."
Dato curioso: "¿Sabías que mi familia tiene 40 millones de años? Somos primos lejanos de los canguros... *bostezo* ...pero yo prefiero dormir a saltar."
```

### Luna la Güiña (Capítulo 5)
- **Personalidad:** Sigilosa, elegante, misteriosa. Observadora. Habla poco pero cada palabra cuenta
- **Forma de hablar:** Frases cortas y precisas. Usa metáforas de sombras, luna, noche. Nunca grita
- **Muletillas:** "Shh...", "Mira con atención...", "En la oscuridad..."
- **Humor:** Seco, observacional. Nota detalles que nadie más ve
- **Tono emocional:** Misterio, elegancia, confianza silenciosa
- **Voz TTS:** Rate 0.8, pitch 1.0 (voz baja, suave, como un susurro nocturno)

```
Saludo: "Shh... Alicia. Soy Luna. No te asustes — mis ojos brillan en la noche, pero soy amiga. Necesito encontrar un hogar nuevo."
Correcto: "Bien. Muy bien. Tienes ojos de gata nocturna, Alicia — ves lo que otros no ven."
Incorrecto: "No era esa. Pero en la oscuridad, hay que intentar muchas veces antes de encontrar el camino. Otra vez."
Hint: "Mira con atención... los números tienen un patrón. Como las huellas en el barro."
Dato curioso: "Pocos me han visto. Soy el felino más misterioso de América. En Chiloé, a veces nazco completamente negra. Como la noche misma."
```

### Neptuno el Chungungo (Capítulo 6)
- **Personalidad:** Juguetón, acuático, hiperactivo. Todo es un juego para él. Le encanta nadar y bucear
- **Forma de hablar:** Rápido, entusiasta, usa onomatopeyas acuáticas. Compara todo con el mar
- **Muletillas:** "¡Splash!", "¡Ven, ven!", "¡Como una ola!"
- **Humor:** Hace chistes de agua, se sacude y moja a todos, se ríe fuerte
- **Tono emocional:** Diversión, energía, libertad
- **Voz TTS:** Rate 1.0, pitch 1.15 (rápido, alegre, burbujeante)

```
Saludo: "¡SPLASH! ¡Hola Alicia! ¡Soy Neptuno! ¿Te mojé? ¡Perdón! Es que estoy emocionado — ¡hoy vamos a explorar las pozas de roca!"
Correcto: "¡WOOO! ¡Correctísimo! ¡Eso merece un chapuzón de celebración! *se zambulle y salpica*"
Incorrecto: "¡Ups! Esa no era, pero tranqui — yo me caigo de las rocas como diez veces al día y siempre vuelvo a subir. ¡Dale de nuevo!"
Hint: "Oye, ¿y si lo piensas como contar erizos en la poza? Uno por uno, sin apuro."
Dato curioso: "¿Sabías que mi pelaje es el más grueso de todos los mamíferos marinos? ¡Por eso puedo nadar en el agua heladísima del Pacífico sin tiritar!"
```

---

## Alicia como voz interna

Cuando no hay un personaje animal presente, Alicia piensa en voz alta. Esto ocurre en:

- **Menú principal / selección de capítulos:** "Hmm, ¿a quién ayudo hoy? ¡El bosque tiene muchos amigos que me necesitan!"
- **Transiciones entre etapas:** "¡Vamos! Pascual dice que el arroyo está por allá..."
- **Logros y streaks:** "¡Llevo 5 días seguidos! ¡Soy la mejor guardiana del bosque!"
- **Advertencias de tiempo:** "Uf, llevo un buen rato... Quizás debería descansar un poquito."

**Personalidad de Alicia:**
- Valiente, curiosa, empática
- Habla como una niña chilena de 8-9 años
- Usa chilenismos suaves: "cachai", "po", "dale"
- Nunca es pasiva — siempre quiere hacer algo, ayudar, explorar
- Se emociona con los datos curiosos: "¡Woow, no sabía eso!"

```
Selección de capítulo: "¡Mira, un zorrito! Se ve valiente... ¿Vamos a ayudarlo?"
Streak día 7: "¡Una semana entera! ¡Mis amigos del bosque saben que pueden contar conmigo!"
Volver tras ausencia: "¡Volví! Me pregunto cómo estará Pascual..."
```

---

## Seres mitológicos como voces especiales

Los seres mitológicos aparecen en momentos narrativos clave. Hablan de forma diferente a los animales — más solemne, más poética, pero siempre accesible para niños.

### El Alerce (El Sabio)
- **Cuándo:** Tutorial, inicio del juego, momentos de transición grande
- **Voz:** Lenta, profunda, cálida. Como un abuelo contando historias
- **Rate:** 0.7, Pitch: 0.9

```
"Pequeña Alicia... yo he visto 3.000 inviernos desde esta colina. Y en todos esos años, pocas veces he visto un corazón tan valiente como el tuyo. Los animales del bosque necesitan una amiga. ¿Serás tú?"
```

### La Pincoya (Guía marina)
- **Cuándo:** Capítulo 6 (Neptuno), misiones costeras
- **Voz:** Melodiosa, como cantando. Ritmo de olas

```
"Alicia del bosque, bienvenida al mar. Yo danzo en la orilla para traer abundancia. Hoy, Neptuno necesita tu ayuda entre las olas."
```

### El Trauco (Guardián de senderos)
- **Cuándo:** Desafíos especiales, bonus levels
- **Voz:** Gruñona pero amable. Como un viejo cascarrabias que en el fondo te quiere

```
"¡Ajá! ¿Otra vez tú, Alicia? Bueno, si quieres pasar por MI sendero, tendrás que resolver esto. Y NO vale pedir pistas... bueno, UNA pista."
```

---

## Flujo narrativo completo: estructura por momentos

### Al abrir el juego
**Voz:** Alicia
```
"¡Hola! ¡El bosque de Chiloé me está llamando!"
```
(Si es primera vez, el Alerce da la bienvenida y explica la misión)

### Al entrar a un capítulo
**Voz:** El personaje del capítulo, hablándole directo a Alicia
```
Pascual: "¡A-Alicia! Menos mal que llegaste... *mira nervioso hacia los árboles* ...me perdí y no encuentro a mi mamá. ¿Me ayudas?"
```
La intro NO describe al animal en tercera persona. El animal se presenta solo, con su personalidad.

### Durante los ejercicios
**Voz:** El personaje del capítulo reacciona según resultado

| Momento | Quién habla | Tono |
|---------|-------------|------|
| Presentar ejercicio | El personaje pide ayuda con algo concreto de su situación | Narrativo |
| Respuesta correcta | El personaje celebra EN SU ESTILO (Pascual salta tímido, Neptuno salpica) | Celebración personalizada |
| Respuesta incorrecta | El personaje anima EN SU ESTILO (Darwin motiva como explorador, Momo calma) | Aliento personalizado |
| Hint nivel 1-2 | El personaje da pista desde su mundo (Pascual cuenta hojas, Neptuno cuenta erizos) | In-character |
| Hint nivel 3-4 | El personaje da pista matemática directa pero con su voz | Más directo |

### Al completar una etapa
**Voz:** El personaje + dato curioso en primera persona
```
Pascual: "¡Alicia, mira! ¡Puedo ver los helechos gigantes! Oye, ¿sabías que los helechos de este bosque son como palmeras prehistóricas? ¡Tienen millones de años! ...casi tanto como el hambre que tengo."
```
El dato curioso viene del personaje, no de un recuadro genérico. El personaje lo cuenta como algo que sabe de su mundo.

### Al completar un capítulo
**Voz:** El personaje se despide + Alicia reflexiona
```
Pascual: "¡Alicia! ¡Ahí está mi mamá! *corre y se tropieza* ¡Gracias, gracias, gracias! Sin ti no habría llegado nunca. Eres mi mejor amiga."
Alicia: "¡Chao, Pascual! Cuídate mucho. Y no te pierdas de nuevo, ¿ya?"
```

---

## Reglas de generación de diálogo

### 1. Consistencia de voz
Cada personaje mantiene su forma de hablar SIEMPRE. Pascual no puede de repente hablar como Darwin. Si un mensaje suena genérico, está mal.

**Test de consistencia:** Si tapas el nombre del personaje y no puedes adivinar quién habla, el diálogo falla.

### 2. Sin narrador en tercera persona
Revisar cada string del juego. Si algún texto dice "tu amigo", "el animal", "{animalName} está feliz" o cualquier referencia en tercera persona a un personaje presente, reescribirlo en primera persona desde el personaje.

### 3. Contextualización por etapa
Los diálogos referencian el lugar donde están. Si Pascual está en el bosque oscuro, habla de sombras y árboles. Si está junto al arroyo, habla de agua y piedras. No hay mensajes genéricos que sirvan para cualquier etapa.

```
❌ Genérico: "¡Muy bien, Alicia!"
✅ Contextualizado: "¡Lo hiciste! ¡Ahora puedo cruzar el arroyo sin miedo!" (etapa 2, el arroyo)
```

### 4. Progresión emocional
La relación personaje-Alicia evoluciona dentro del capítulo:

| Etapa 1 | Etapa 2-3 | Etapa 4-5 |
|---------|-----------|-----------|
| Se conocen, el personaje está asustado/necesitado | Confianza creciente, comparten, bromean | Son amigos, el personaje muestra gratitud genuina |

Pascual en etapa 1: "¿T-tú eres Alicia? ¿De verdad me vas a ayudar?"
Pascual en etapa 5: "¡Alicia, eres mi mejor amiga! ¡Nunca te voy a olvidar!"

### 5. Variedad en mensajes
Para cada tipo de momento (correcto, incorrecto, hint), debe haber al menos 7-10 variantes por personaje. El jugador no debe escuchar el mismo mensaje dos veces seguidas.

### 6. Datos curiosos en primera persona
Los datos curiosos (fun facts) los cuenta el personaje como conocimiento propio, no como una ficha enciclopédica:

```
❌ Ficha: "El pudú (Pudu puda) es el cérvido más pequeño del mundo, midiendo 35-40cm de altura."
✅ Personaje: "¿Sabías que soy el ciervo más chiquitito del mundo? ¡Mido como 35 centímetros! Más chico que tu mochila. A veces me da vergüenza, pero mi mamá dice que lo importante es ser valiente, no grande."
```

### 7. Español chileno natural
Los personajes hablan español chileno apropiado para niños de 5-12 años:
- "Cachai" (¿entiendes?) — uso moderado
- "Po" como refuerzo — "Sí po", "Dale po"
- Diminutivos: "chiquitito", "poquitito", "ratito"
- Exclamaciones: "¡Pucha!", "¡Chuta!"
- Evitar groserías, modismos demasiado adultos, o regionalismos muy cerrados

### 8. Adaptación por edad
Los diálogos se ajustan al nivel de dificultad del capítulo:
- **Kinder-1° básico (5-7):** Frases muy cortas, vocabulario simple, mucha repetición cariñosa
- **2°-4° básico (7-10):** Frases más largas, humor, referencias al currículo
- **5°-6° básico (10-12):** Datos más complejos, humor más sofisticado, vocabulario rico

---

## Implementación técnica: estructura de datos

### MessageTemplate con identidad de personaje

```typescript
interface CharacterDialogue {
  characterId: string;           // "pascual", "berta-bruno", "darwin", etc.
  context: StageContext;         // Etapa + ambiente actual
  category: DialogueCategory;   // "greeting" | "correct" | "incorrect" | "hint" | "funFact" | "stageComplete" | "chapterComplete"
  lines: DialogueLine[];        // Variantes del mensaje
}

interface DialogueLine {
  text: string;                  // El diálogo con marcadores de acción: "*salta*", "*bostezo*"
  speaker: 'character' | 'alicia' | 'mythological';  // Quién habla
  emotion: AnimalAnimationState; // idle, celebrating, worried, hiding, etc.
  voiceConfig?: {                // Override de voz para este personaje
    rate: number;
    pitch: number;
  };
  stageIds?: string[];           // Si aplica solo a ciertas etapas (opcional)
}

interface StageContext {
  chapterId: string;
  stageOrder: number;
  environment: string;           // "bosque-oscuro", "arroyo", etc.
}
```

### Speech Bubble con identidad

El componente SpeechBubble debe mostrar quién habla:

```tsx
// Props extendidos
interface SpeechBubbleProps {
  text: string;
  speaker: string;          // "Pascual", "Alicia", "Berta"
  speakerColor?: string;    // Color del nombre (match con el personaje)
  emotion?: string;         // Para ajustar estilo del bubble
  isAliciaThinking?: boolean; // Bubble diferente para pensamientos de Alicia
}
```

- **Burbuja de personaje animal:** Apunta hacia el animal, muestra nombre del personaje arriba
- **Burbuja de Alicia (pensamiento):** Estilo "nube de pensamiento" (bordes ondulados), sin cola
- **Burbuja de ser mitológico:** Estilo especial — bordes con textura de madera/agua/estrellas según el ser

### Voz diferenciada por personaje

Cada personaje tiene parámetros de voz distintos en TTS:

```typescript
const CHARACTER_VOICE_CONFIGS: Record<string, VoiceConfig> = {
  'pascual':      { rate: 0.85, pitch: 1.3 },   // Tímido, agudo, pausado
  'berta':        { rate: 1.0,  pitch: 1.15 },   // Rápida, expresiva
  'bruno':        { rate: 0.95, pitch: 0.95 },    // Más grave que Berta
  'darwin':       { rate: 0.9,  pitch: 1.0 },    // Firme, decidido
  'momo':         { rate: 0.75, pitch: 1.2 },    // Lento, suave, soñoliento
  'luna':         { rate: 0.8,  pitch: 1.0 },    // Bajo, susurro nocturno
  'neptuno':      { rate: 1.0,  pitch: 1.15 },   // Rápido, burbujeante
  'alicia':       { rate: 0.9,  pitch: 1.2 },    // Niña, natural, chilena
  'alerce':       { rate: 0.7,  pitch: 0.9 },    // Lento, profundo, sabio
  'pincoya':      { rate: 0.85, pitch: 1.1 },    // Melodiosa, ondulante
  'trauco':       { rate: 0.85, pitch: 0.85 },   // Gruñón, rasposo
};
```

---

## Checklist de narrativa

Antes de aprobar cualquier texto visible en la app:

- [ ] ¿Hay algún mensaje en tercera persona sobre un personaje presente? → Reescribir en primera persona
- [ ] ¿Se puede identificar quién habla sin ver el nombre? → Si no, la voz no es suficientemente distintiva
- [ ] ¿El diálogo referencia la etapa/ambiente actual? → Si es genérico, contextualizar
- [ ] ¿El tono es consistente con la personalidad del personaje? → Verificar contra su ficha
- [ ] ¿Hay al menos 7 variantes por tipo de mensaje por personaje? → Si no, agregar más
- [ ] ¿Los datos curiosos están en primera persona del personaje? → Si son enciclopédicos, reescribir
- [ ] ¿El español suena natural para un niño chileno? → Leer en voz alta
- [ ] ¿La progresión emocional es coherente? (etapa 1 ≠ etapa 5) → Verificar arco
