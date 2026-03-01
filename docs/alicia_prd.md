# PRD: AliciaApp — Plataforma de Aprendizaje Gamificado
**v2.0 | Febrero 2026 | Draft**

---

| Campo | Detalle |
|-------|---------|
| Producto | AliciaApp |
| Autor | Andrés (Quant4x Technologies) |
| Usuario objetivo | Alicia, 7 años, 2° básico, Chiloé |
| Plataforma | Web app responsive (mobile-first) |
| Stack propuesto | React + TypeScript + Supabase + Web Speech API |

---

## 1. Problema

Alicia tiene 7 años, cursa 2° básico y necesita reforzar sumas y restas. Resuelve operaciones usando los dedos y aún no ha desarrollado cálculo mental. Las herramientas disponibles son genéricas, no se adaptan a su nivel, carecen de motivación emocional y no trabajan el pensamiento matemático de forma progresiva.

## 2. Solución

Una web app gamificada cuya propuesta central es **ayudar a animales nativos de Chiloé** a través de ejercicios matemáticos. Cada animal es un personaje con nombre, personalidad y una misión que Alicia debe resolver. La app usa voz sintética para motivar, dar pistas y celebrar logros. Comienza con matemáticas y está diseñada para expandirse a otras materias.

## 3. Usuarios y Contexto

### Usuario primario: Alicia
- 7 años, 2° básico, vive en Chiloé
- Sabe sumar y restar en formato vertical, pero depende de los dedos
- Necesita transicionar de conteo mecánico a comprensión numérica
- Fuerte afinidad con la naturaleza y los animales de su entorno

### Usuario secundario: Padre (Andrés)
- Monitorea progreso y configura dificultad
- Puede ajustar rangos numéricos y activar/desactivar módulos

---

## 4. Concepto Central: Guardianes del Bosque Chilote

Alicia es una **Guardiana del Bosque**. Su misión es ayudar a los animales nativos de Chiloé que necesitan su ayuda. Cada capítulo gira en torno a un animal con un problema real y emocional que solo se resuelve completando ejercicios matemáticos.

### Mecánica narrativa
- Cada animal tiene un **nombre**, una **personalidad** y una **historia** dividida en etapas
- Los ejercicios correctos hacen avanzar al animal en un camino visual (un sendero del bosque chilote)
- Cada etapa completada desbloquea un dato real sobre el animal (educación ambiental integrada)
- Al completar la historia de un animal, Alicia recibe una **insignia de guardiana** y el animal queda en su "Refugio" (colección)

### Progresión de capítulos
El orden de los capítulos coincide con la progresión de dificultad matemática. Cada animal introduce un salto cognitivo.

---

## 5. Personajes: Fauna Nativa de Chiloé

### 🦌 Capítulo 1: Pascual el Pudú
**Animal:** Pudú (*Pudu puda*) — el ciervo más pequeño de Sudamérica

**Perfil:**
- Nombre: Pascual
- Personalidad: Tímido, curioso, se asusta fácil pero es muy valiente cuando importa
- Tamaño real: Solo 40 cm de alto, pelaje café rojizo, orejas redondas
- Dato clave: Los pudúes son monógamos, viven en familias pequeñas y se esconden entre el sotobosque. En Chiloé son más abundantes que en el continente

**Historia:** Pascual se perdió en el bosque durante una tormenta y necesita encontrar a su mamá. Cada ejercicio correcto lo hace avanzar un tramo del sendero. Si Alicia se equivoca, Pascual se esconde detrás de un helecho (no pierde progreso, solo no avanza).

**Etapas:**
1. *El bosque oscuro* — Pascual sale de donde se refugió
2. *El arroyo* — Cruza un riachuelo siguiendo las huellas de su mamá
3. *Los helechos gigantes* — Avanza entre el sotobosque denso
4. *El claro del bosque* — Ve a su mamá a lo lejos
5. *El reencuentro* — ¡Pascual y su mamá se abrazan!

**Nivel matemático:** Suma sin carry (1-20) — Composición de números
**Dato que desbloquea:** "¿Sabías que el pudú es tan chiquito que puede esconderse dentro de un tronco? Solo mide 40 cm, como tu mochila."

