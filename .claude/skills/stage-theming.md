---
name: stage-theming
description: Sistema de consistencia visual por etapa del juego. Usar SIEMPRE que se modifique o cree cualquier componente visual (fondos, barras de progreso, animaciones, partículas, colores, iconos, transiciones). Cada etapa tiene una identidad visual única que DEBE respetarse en TODOS los elementos de la pantalla. Trigger cuando se mencione: UI, fondo, progreso, barra, etapa, stage, tema visual, colores, animación de fondo, partículas, decoración, ambiente, transición entre etapas.
---

# Stage Theming — Consistencia Visual por Etapa

## Principio fundamental

**Cada etapa es un lugar físico en Chiloé.** Todo elemento visual en pantalla (fondo, barra de progreso, iconos, partículas, colores de acento, bordes, sombras) debe reflejar ese lugar. Si el jugador está en "Helechos gigantes", debe VER helechos. Si está en "Bosque oscuro", todo debe ser oscuro y misterioso.

## Arquitectura

### 1. Configuración centralizada

Toda la definición visual vive en `src/data/stageThemes.ts`. Nunca hardcodear colores o gradientes en componentes.

```typescript
interface StageTheme {
  // Identidad
  stageId: string;              // "ch1-s1"
  name: string;                 // "El bosque oscuro"
  environment: EnvironmentType; // Enum: bosque | agua | pradera | costa | noche

  // Fondo
  backgroundGradient: string;        // CSS gradient
  backgroundPattern?: string;        // CSS pattern overlay (árboles, helechos, olas)
  backgroundOpacity?: number;        // Para el pattern (0.05-0.15)

  // Colores de acento (afectan TODA la UI de esa etapa)
  accentPrimary: string;        // Color principal (botones, progreso activo)
  accentSecondary: string;      // Color secundario (bordes, hints)
  textOnBackground: string;     // Color de texto legible sobre el fondo

  // Barra de progreso
  progressTrailColor: string;   // Color del nodo activo en ProgressTrail
  progressLineColor: string;    // Color de la línea entre nodos
  progressNodeIcon?: string;    // Emoji o SVG id del icono en cada nodo (🌲, 🌿, 💧, ⭐)
  progressNodeCompleted: string; // Color nodo completado

  // Decoración ambiental
  decorativeElements: DecorativeElement[];  // SVG layers detrás del contenido
  particles?: ParticleConfig;               // Partículas animadas (hojas, estrellas, burbujas)
  ambientFilter?: string;                   // CSS filter (ej: brightness(0.85) para bosque oscuro)

  // Transición
  transitionEffect: 'fade' | 'slide-up' | 'dissolve';  // Al entrar a esta etapa
}

interface DecorativeElement {
  type: 'tree-silhouette' | 'fern-pattern' | 'water-ripple' | 'rock-formation'
        | 'star-field' | 'grass-wave' | 'cloud-layer' | 'coral-pattern';
  position: 'background' | 'foreground-bottom' | 'foreground-sides';
  opacity: number;        // 0.05-0.3 (sutil, no distraer del ejercicio)
  color: string;          // Usando variables CSS del tema
  animated?: boolean;     // Movimiento sutil (parallax, ondulación)
}

interface ParticleConfig {
  type: 'falling-leaves' | 'fireflies' | 'rain-drops' | 'stars-twinkle'
        | 'bubbles' | 'pollen' | 'snowflakes' | 'sand-grains';
  density: 'sparse' | 'medium';  // NUNCA 'dense' — no distraer
  speed: 'slow' | 'medium';      // NUNCA 'fast'
  color: string;
}
```

### 2. Componente ThemeProvider

```typescript
// src/components/theme/StageThemeProvider.tsx
// Envuelve ExercisePage y ChapterPage
// Lee stageId del store → aplica StageTheme a:
//   - CSS variables del container
//   - Background layers
//   - Particle system
//   - Progress bar colors
```

**Regla:** Ningún componente hijo debe definir sus propios colores de fondo o acento. Todos leen de las CSS variables inyectadas por StageThemeProvider.

### 3. Componente BackgroundScene

```typescript
// src/components/theme/BackgroundScene.tsx
// Renderiza las capas visuales de la etapa:
//   Layer 0: Gradiente base
//   Layer 1: Pattern overlay (árboles, helechos, etc.)
//   Layer 2: Decorative elements (SVG)
//   Layer 3: Particles (CSS animations)
//   Layer 4: Ambient filter (brightness, hue-rotate sutil)
// IMPORTANTE: z-index bajo, pointer-events: none
```

---

## Definición visual por capítulo y etapa

### Capítulo 1: Pupi el Pudú (Bosque Valdiviano)

| Etapa | Ambiente | Gradiente | Decoración | Partículas | Icono progreso |
|-------|---------|-----------|------------|------------|----------------|
| 1. Bosque oscuro | Bosque denso, poca luz | forest-900→forest-700 | Siluetas de coigües altos, sombras largas | Hojas cayendo (sparse, slow) | 🌑 |
| 2. El arroyo | Río entre árboles | forest-700→river-500 | Líneas de agua ondulante, piedras | Gotas de agua (sparse) | 💧 |
| 3. Helechos gigantes | Sotobosque verde brillante | forest-600→forest-300 | Hojas de helecho grandes, espirales | Polen (sparse, slow) | 🌿 |
| 4. Claro del bosque | Luz filtrándose | forest-500→sunset-200 | Rayos de luz diagonales, flores | Partículas de luz (medium) | ☀️ |
| 5. Reencuentro | Bosque cálido, amanecer | sunset-300→forest-400 | Árboles con luz dorada, mamá pudú | Hojas doradas (sparse) | 🦌 |

### Capítulo 2: Bandi la Bandurria (Pradera y Humedal)

| Etapa | Ambiente | Gradiente | Decoración | Partículas | Icono progreso |
|-------|---------|-----------|------------|------------|----------------|
| 1. Pradera vacía | Campo abierto, cielo amplio | forest-300→sky-200 | Pasto ondulante, horizonte lejano | Polen (sparse) | 🌾 |
| 2. Humedal | Zona pantanosa | forest-500→river-400 | Juncos, agua quieta con reflejos | Libélulas/lucecitas (sparse) | 🪷 |
| 3. Acantilados | Costa con viento | earth-500→river-600 | Rocas escarpadas, viento visible | Gotas de spray (sparse) | 🪨 |
| 4. El vuelo | Cielo abierto | sky-300→sky-100 | Nubes, silueta de costa abajo | Plumas (sparse, slow) | 🪶 |
| 5. Juntos de nuevo | Pradera cálida | sunset-200→forest-300 | Nido entre pastos, familia | Polen dorado (sparse) | 🪺 |

### Capítulo 3: Darwin el Zorro (Bosque Profundo)

| Etapa | Ambiente | Gradiente | Decoración | Partículas | Icono progreso |
|-------|---------|-----------|------------|------------|----------------|
| 1. Despertar | Amanecer en bosque | forest-800→sunset-400 | Niebla baja, troncos con musgo | Niebla (slow) | 🌅 |
| 2. Insectos del tronco | Tronco caído, detalle | forest-700→earth-500 | Textura de corteza, insectos | Luciérnagas (sparse) | 🪵 |
| 3. Murtas del camino | Sendero con arbustos | forest-500→earth-300 | Arbustos con frutos rojos/morados | Hojas (sparse) | 🫐 |
| 4. Orilla del río | Bosque junto al agua | forest-600→river-400 | Río serpenteante, piedras lisas | Gotas (sparse) | 🏞️ |
| 5. De vuelta a casa | Guarida entre raíces | earth-600→forest-500 | Raíces grandes, cueva acogedora | Luciérnagas (sparse) | 🏠 |

### Capítulo 4: Monti el Monito del Monte (Bosque Nocturno)

| Etapa | Ambiente | Gradiente | Decoración | Partículas | Icono progreso |
|-------|---------|-----------|------------|------------|----------------|
| 1. Despertar nocturno | Noche con luna | river-900→forest-900 | Luna, ramas en silueta | Estrellas titilantes (sparse) | 🌙 |
| 2. Árbol vacío | Árbol sin frutos | forest-900→earth-700 | Árbol seco, ramas vacías | Hojas secas (sparse) | 🌳 |
| 3. Las semillas | Búsqueda en el sotobosque | forest-800→forest-500 | Quintral, semillas brillantes | Semillas flotantes (sparse) | 🌱 |
| 4. Bosque renace | Brotes nuevos | forest-700→forest-300 | Brotes verdes, musgo fresco | Polen luminoso (medium) | 🌿 |
| 5. El festín | Abundancia de frutos | forest-400→sunset-300 | Frutos de quintral, colores | Partículas de luz (medium) | 🍇 |

### Capítulo 5: Luna la Güiña (Bosque Estrellado)

| Etapa | Ambiente | Gradiente | Decoración | Partículas | Icono progreso |
|-------|---------|-----------|------------|------------|----------------|
| 1. La noche cae | Atardecer→noche | sunset-500→river-900 | Cielo degradándose, primeras estrellas | Estrellas apareciendo (slow) | 🌆 |
| 2. Bosque de coigües | Bosque bajo estrellas | river-900→forest-800 | Coigües enormes, cielo estrellado | Luciérnagas (sparse) | 🌲 |
| 3. Peligro | Tensión, sombras | forest-900→earth-900 | Sombras moviéndose, ojos en la oscuridad | Ninguna (tensión) | ⚡ |
| 4. Tronco perfecto | Esperanza, detalle | forest-700→earth-500 | Tronco hueco con musgo, madriguera | Luciérnagas (medium) | 🕳️ |
| 5. Nuevo hogar | Noche cálida | river-800→forest-600 | Madriguera acogedora, luna visible | Estrellas (sparse) | 🏡 |