**Estado de conservación real:** Vulnerable (VU). Amenazado por perros, atropellos y pérdida de bosque nativo.

---

### 🐦 Capítulo 2: Berta y Bruno las Bandurrias
**Animal:** Bandurria austral (*Theristicus melanopis*) — ave icónica de Chiloé

**Perfil:**
- Nombres: Berta y Bruno
- Personalidad: Ruidosas, sociables, un poco dramáticas. Se comunican con un grito metálico inconfundible
- Tamaño real: 74 cm de alto, pico largo y curvo, patas rosadas, plumaje gris con cabeza amarillenta
- Dato clave: Las bandurrias se alimentan caminando en pareja por los campos, hurgando el suelo con su pico curvo. En la tradición chilota, su grito anuncia cambios de clima

**Historia:** Bruno se separó de Berta durante una migración. Las bandurrias siempre andan de a dos — una sin la otra está perdida. Alicia ayuda a Bruno a recorrer praderas, humedales y acantilados para reencontrarse con Berta.

**Etapas:**
1. *La pradera vacía* — Bruno busca a Berta en los campos
2. *El humedal* — Cruza un pantano buscando pistas
3. *Los acantilados* — Sube a los riscos donde anidan las bandurrias
4. *El vuelo* — Bruno ve a Berta volando a lo lejos
5. *Juntos de nuevo* — ¡Se reencuentran y cantan juntos su famoso grito!

**Nivel matemático:** Resta sin borrow (1-20) — Descomposición de números
**Dato que desbloquea:** "En Chiloé dicen que cuando las bandurrias gritan fuerte con las alas abiertas, viene mal tiempo. ¡Son las meteorólogas del campo!"

**Estado de conservación real:** Preocupación menor (LC), pero sensible a contaminación y pérdida de humedales.

---

### 🦊 Capítulo 3: Darwin el Zorrito Chilote
**Animal:** Zorro de Darwin (*Lycalopex fulvipes*) — endémico de Chiloé y Nahuelbuta

**Perfil:**
- Nombre: Darwin (como Charles Darwin, quien lo descubrió en 1834)
- Personalidad: Astuto, independiente, nocturno. Parece serio pero es juguetón cuando nadie mira
- Tamaño real: 2.5-4 kg, el más pequeño de los zorros chilenos. Pelaje oscuro, orejas rojizas
- Dato clave: La mayor población vive en la Isla Grande de Chiloé. Es una de las especies de zorros más amenazadas del mundo. Se alimenta de insectos, frutas, anfibios y pequeños mamíferos

**Historia:** Darwin necesita encontrar comida para sus cachorros antes del amanecer. Es una carrera contra el tiempo: cada ejercicio correcto le permite buscar en un nuevo lugar del bosque (bajo troncos, entre raíces, junto al río) y encontrar alimento.

**Etapas:**
1. *El despertar* — Darwin sale de su madriguera al anochecer
2. *Los insectos del tronco* — Busca insectos bajo la corteza
3. *Las murtas del camino* — Encuentra frutas nativas
4. *La orilla del río* — Caza junto al agua
5. *De vuelta a casa* — Llega con comida para sus cachorros

**Nivel matemático:** Suma con carry (10-99) — Valor posicional (unidad/decena)
**Dato que desbloquea:** "El zorrito chilote fue descubierto por Charles Darwin cuando visitó Chiloé en 1834. ¡Por eso le pusimos Darwin! Es el zorro más pequeño de Chile."

**Estado de conservación real:** En peligro (EN). Solo quedan poblaciones en Chiloé y Nahuelbuta. Principal amenaza: perros domésticos y pérdida de hábitat.

---

### 🐒 Capítulo 4: Momo el Monito del Monte
**Animal:** Monito del monte (*Dromiciops gliroides*) — marsupial "fósil viviente"

**Perfil:**
- Nombre: Momo
- Personalidad: Dormilón, dulce, un poco despistado. Le encanta trepar y comer frutas
- Tamaño real: Cabe en la palma de una mano (20-42 gramos). Ojos negros saltones, cola prensil, anillos negros alrededor de los ojos
- Dato clave: Es el marsupial más austral del mundo y un "fósil viviente" — su linaje conecta a los marsupiales de Sudamérica con los de Australia. En Chiloé se le llama "chumaihuén" o "perrito de virtud". Es el único dispersor de semillas del quintral, una planta que depende completamente de él para reproducirse. En invierno hiberna en grupos de hasta 9 individuos para darse calor

**Historia:** Momo se quedó dormido (hibernó más de la cuenta) y cuando despertó, su árbol favorito de quintrales no tiene frutos. Necesita recorrer el bosque plantando semillas para que el quintral vuelva a crecer. Cada ejercicio correcto = una semilla plantada.

**Etapas:**
1. *El despertar* — Momo sale de su nido de musgo después de hibernar
2. *El árbol vacío* — Descubre que no hay quintrales
3. *Semillas en el sendero* — Comienza a dispersar semillas trepando de árbol en árbol
4. *El bosque renace* — Las plantas comienzan a brotar
5. *El festín* — El quintral florece y Momo come feliz

**Nivel matemático:** Resta con borrow (10-99) — Reagrupación
**Dato que desbloquea:** "El monito del monte es pariente lejano de los canguros de Australia. ¡Tiene una bolsita (marsupio) como ellos! Y sin él, el quintral no podría existir."

**Estado de conservación real:** Casi amenazado (NT). Amenazado por deforestación e incendios.

---

### 🐱 Capítulo 5: Luna la Güiña
**Animal:** Güiña o Gato Colo (*Leopardus guigna*) — el felino más pequeño de América

**Perfil:**
- Nombre: Luna
- Personalidad: Sigilosa, valiente, protectora. Cazadora nocturna que cuida su territorio con fiereza a pesar de su pequeño tamaño
- Tamaño real: 37-51 cm de largo, 2-3 kg. La mitad de un gato doméstico. Pelaje café con manchas negras redondas. Algunos son completamente negros (melánicos)
- Dato clave: Su nombre viene del mapudungún "wiña" (cambio de morada). Es un excelente trepador que pasa mucho tiempo en las copas de los árboles. En Chiloé son relativamente comunes pero muy difíciles de ver por sus hábitos nocturnos. Cumple un rol crucial como controlador de roedores

**Historia:** Luna necesita proteger a su cría, encontrándole un nuevo hogar seguro en el bosque después de que su árbol fue cortado. Alicia la ayuda a explorar el bosque de noche, buscando el refugio perfecto.

**Etapas:**
1. *La noche cae* — Luna sale con su cría al anochecer
2. *El bosque de coigües* — Explora las copas de los árboles
3. *El peligro* — Evita a un zorro culpeo (su depredador)
4. *El tronco perfecto* — Encuentra un viejo coigüe con una cavidad protegida
5. *El nuevo hogar* — Luna y su cría se instalan a salvo

**Nivel matemático:** Mixto sumas y restas (10-99) — Elección de estrategia
**Dato que desbloquea:** "La güiña es como un leopardo miniatura. ¡Es el gato salvaje más chiquito de toda América! En Chiloé vive escondida en los árboles y casi nadie la ve."

**Estado de conservación real:** Vulnerable (VU). Amenazada por gatos domésticos (transmiten enfermedades), pérdida de bosque y atropellos.

---

### 🐟 Capítulo 6: El Viejo del Mar (Chungungo)
**Animal:** Chungungo o nutria marina (*Lontra felina*) — la nutria más pequeña del mundo

**Perfil:**
- Nombre: Neptuno
- Personalidad: Juguetón, acuático, sociable. Le encanta flotar de espaldas y jugar con piedras
- Tamaño real: 83-115 cm, pelaje denso e impermeable, patas palmeadas
- Dato clave: Habita las costas rocosas de Chiloé. A diferencia de otras nutrias, es estrictamente marina. Usa piedras como herramientas para abrir erizos y mariscos

**Historia:** Neptuno necesita enseñar a nadar a sus crías en las aguas frías del Pacífico chilote. Cada ejercicio correcto es una lección de natación.

**Etapas:**
1. *La poza de las rocas* — Primeras lecciones en aguas calmas
2. *Las olas pequeñas* — Se aventuran más allá de las rocas
3. *Buscando erizos* — Aprenden a bucear por comida
4. *La corriente* — Nadan contra la corriente juntos
5. *Mar abierto* — Las crías nadan libremente