### Capítulo 6: Chun la Chungunga (Costa Rocosa)

| Etapa | Ambiente | Gradiente | Decoración | Partículas | Icono progreso |
|-------|---------|-----------|------------|------------|----------------|
| 1. Poza de rocas | Poza de marea | river-600→earth-400 | Rocas, pozas con agua, algas | Burbujas (sparse) | 🪸 |
| 2. Olas pequeñas | Rompiente suave | river-500→river-300 | Olas suaves, espuma | Spray marino (sparse) | 🌊 |
| 3. Buscando erizos | Fondo submarino | river-700→river-500 | Algas, erizos, estrellas de mar | Burbujas (medium) | 🦔 |
| 4. La corriente | Mar abierto, desafío | river-800→river-500 | Corrientes visibles, olas grandes | Espuma (medium) | 💨 |
| 5. Mar abierto | Mar profundo, triunfo | river-600→sky-300 | Horizonte, sol sobre el mar | Brillos de agua (sparse) | 🌅 |

---

## Reglas de aplicación

### REGLA 1: Todo componente visual hereda del tema de etapa

Nunca usar colores hardcodeados. Siempre referenciar CSS variables:

```css
/* Variables inyectadas por StageThemeProvider */
--stage-bg-gradient
--stage-accent-primary
--stage-accent-secondary
--stage-text-color
--stage-progress-color
--stage-progress-line
--stage-node-completed
```

```tsx
// ❌ MAL
<div className="bg-forest-500">

// ✅ BIEN
<div style={{ background: 'var(--stage-bg-gradient)' }}>
```

### REGLA 2: ProgressTrail refleja la etapa actual

Cada nodo del ProgressTrail muestra el icono de la etapa correspondiente (no un círculo genérico):

```tsx
// Nodo completado: icono + checkmark overlay + color completado
// Nodo actual: icono + anillo de progreso animado + color activo
// Nodo futuro: icono dimmed + color gris
```

La línea entre nodos puede tener un gradiente que transiciona entre los colores de dos etapas consecutivas.

### REGLA 3: BackgroundScene es obligatorio

Toda pantalla de juego (ExercisePage, ChapterPage con stage) DEBE renderizar BackgroundScene. No se permite un fondo de color sólido o solo gradiente sin decoración.

Capas (de atrás hacia adelante):
1. **Gradient** — el tono general
2. **Pattern** — textura sutil (opacity 0.05-0.15)
3. **Decorative SVGs** — elementos del ambiente (opacity 0.1-0.3)
4. **Particles** — animación sutil (opacity 0.2-0.5)
5. **Ambient filter** — ajuste final (brightness, saturation)
6. **Content** — ejercicio, animal, UI

### REGLA 4: Transiciones entre etapas

Al completar una etapa y pasar a la siguiente:
- Fade out del BackgroundScene actual (300ms)
- Fade in del BackgroundScene nuevo (500ms)
- El animal camina/vuela/nada hacia el siguiente punto del ProgressTrail
- Breve pausa narrativa con el nombre de la nueva etapa

### REGLA 5: Subtlety over spectacle

Las decoraciones y partículas son AMBIENTALES. Nunca deben:
- Distraer del ejercicio matemático
- Cubrir área de input (NumberPad)
- Ser más llamativas que la celebración al responder bien
- Moverse rápido o parpadear

Opacity máxima de decoración: 0.3
Velocidad máxima de partículas: slow-medium
Densidad máxima: medium (nunca dense)

### REGLA 6: Accesibilidad

- Contraste mínimo texto/fondo: 4.5:1 (WCAG AA)
- Si el fondo es oscuro (bosque nocturno), el texto DEBE ser claro
- Si el fondo es claro (pradera), el texto DEBE ser oscuro
- `prefers-reduced-motion`: desactivar partículas y animaciones decorativas
- Los iconos de progreso deben tener `aria-label` con el nombre de la etapa

### REGLA 7: Performance mobile

- Partículas: máximo 15 elementos simultáneos en pantalla
- SVG decorativos: usar `will-change: transform` solo si animados
- BackgroundScene: cachear layers que no cambian
- No usar `backdrop-filter` en dispositivos de gama baja
- Pattern overlays: preferir CSS repeating-linear-gradient sobre imágenes

---

## Checklist de consistencia

Antes de dar por terminado cualquier cambio visual, verificar:

- [ ] ¿El fondo refleja el lugar físico de la etapa?
- [ ] ¿La barra de progreso usa los iconos definidos para esta etapa?
- [ ] ¿Los colores de acento vienen del StageTheme, no hardcodeados?
- [ ] ¿Hay al menos una capa decorativa visible (no solo gradiente)?
- [ ] ¿Las partículas son sutiles y no distraen?
- [ ] ¿La transición entre etapas es fluida?
- [ ] ¿El contraste texto/fondo es suficiente?
- [ ] ¿Funciona con `prefers-reduced-motion`?
- [ ] ¿El rendimiento es aceptable en móvil?