**Nivel matemático:** Sumas y restas de 3 dígitos (100-999) — Extensión del valor posicional
**Dato que desbloquea:** "El chungungo es la nutria de mar más chiquita del mundo. Vive en las rocas de la costa de Chiloé y usa piedras para romper erizos. ¡Es muy inteligente!"

**Estado de conservación real:** En peligro (EN). Amenazado por contaminación, pesca y destrucción costera.

---

### Personajes futuros (post-MVP)

| Animal | Nombre | Historia | Materia |
|--------|--------|----------|---------|
| Ranita de Darwin | Renata | Busca un charco seguro para sus crías | Multiplicación |
| Huillín (nutria de río) | Hugo | Reconstruye su madriguera junto al río | Geometría básica |
| Cisne de cuello negro | Celeste | Migra a través de los humedales | Lectoescritura |
| Comadrejita trompuda | Trompita | Recorre el bosque oliendo plantas medicinales | Ciencias naturales |
| Pingüino de Humboldt | Polo | Navega las corrientes marinas | Inglés básico |

---

## 6. Principios de Diseño

| Principio | Descripción |
|-----------|-------------|
| **Pensar > Memorizar** | Priorizar comprensión sobre repetición mecánica. Los ejercicios deben exigir razonar, no solo calcular |
| **Andamiaje progresivo** | Cada nivel introduce un pequeño salto cognitivo. Nunca frustrar, siempre desafiar |
| **Voz como compañía** | La voz motiva, da pistas y celebra. No juzga, no castiga |
| **Gamificación con propósito** | Estrellas, streaks y recompensas están atados al esfuerzo y progreso, no solo a respuestas correctas |
| **Naturaleza como universo** | Los animales no son decorativos: los ejercicios se integran en narrativas reales del bosque chilote |
| **Educación ambiental** | Cada capítulo enseña datos reales sobre fauna nativa y conservación |

---

## 7. Funcionalidades Core (MVP)

### 7.1 Motor de Ejercicios Matemáticos

#### Formato vertical (como en el cuaderno)
Los ejercicios de suma y resta se presentan en formato vertical, replicando lo que Alicia ve en clases. Ingresa dígito por dígito, de derecha a izquierda, incluyendo el manejo del "me llevo" (carry/borrow).

#### Tipos de ejercicios por nivel

| Nivel | Capítulo | Operación | Rango | Habilidad clave |
|-------|----------|-----------|-------|-----------------|
| 1 | Pascual el Pudú | Suma sin carry | 1-20 | Composición de números |
| 2 | Berta y Bruno | Resta sin borrow | 1-20 | Descomposición de números |
| 3 | Darwin el Zorrito | Suma con carry | 10-99 | Valor posicional |
| 4 | Momo el Monito | Resta con borrow | 10-99 | Reagrupación |
| 5 | Luna la Güiña | Mixto | 10-99 | Elección de estrategia |
| 6 | Neptuno el Chungungo | Sumas/restas 3 dígitos | 100-999 | Extensión valor posicional |

#### Ejercicios de pensamiento matemático
Intercalados con la práctica de operaciones (ratio 70/30), estos ejercicios desarrollan comprensión numérica:

- **Número misterioso:** "Soy un número. Si me sumas 5, obtienes 12. ¿Quién soy?" (contextualizado: "Pascual dio 5 pasos y ahora está en el paso 12. ¿En qué paso empezó?")
- **Completa la operación:** 7 + ___ = 15
- **Mayor/menor/igual:** Comparar dos expresiones sin resolverlas (ej: 8+3 vs 6+4)
- **Estimación:** "¿23 + 18 está más cerca de 30, 40 o 50?"
- **Descomposición:** "Muestra dos formas distintas de sumar para llegar a 25"
- **Problemas con contexto:** "Darwin encontró 8 insectos bajo un tronco y 5 junto al río. ¿Cuántos encontró en total?"

### 7.2 Sistema de Voz

Web Speech API (o fallback a ElevenLabs) para voz en español con tono infantil y amigable:

- **Bienvenida:** "¡Hola Alicia! Tus amigos del bosque te necesitan hoy"
- **Introducción de capítulo:** El animal se presenta y pide ayuda
- **Lectura de enunciados:** Lee el problema en voz alta
- **Pistas progresivas** (ver abajo)
- **Celebración:** "¡Genial! ¡Pascual avanzó otro paso!" con variedad
- **Ánimo tras error:** "Casi, intenta de nuevo. Piensa con calma"
- **Datos curiosos:** Lee los datos desbloqueados al completar etapas
- **Control parental:** Volumen y activación/desactivación

#### Sistema de pistas progresivas
Ante un error, andamiaje incremental en lugar de mostrar la respuesta:

1. **Pista 1 (motivacional):** "Piensa con calma, tú puedes. [Animal] confía en ti"
2. **Pista 2 (estratégica):** "Prueba separar el número en decenas y unidades"
3. **Pista 3 (visual):** Aparece representación con bloques o dedos animados
4. **Pista 4 (resolución guiada):** La app resuelve paso a paso con ella

### 7.3 Gamificación

#### Sistema del Sendero
Cada capítulo es un sendero visual del bosque chilote con 5 etapas. Al resolver ejercicios, el animal avanza por el camino. El progreso es visual y emocional — Alicia ve al animal acercándose a su objetivo.

#### Sistema de recompensas
- **Huellas:** 1-3 huellas por ejercicio según intentos (3 = primer intento correcto)
- **Insignia de Guardiana:** Al completar el capítulo de un animal
- **Datos curiosos:** Se desbloquean al completar etapas (educación ambiental)
- **Streak:** Racha de días consecutivos practicando (animales celebrando)
- **El Refugio:** Colección de todos los animales ayudados (como un álbum viviente)
- **Logros especiales:** "Pensé sin dedos", "5 seguidas correctas", "Usé una estrategia nueva"

### 7.4 Dashboard Parental
- Resumen diario/semanal de ejercicios completados
- Tasa de aciertos por tipo de ejercicio y por capítulo
- Tiempo promedio por ejercicio (detectar frustración o falta de atención)
- Ejercicios donde más falla (para reforzar offline)
- Control de dificultad: ajustar rangos numéricos manualmente
- Configuración de sesión: duración máxima, cantidad de ejercicios

---

## 8. Diseño UX/UI

### Estética
- Paleta inspirada en el bosque chilote: verdes profundos, cafés terrosos, azules de río, naranjas de atardecer
- Tipografía redondeada, grande (mínimo 24px para números)
- Ilustraciones estilo acuarela/naturalista pero infantil (no caricatura exagerada)
- Los animales deben verse tiernos pero respetar su apariencia real
- Fondos con paisajes reconocibles de Chiloé: bosque valdiviano, palafitos, costa rocosa, humedales

### Pantallas principales
1. **Home / El Bosque:** Mapa del bosque chilote con los senderos de cada animal. Los completados tienen al animal visible. Los bloqueados aparecen como siluetas
2. **Sendero del capítulo:** Camino con 5 etapas, el animal avanza visualmente
3. **Ejercicio:** Operación vertical centrada + teclado numérico grande + botón pista. El animal aparece al costado con animaciones de reacción
4. **Resultado:** Animación del animal avanzando (o escondiéndose si falla) + huellas ganadas
5. **Dato curioso:** Pantalla de "¿Sabías que...?" con ilustración del animal
6. **El Refugio:** Galería de animales ayudados con sus datos
7. **Dashboard parental:** Acceso con PIN de 4 dígitos

### Interacción con ejercicios verticales
El input replica la experiencia del cuaderno: Alicia toca cada columna (unidades, decenas, centenas) e ingresa el dígito. Si hay carry, aparece visualmente un "1" pequeño arriba de la siguiente columna, exactamente como en el papel.

---

## 9. Algoritmo Adaptativo

- 3 ejercicios correctos consecutivos del mismo tipo: sube de nivel
- 2 errores consecutivos: baja un nivel o reduce el rango numérico
- Mezcla 70% práctica operacional + 30% pensamiento matemático
- Repaso espaciado: ejercicios de niveles anteriores aparecen periódicamente
- Detección de patrones de error: si falla consistentemente en carry, genera más ejercicios de ese tipo
- Los animales reaccionan emocionalmente al rendimiento (animados cuando va bien, preocupados pero nunca tristes cuando falla)

---

## 10. Arquitectura Técnica

| Componente | Tecnología |
|-----------|-----------|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend / DB | Supabase (Auth, Postgres, Edge Functions) |
| Voz | Web Speech API (SpeechSynthesis) + fallback ElevenLabs |
| State | Zustand o React Context |
| Animaciones | Framer Motion / Lottie |
| Ilustraciones | SVG animados (los animales) |
| Deploy | Vercel |
| Mobile (futuro) | Capacitor (wrap a nativo con push notifications) |

### Modelo de datos clave

```
users: id, name, role (child/parent), avatar, created_at
chapters: id, animal_name, difficulty_level, order, description
stages: id, chapter_id, order, title, description, exercises_required
sessions: id, user_id, chapter_id, started_at, ended_at
exercises: id, session_id, type, operation, difficulty_level, numbers,
           correct_answer, user_answer, attempts, hints_used,
           time_seconds, paws_earned
progress: id, user_id, chapter_id, current_stage, completed,
          total_paws, facts_unlocked[]
achievements: id, user_id, type, unlocked_at
settings: user_id, voice_enabled, max_session_minutes,
          difficulty_override
```

---

## 11. Roadmap

### Fase 1: MVP — Pascual y las Bandurrias (4-6 semanas)
- Capítulos 1 y 2 (Pudú + Bandurrias) completos con narrativa
- Suma y resta vertical sin carry/borrow (niveles 1-2)
- Sistema de voz básico (Web Speech API)
- Sendero visual con avance del animal
- Gamificación: huellas + insignias
- Dashboard parental básico
- El Refugio con 2 animales

### Fase 2: Pensamiento y Nuevos Amigos (4 semanas)
- Capítulos 3 y 4 (Zorrito Darwin + Monito Momo)
- Suma con carry + resta con borrow (niveles 3-4)
- Ejercicios de pensamiento matemático
- Algoritmo adaptativo completo
- Pistas progresivas con visualización
- Datos curiosos desbloqueables

### Fase 3: Completar el Bosque (4 semanas)
- Capítulos 5 y 6 (Güiña Luna + Chungungo Neptuno)
- Nivel mixto + 3 dígitos (niveles 5-6)
- Mapa del bosque completo
- Voz mejorada (ElevenLabs para voz más natural)
- Animaciones pulidas

### Fase 4: Expansión (8 semanas)
- Nuevos animales para nuevas materias (multiplicación, lectoescritura)
- App nativa vía Capacitor
- Modo offline básico
- Perfiles múltiples

### Fase 5: Plataforma (futuro)
- Más materias: ciencias, inglés
- Modo colaborativo
- Generación de ejercicios con IA
- Apertura a otros colegios/familias

---

## 12. Métricas de Éxito

| Métrica | Objetivo | Plazo |
|---------|----------|-------|
| Alicia completa sesión sin frustración | >80% de sesiones | Semana 2 |
| Reduce uso de dedos | 50% menos | Mes 1 |
| Ejercicios correctos al primer intento | >60% | Mes 1 |
| Sesión promedio | 10-15 min/día | Semana 1 |
| Pide jugar espontáneamente | >3 veces/semana | Mes 1 |
| Avanza a nivel 4 (carry/borrow) | Completado | Mes 2 |
| Puede nombrar 3+ animales nativos de Chiloé | Sí | Mes 1 |

---

## 13. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Voz sintética suena robótica | Pierde interés | Probar voces es-CL en Web Speech API; fallback ElevenLabs |
| Alicia se aburre rápido | Abandono | Variedad de animales y narrativas, sesiones cortas |
| Frustración por dificultad | Rechazo | Algoritmo adaptativo + pistas progresivas + celebrar esfuerzo |
| Animales no le gustan | Desconexión emocional | Validar los primeros 2 personajes con Alicia antes de construir más |
| Ilustraciones caras/lentas | Retraso | MVP con ilustraciones simples SVG, iterar después |
| Dependencia de internet | No puede usar offline | Service worker para cache básico en Fase 4 |

---

## 14. Fuera de Alcance (MVP)

- Multiplicación y división
- Otras materias
- Multi-idioma
- App nativa
- Modo multijugador
- Integración con colegios
- Monetización
- Flora (solo fauna en MVP)
