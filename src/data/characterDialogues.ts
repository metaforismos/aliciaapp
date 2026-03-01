// Character dialogue system implementing the narrative engine.
// Golden rule: no omniscient narrator — every line is spoken by a character in first person.

import type { AnimalAnimationState } from '../components/animals/types';

// ────────────────────────────────────────────
// Voice configs per character (TTS rate/pitch)
// ────────────────────────────────────────────

export interface VoiceConfig {
  rate: number;
  pitch: number;
}

export const CHARACTER_VOICE_CONFIGS: Record<string, VoiceConfig> = {
  pascual:  { rate: 0.85, pitch: 1.3 },   // Timid, high-pitched, slow
  'berta-bruno': { rate: 1.0, pitch: 1.1 }, // Fast, expressive
  darwin:   { rate: 0.9,  pitch: 1.0 },   // Firm, confident
  momo:     { rate: 0.75, pitch: 1.2 },   // Sleepy, soft
  luna:     { rate: 0.8,  pitch: 1.0 },   // Low, whispery
  neptuno:  { rate: 1.0,  pitch: 1.15 },  // Fast, bubbly
  alicia:   { rate: 0.9,  pitch: 1.2 },   // Natural girl voice
};

// ────────────────────────────────────────────
// Dialogue line structure
// ────────────────────────────────────────────

export interface DialogueLine {
  text: string;
  speaker: string;         // Character name displayed in the bubble
  emotion: AnimalAnimationState;
  voiceConfig?: VoiceConfig;
}

export type DialogueCategory =
  | 'greeting'
  | 'correct'
  | 'incorrect'
  | 'hint1'
  | 'hint2'
  | 'hint3'
  | 'hint4'
  | 'stageComplete'
  | 'chapterComplete';

// ────────────────────────────────────────────
// Per-character dialogue banks
// ────────────────────────────────────────────

interface CharacterDialogueBank {
  greeting: DialogueLine[];
  correct: DialogueLine[];
  incorrect: DialogueLine[];
  hint1: DialogueLine[];
  hint2: DialogueLine[];
  hint3: DialogueLine[];
  hint4: DialogueLine[];  // hint4 uses {min}, {max}, {nearAnswer} placeholders
  stageComplete: DialogueLine[];
  chapterComplete: DialogueLine[];
}

function line(text: string, speaker: string, emotion: AnimalAnimationState = 'idle'): DialogueLine {
  return { text, speaker, emotion };
}

// ── Pascual el Pudu (Chapter 1) ─────────────

const pascual: CharacterDialogueBank = {
  greeting: [
    line('¡A-Alicia! ¡Viniste! Yo... es que me perdí y está muy oscuro aquí...', 'Pascual', 'hiding'),
    line('¡H-hola! Soy Pascual... perdón, es que soy un poco tímido.', 'Pascual', 'idle'),
    line('¡Alicia! Menos mal que llegaste... me da un poquito de susto este bosque de noche.', 'Pascual', 'worried'),
    line('¡Oh! ¿Eres Alicia? Me dijeron que eres muy valiente. Yo... yo no tanto, pero contigo me siento más seguro.', 'Pascual', 'idle'),
  ],
  correct: [
    line('¡Sí, sí, sí! ¡Esa era! *asoma la nariz entre los helechos* ¡Eres muy lista!', 'Pascual', 'celebrating'),
    line('¡Lo hiciste, Alicia! ¡Sabía que podías! *salta entre los helechos*', 'Pascual', 'celebrating'),
    line('¡Woow! ¡Correcto! Oye, eres mucho más inteligente que yo. Yo me confundo hasta contando mis patitas.', 'Pascual', 'celebrating'),
    line('¡Esa era! ¡Esa era! *da saltitos tímidos* ¡Gracias, Alicia!', 'Pascual', 'celebrating'),
    line('¡Sííí! ¡Ahora puedo avanzar un poquito más! Contigo no me da tanto miedo.', 'Pascual', 'celebrating'),
    line('¡Perfecto! ¿Sabías que me pongo tan feliz que me tiemblan las orejitas? Mira...', 'Pascual', 'celebrating'),
    line('¡Bien, bien, bien! *se esconde y asoma la nariz* ¡Perdón, es que me emociono y me escondo!', 'Pascual', 'celebrating'),
  ],
  incorrect: [
    line('Mmm, esa no era... ¡pero no te preocupes! A mí me cuesta hasta caminar sin tropezarme, jiji.', 'Pascual', 'worried'),
    line('No te preocupes, Alicia. Yo me pierdo todos los días y siempre encuentro el camino al final.', 'Pascual', 'worried'),
    line('Uy, esa era difícil... Pero oye, ¡tú puedes! Si yo puedo cruzar un arroyo siendo tan chiquitito, tú puedes con esto.', 'Pascual', 'hiding'),
    line('No era esa, pero... ¿intentamos de nuevo? Yo te espero, no me voy a ningún lado. Bueno, porque estoy perdido, pero igual te espero.', 'Pascual', 'worried'),
    line('Mmm, casi... ¡Pero eso está bien! Mi mamá dice que equivocarse es parte de aprender. Dale de nuevo, Alicia.', 'Pascual', 'idle'),
    line('¡Ups! Esa no era... Pero sabes qué, yo una vez me caí en una poza y salí nadando. ¡Siempre se puede intentar de nuevo!', 'Pascual', 'hiding'),
    line('No te rindas, Alicia. Yo creo en ti. ...Es que eres la única persona que conozco, pero ¡creo mucho en ti!', 'Pascual', 'worried'),
  ],
  hint1: [
    line('Oye Alicia, ¿y si pruebas contando con los deditos? A mí me funciona con las hojas del bosque.', 'Pascual', 'idle'),
    line('¿Sabías que yo cuento los pasos cuando camino? Empieza desde el número más grande y cuenta desde ahí.', 'Pascual', 'idle'),
    line('Mmm... ¿y si piensas en bolitas? Como las frutitas que como yo. Junta los dos grupos en tu cabeza.', 'Pascual', 'idle'),
  ],
  hint2: [
    line('Mira, Alicia: primero fíjate en los numeritos de la derecha, los chiquititos. Como yo, que soy chiquitito pero importante.', 'Pascual', 'idle'),
    line('Mi mamá me enseñó: separa las decenas de las unidades. ¡Así todo es más fácil!', 'Pascual', 'idle'),
    line('Oye, recuerda que 10 unidades son 1 decena. Como 10 hojas hacen un ramito.', 'Pascual', 'idle'),
  ],
  hint3: [
    line('¡Oye! Cuando las unidades suman más de 9, hay que llevar una decena. Como cuando llevo muchas hojas y se me caen y tengo que juntarlas de nuevo.', 'Pascual', 'worried'),
    line('Empieza por la derecha, Alicia. Primero las unidades, después las decenas. Pasito a pasito, como camino yo.', 'Pascual', 'idle'),
  ],
  hint4: [
    line('Mira bien, Alicia... yo creo que la respuesta está entre {min} y {max}. ¿Probamos?', 'Pascual', 'idle'),
    line('Te doy una pista grande: ¡el resultado está cerquita de {nearAnswer}! ...Perdón, es que quiero ayudar.', 'Pascual', 'worried'),
  ],
  stageComplete: [
    line('¡Alicia, mira! ¡Puedo ver un poquito más del camino! ¿Seguimos juntos? ...¿sí?', 'Pascual', 'celebrating'),
    line('¡Lo logramos! Bueno, lo lograste tú. Yo solo te miraba con admiración. ¡Pero ayudé moralmente!', 'Pascual', 'celebrating'),
    line('¡Avanzamos! Oye, ¿te cuento algo del bosque? *se acerca tímidamente*', 'Pascual', 'celebrating'),
  ],
  chapterComplete: [
    line('¡Alicia! ¡Ahí está mi mamá! *corre y se tropieza* ¡Gracias, gracias, gracias! Sin ti no habría llegado nunca. Eres mi mejor amiga.', 'Pascual', 'celebrating'),
    line('¡Lo logramos, Alicia! ¡Estoy en casa! *se frota contra tu pierna* Nunca te voy a olvidar...', 'Pascual', 'celebrating'),
  ],
};

// ── Berta y Bruno las Bandurrias (Chapter 2) ─

const bertaBruno: CharacterDialogueBank = {
  greeting: [
    line('¡ALICIA! ¡Por fin! ¡La tormenta nos separó y no encuentro a Bruno! ¡Ayúdame, porfa!', 'Berta', 'worried'),
    line('¡¡Berta!! ¿Eres tú? ¡¡Estoy aquí!! ...¿Dónde es aquí? ¡ALICIA, AYUDA!', 'Bruno', 'hiding'),
    line('¡Alicia! ¡Qué bueno que llegaste! ¡Bruno se perdió y yo no puedo encontrarlo sola! ¡BRUNOOO!', 'Berta', 'worried'),
  ],
  correct: [
    line('¡ESO! ¡Sabía que Alicia podía! ¡Bruno, escuchaste? ¡ALICIA ES LA MEJOR!', 'Berta', 'celebrating'),
    line('¡Sí, sí! ¡Es la mejor! ¡Hagamos bulla para celebrar! ¡CRAAA!', 'Bruno', 'celebrating'),
    line('¡Excelente! ¡Estamos más cerca! ¡BRUNOOO, YA VAMOS!', 'Berta', 'celebrating'),
    line('¡Bravísimo! ¡Alicia, eres más inteligente que todas las bandurrias del humedal juntas!', 'Berta', 'celebrating'),
    line('¡Wow! ¡Correcto! Oye Berta, ¿escuchaste? ¡CORRECTO! ¡CRAAA CRAAA!', 'Bruno', 'celebrating'),
    line('¡SÍÍÍÍ! *aletea como loca* ¡Perdón, es que me emociono! ¡DALE, OTRA MÁS!', 'Berta', 'celebrating'),
    line('¡LO HICISTE! ¡Berta va a estar tan contenta! Bueno, yo también. ¡TODOS CONTENTOS! ¡CRAAA!', 'Bruno', 'celebrating'),
  ],
  incorrect: [
    line('¡No era esa, pero tranquila! A Bruno le toma como diez intentos encontrar comida y míralo, sigue vivo.', 'Berta', 'idle'),
    line('¡Oye! ...bueno, es verdad. ¡Pero tú puedes, Alicia! ¡Yo creo en ti! ¡CRAAAA!', 'Bruno', 'worried'),
    line('Mmm, no era. ¡Pero no importa! ¿Sabías que una vez Bruno se perdió tres días? Y aquí está. ¡Inténtalo de nuevo!', 'Berta', 'idle'),
    line('¡Casi! ¡Estás re cerca! A mí me costó como seis intentos aprender a volar. ¡TÚ PUEDES!', 'Bruno', 'worried'),
    line('Esa no era, pero ¡ánimo! Nosotras las bandurrias nunca nos rendimos. ¡VAMOS DE NUEVO!', 'Berta', 'idle'),
  ],
  hint1: [
    line('¡Oye, prueba contando con los dedos! Yo no tengo dedos pero ¡cuento con las plumas! ¡CRAAA!', 'Berta', 'idle'),
    line('Empieza desde el número más grande. Como cuando vuelo: siempre parto de lo más alto. ¡Es más fácil!', 'Bruno', 'idle'),
  ],
  hint2: [
    line('¡Mira las unidades primero! El numerito de la derecha. ¡Como mirar el humedal desde arriba!', 'Berta', 'idle'),
    line('Separa decenas y unidades, Alicia. ¡Como separar los insectos de las lombrices en el almuerzo!', 'Bruno', 'idle'),
  ],
  hint3: [
    line('¡OJO! Si restando el de arriba es más chiquitito, hay que pedirle prestado al vecino. ¡Como cuando Bruno me pide comida!', 'Berta', 'idle'),
    line('¡Empieza por la derecha! Primero unidades, luego decenas. Paso a paso, como caminamos en el barro.', 'Bruno', 'idle'),
  ],
  hint4: [
    line('¡Pista GIGANTE! La respuesta está entre {min} y {max}. ¡DALE QUE TÚ PUEDES! ¡CRAAA!', 'Berta', 'idle'),
    line('Oye Alicia, yo creo que el resultado está cerquita de {nearAnswer}... ¡Berta no me deja decir más!', 'Bruno', 'worried'),
  ],
  stageComplete: [
    line('¡ETAPA LISTA! ¡Estamos más cerca de Bruno! ¡BRUNOOO, YA VAMOOOOS!', 'Berta', 'celebrating'),
    line('¡Alicia, eres increíble! ¡Espera que te cuento algo genial de las bandurrias!', 'Berta', 'celebrating'),
  ],
  chapterComplete: [
    line('¡BRUNOOO! *se abrazan con las alas* ¡Alicia nos reunió! ¡Eres la mejor amiga del mundo! ¡CRAAA CRAAA!', 'Berta', 'celebrating'),
    line('¡BERTAAA! ¡Te extrañé tanto! ¡Gracias Alicia! ¡Nunca te vamos a olvidar! ¡CRAAA!', 'Bruno', 'celebrating'),
  ],
};

// ── Darwin el Zorrito (Chapter 3) ───────────

const darwin: CharacterDialogueBank = {
  greeting: [
    line('¡Alicia! Justo la exploradora que necesitaba. Tengo hambre y el bosque es grande. ¿Vamos?', 'Darwin', 'idle'),
    line('¡Bienvenida a mi territorio! Soy Darwin, el zorro más valiente de Chiloé. Bueno, el único que se atreve a presentarse.', 'Darwin', 'idle'),
    line('¡Ah, por fin alguien que sabe de números! Yo soy más de olfato, pero hoy necesito tu cerebro. ¿Lista?', 'Darwin', 'idle'),
  ],
  correct: [
    line('¡Excelente cálculo! Según mis observaciones, eres tan inteligente como Charles Darwin. Bueno, casi.', 'Darwin', 'celebrating'),
    line('¡Mira eso! ¡Perfecto! Un buen explorador siempre tiene una amiga lista como tú.', 'Darwin', 'celebrating'),
    line('¡Correcto! *levanta la cola orgulloso* Yo sabía que ibas a poder. Bueno, tenía un 87% de confianza.', 'Darwin', 'celebrating'),
    line('¡Impresionante! Según mis cálculos, llevas una racha increíble. ¡Sigue así, exploradora!', 'Darwin', 'celebrating'),
    line('¡Eso es! ¡Otro paso más cerca del desayuno! Digo, de la aventura. Pero también del desayuno.', 'Darwin', 'celebrating'),
    line('¡Brillante! Charles Darwin estaría orgulloso. Y yo también. Sobre todo yo.', 'Darwin', 'celebrating'),
    line('¡JA! ¡Lo sabía! Oye Alicia, tú y yo somos el mejor equipo del bosque.', 'Darwin', 'celebrating'),
  ],
  incorrect: [
    line('Hmm, no era esa. Pero un buen explorador nunca se rinde con el primer intento. ¡Yo una vez me perdí tres días y aquí estoy!', 'Darwin', 'idle'),
    line('No te preocupes. Según mis observaciones, los mejores descubrimientos vienen después de muchos intentos fallidos.', 'Darwin', 'worried'),
    line('Esa no era, pero ¡ánimo! ¿Sabías que Charles Darwin se equivocó muchas veces antes de descubrirme? La ciencia es así.', 'Darwin', 'idle'),
    line('Hmm, necesitamos recalcular la ruta. ¡Pero tranquila! Un explorador siempre tiene un plan B. Y C. Y D.', 'Darwin', 'idle'),
    line('No era esa. Pero oye, yo choqué con una rama hace un rato y nadie me vio. Los errores pasan. ¡De nuevo!', 'Darwin', 'worried'),
  ],
  hint1: [
    line('Mira, Alicia: un explorador siempre empieza por lo que sabe. ¿Qué número conoces seguro?', 'Darwin', 'idle'),
    line('Usa tus dedos como herramientas. Yo uso mi nariz, tú usa tus manos. ¡Cada explorador con lo suyo!', 'Darwin', 'idle'),
  ],
  hint2: [
    line('Según mis cálculos, conviene empezar por las unidades. El numerito de la derecha. Paso uno de todo buen plan.', 'Darwin', 'idle'),
    line('Separa el problema en partes. Decenas por un lado, unidades por otro. ¡Divide y vencerás!', 'Darwin', 'idle'),
  ],
  hint3: [
    line('¡Atención! Cuando sumas y las unidades pasan de 9, llevas una decena. Es como cuando llevo tanta comida que se me cae y tengo que reorganizar.', 'Darwin', 'idle'),
    line('Empieza por la derecha, siempre. Unidades, decenas, centenas. Orden y método, como un verdadero explorador.', 'Darwin', 'idle'),
  ],
  hint4: [
    line('Pista de explorador: la respuesta está entre {min} y {max}. ¡Confío en tu instinto!', 'Darwin', 'idle'),
    line('Te doy un dato: el resultado está muy cerquita de {nearAnswer}. Según mis cálculos, ¡estás casi!', 'Darwin', 'idle'),
  ],
  stageComplete: [
    line('¡Excelente expedición! Según mi mapa, estamos avanzando perfecto. ¿Te cuento algo del bosque?', 'Darwin', 'celebrating'),
    line('¡Etapa superada! *se sacude el pelaje orgulloso* Yo sabía que este equipo iba a funcionar.', 'Darwin', 'celebrating'),
  ],
  chapterComplete: [
    line('¡Alicia, hoy fue la mejor aventura de mi vida! Bueno, después de cuando Charles Darwin me descubrió. ¡Gracias, exploradora!', 'Darwin', 'celebrating'),
    line('*se sienta y mira el atardecer* Sabes, Alicia... no todos los días se encuentra una amiga así. Vuelve cuando quieras. El bosque siempre te va a recibir.', 'Darwin', 'celebrating'),
  ],
};

// ── Momo el Monito del Monte (Chapter 4) ────

const momo: CharacterDialogueBank = {
  greeting: [
    line('Mmm... *bostezo* ...¿Alicia? Ah, hola... Recién desperté del invierno y... tengo muuucha hambre...', 'Momo', 'idle'),
    line('*bostezo largo* ...Hola... ¿Tú eres Alicia? Me contaron que eres muy buena con los números... Yo solo sé contar frutitas... y dormirme.', 'Momo', 'idle'),
    line('Mmm... cinco minutitos más... Ah, ¿Alicia? ¡Perdón! Es que dormir es lo que mejor hago. ¿Me ayudas a buscar comida?', 'Momo', 'idle'),
  ],
  correct: [
    line('*abre los ojos grandes* ¡Esa era! ¡Ahora sí puedo buscar mis frutitas! ...después de una siestita.', 'Momo', 'celebrating'),
    line('Mmm, qué rico... digo, ¡qué bien! ¡Correcto! Oye, eres más despierta que yo. Bueno, eso no es difícil.', 'Momo', 'celebrating'),
    line('¡Sí! *bosteza de alegría* ¡Esa era! Estoy tan feliz que casi se me quita el sueño. Casi.', 'Momo', 'celebrating'),
    line('¡Wow! ¡Correcto! Eres como un sueño hecho realidad, Alicia. Hablando de sueños... no, no, ¡sigamos!', 'Momo', 'celebrating'),
    line('*se enrolla en una ramita de felicidad* ¡Lo hiciste! Eres la mejor amiga que un monito dormilón puede tener.', 'Momo', 'celebrating'),
    line('Mmm... ¡perfecto! Esto merece una celebración. ¿Frutitas para todos? Bueno, primero encontrémoslas.', 'Momo', 'celebrating'),
    line('¡Bien! *bostezo* Perdón, no es aburrimiento, ¡es emoción! Yo bostezo cuando estoy contento.', 'Momo', 'celebrating'),
  ],
  incorrect: [
    line('No te preocupes, Alicia... yo me equivoco de rama todo el tiempo cuando tengo sueño. Intenta de nuevo con calma...', 'Momo', 'worried'),
    line('Mmm, esa no era... Pero sabes, cuando sueño, a veces las respuestas me llegan solitas. Respira hondo y piénsalo despacito.', 'Momo', 'worried'),
    line('No era esa... *bostezo* ...pero todo bien. Roma no se construyó en una siesta. Digo, en un día.', 'Momo', 'idle'),
    line('Ups... Pero no te rindas, Alicia. Yo me caí de una rama ayer y aquí sigo. ¡Las caídas nos hacen más fuertes!', 'Momo', 'worried'),
    line('Mmm, casi... Cierra los ojitos un segundito y piensa con calma. A mí me funciona. Bueno, a veces me quedo dormido, pero eso es otra cosa.', 'Momo', 'idle'),
  ],
  hint1: [
    line('Sabes... cuando no puedo encontrar una fruta, cierro los ojos y pienso despacio. Prueba contar despacito.', 'Momo', 'idle'),
    line('Mmm... ¿y si cuentas con los deditos? Yo cuento con mi colita cuando puedo... *bostezo*', 'Momo', 'idle'),
  ],
  hint2: [
    line('Fíjate en las unidades primero... los numeritos chiquititos de la derecha. Como las frutitas chiquititas que son las más ricas.', 'Momo', 'idle'),
    line('Separa todo en partecitas... decenas y unidades... como separar las frutitas maduras de las verdes... *bostezo*', 'Momo', 'idle'),
  ],
  hint3: [
    line('Oye... si las unidades suman más de 9, hay que llevar una decena. Es como cuando mi bolsita de frutitas se llena y tengo que empezar otra.', 'Momo', 'idle'),
    line('Empieza por la derecha... pasito a pasito... como trepo yo de noche por las ramitas... despacito pero seguro.', 'Momo', 'idle'),
  ],
  hint4: [
    line('*susurra* Alicia... yo creo que la respuesta está entre {min} y {max}... No le digas a nadie que te ayudé.', 'Momo', 'idle'),
    line('Mmm... estás cerquita de {nearAnswer}... Eso me dijo un pajarito. Bueno, me lo soñé, pero ¡confío en mis sueños!', 'Momo', 'idle'),
  ],
  stageComplete: [
    line('¡Etapa lista! *se estira* Mmm, eso fue cansador. ¿Te cuento algo mientras descanso un poquito?', 'Momo', 'celebrating'),
    line('¡Lo logramos! Bueno, lo lograste tú. Yo solo... *bostezo* ...te observaba con mucho cariño.', 'Momo', 'celebrating'),
  ],
  chapterComplete: [
    line('¡Alicia! ¡Tengo la barriga llena de frutitas! Todo gracias a ti. Eres la mejor... *se queda dormido y despierta* ¡...amiga del mundo!', 'Momo', 'celebrating'),
    line('Mmm... *abrazo dormilón* Gracias, Alicia. Voy a soñar contigo esta noche. Y mañana. Y pasado...', 'Momo', 'celebrating'),
  ],
};

// ── Luna la Guina (Chapter 5) ──────────────

const luna: CharacterDialogueBank = {
  greeting: [
    line('Shh... Alicia. Soy Luna. No te asustes — mis ojos brillan en la noche, pero soy amiga. Necesito encontrar un hogar nuevo.', 'Luna', 'idle'),
    line('...Alicia. Te estaba observando. No te preocupes, observar es lo que hago. Necesito tu ayuda esta noche.', 'Luna', 'idle'),
    line('Buenas noches, Alicia. El bosque es diferente cuando se pone oscuro. Pero no tengas miedo. Yo veo todo.', 'Luna', 'idle'),
  ],
  correct: [
    line('Bien. Muy bien. Tienes ojos de gata nocturna, Alicia — ves lo que otros no ven.', 'Luna', 'celebrating'),
    line('Correcto. Como un salto perfecto entre ramas en la oscuridad. Silencioso y preciso.', 'Luna', 'celebrating'),
    line('Mmm. Impresionante. Pocos tienen esa claridad. Tú sí, Alicia.', 'Luna', 'celebrating'),
    line('Exacto. En la noche hay que ser precisa, y tú lo eres.', 'Luna', 'celebrating'),
    line('Bien hecho. Cada respuesta correcta nos acerca a un hogar seguro. Gracias.', 'Luna', 'celebrating'),
    line('...Perfecto. *parpadeo lento de aprobación* Sigamos, el bosque nos espera.', 'Luna', 'celebrating'),
    line('Correcto. ¿Sabes? En la oscuridad, la certeza vale más que la velocidad. Y tú tienes ambas.', 'Luna', 'celebrating'),
  ],
  incorrect: [
    line('No era esa. Pero en la oscuridad, hay que intentar muchas veces antes de encontrar el camino. Otra vez.', 'Luna', 'idle'),
    line('Mmm, no. Pero escucha: incluso yo fallo un salto de vez en cuando. La noche es paciente. Intenta de nuevo.', 'Luna', 'worried'),
    line('Esa no era. Cierra los ojos un segundo. Abre. Ahora mira de nuevo. Los números a veces se esconden como yo.', 'Luna', 'idle'),
    line('No. Pero no te frustres. La paciencia es la herramienta más poderosa en la noche.', 'Luna', 'idle'),
    line('Incorrecto. Pero sabes qué, Alicia... los mejores cazadores son los que más fallan antes de acertar.', 'Luna', 'worried'),
  ],
  hint1: [
    line('Mira con atención... los números tienen un patrón. Como las huellas en el barro.', 'Luna', 'idle'),
    line('Cuenta despacio, como mis pasos en la noche. Uno. Dos. Tres. Sin apuro.', 'Luna', 'idle'),
  ],
  hint2: [
    line('Fíjate en la derecha primero. Las unidades. Como cuando observo la presa antes de saltar.', 'Luna', 'idle'),
    line('Separa los números. Las sombras se ven mejor cuando las miras por partes.', 'Luna', 'idle'),
  ],
  hint3: [
    line('Cuando las unidades son muchas, una se va para las decenas. Como cuando cambio de rama porque una ya no aguanta.', 'Luna', 'idle'),
    line('Derecha a izquierda. Paso a paso. Como camino yo entre los coigues en la noche oscura.', 'Luna', 'idle'),
  ],
  hint4: [
    line('...La respuesta está entre {min} y {max}. Puedo olerla. Confía en ti.', 'Luna', 'idle'),
    line('Shh. Escucha. El número está cerquita de {nearAnswer}. ¿Lo ves ahora?', 'Luna', 'idle'),
  ],
  stageComplete: [
    line('Bien. Otra etapa en la oscuridad, superada con luz. Te cuento un secreto del bosque...', 'Luna', 'celebrating'),
    line('Avanzamos. El bosque se abre poco a poco. Como mis pupilas en la noche.', 'Luna', 'celebrating'),
  ],
  chapterComplete: [
    line('Alicia... encontré un hogar. Gracias a ti. No voy a olvidarte. Si alguna vez ves dos ojos brillando en el bosque de noche... soy yo, saludándote.', 'Luna', 'celebrating'),
    line('Tengo un lugar seguro ahora. *parpadea lentamente* Eso es lo más valioso que alguien me ha dado. Gracias, Alicia.', 'Luna', 'celebrating'),
  ],
};

// ── Neptuno el Chungungo (Chapter 6) ────────

const neptuno: CharacterDialogueBank = {
  greeting: [
    line('¡SPLASH! ¡Hola Alicia! ¡Soy Neptuno! ¿Te mojé? ¡Perdón! Es que estoy emocionado — ¡hoy vamos a explorar las pozas de roca!', 'Neptuno', 'celebrating'),
    line('¡Alicia! ¡Ven, ven, ven! ¡El mar está increíble hoy! ¡Hay erizos, cangrejos, algas! ¡TODO! ¡Vamos!', 'Neptuno', 'idle'),
    line('¡WOOO! ¡Llegaste! ¡Soy Neptuno y soy el mejor nadador de toda la costa! Bueno, eso digo yo. ¡Vamos al agua!', 'Neptuno', 'celebrating'),
  ],
  correct: [
    line('¡WOOO! ¡Correctísimo! ¡Eso merece un chapuzón de celebración! *se zambulle y salpica*', 'Neptuno', 'celebrating'),
    line('¡SPLASH DE FELICIDAD! ¡Lo hiciste! ¡Alicia, eres como una ola perfecta!', 'Neptuno', 'celebrating'),
    line('¡SÍÍÍÍ! *nada en círculos* ¡Eso fue INCREÍBLE! ¡Como romper un erizo al primer golpe!', 'Neptuno', 'celebrating'),
    line('¡PERFECTO! ¡Alicia, eres más lista que un delfín! Y eso es muuucho decir. ¡SPLASH!', 'Neptuno', 'celebrating'),
    line('¡GENIAL! *se sacude y moja todo* ¡Ups, perdón! ¡Es que estoy tan contento que no me controlo!', 'Neptuno', 'celebrating'),
    line('¡CORRECTO! ¡Como una ola que llega justo donde tiene que llegar! ¡TÚ ERES ESA OLA, ALICIA!', 'Neptuno', 'celebrating'),
    line('¡WOW WOW WOW! *salpica de emoción* ¡Otra más! ¡Eres imparable como la corriente del Pacífico!', 'Neptuno', 'celebrating'),
  ],
  incorrect: [
    line('¡Ups! Esa no era, pero tranqui — yo me caigo de las rocas como diez veces al día y siempre vuelvo a subir. ¡Dale de nuevo!', 'Neptuno', 'idle'),
    line('No era esa, ¡pero no importa! ¿Sabías que para abrir un erizo a veces necesito como veinte golpes? ¡La práctica hace al maestro!', 'Neptuno', 'worried'),
    line('Mmm, no. ¡Pero las olas también se equivocan de roca a veces! ¡Vuélvelo a intentar! ¡VAMOS!', 'Neptuno', 'idle'),
    line('¡Casi! ¡Estás más cerca que un cangrejo de su cueva! ¡Una más y lo sacas! ¡YO SÉ QUE SÍ!', 'Neptuno', 'worried'),
    line('No fue esa, ¡pero ni modo! En el mar aprendes que cada ola trae una nueva oportunidad. ¡SPLASH!', 'Neptuno', 'idle'),
  ],
  hint1: [
    line('Oye, ¿y si lo piensas como contar erizos en la poza? Uno por uno, sin apuro. ¡El mar es paciente!', 'Neptuno', 'idle'),
    line('¡Cuenta con los dedos! Yo cuento con mis patitas mojadas. ¡Empieza desde el número más grande y suma!', 'Neptuno', 'idle'),
  ],
  hint2: [
    line('¡Mira las unidades! El numerito de la derecha. Como contar las algas más cercanas primero. ¡Después las de más lejos!', 'Neptuno', 'idle'),
    line('Separa en decenas y unidades. ¡Como separar los cangrejos grandes de los chiquititos en la poza!', 'Neptuno', 'idle'),
  ],
  hint3: [
    line('¡Ojo! Si las unidades suman más de 9, ¡llevas una decena! Como cuando mi poza se llena y el agua pasa a la siguiente. ¡Splash!', 'Neptuno', 'idle'),
    line('Empieza por la derecha, como las olas que vienen del mar. ¡Unidades, decenas, centenas! ¡En orden!', 'Neptuno', 'idle'),
  ],
  hint4: [
    line('¡Pista de nutria marina! La respuesta está entre {min} y {max}. ¡Estás cerquísima! ¡SPLASH!', 'Neptuno', 'idle'),
    line('Oye oye oye, ¡está cerquita de {nearAnswer}! ¡Como un erizo escondido bajo la roca! ¡Búscalo!', 'Neptuno', 'idle'),
  ],
  stageComplete: [
    line('¡SPLASH SPLASH SPLASH! ¡Etapa terminada! ¿Te cuento algo genial sobre el mar? ¡Ven, ven!', 'Neptuno', 'celebrating'),
    line('¡WOOOO! ¡Otra etapa en el bolsillo! Bueno, yo no tengo bolsillos, pero ¡tú me entiendes! ¡SPLASH!', 'Neptuno', 'celebrating'),
  ],
  chapterComplete: [
    line('¡ALICIA! ¡Fue la mejor aventura marina de toda mi vida! *se zambulle y sale* ¡Vuelve pronto! ¡El mar siempre te va a recibir con un SPLASH!', 'Neptuno', 'celebrating'),
    line('¡Lo logramos! *nada en círculos de felicidad* Oye Alicia, eres la mejor amiga que un chungungo puede tener. ¡SPLASH de despedida!', 'Neptuno', 'celebrating'),
  ],
};

// ── Alicia's internal voice ─────────────────

export const aliciaVoice = {
  chapterSelect: [
    line('Hmm, ¿a quién ayudo hoy? ¡El bosque tiene muchos amigos que me necesitan!', 'Alicia', 'idle'),
    line('¡Mira cuántos animales! ¿Por dónde empiezo? ¡Esto va a ser genial!', 'Alicia', 'idle'),
    line('¡Hola! ¡El bosque de Chiloé me está llamando!', 'Alicia', 'idle'),
  ],
  streak: {
    day2: line('¡Llevo 2 días seguidos! ¡Mis amigos del bosque saben que pueden contar conmigo!', 'Alicia', 'celebrating'),
    day3: line('¡3 días seguidos! ¡Soy re buena para esto, cachai!', 'Alicia', 'celebrating'),
    day5: line('¡5 días seguidos! ¡Soy la mejor exploradora de Chiloé!', 'Alicia', 'celebrating'),
    day7: line('¡Una semana entera! ¡Nadie me para, po!', 'Alicia', 'celebrating'),
  },
  sessionWarning: [
    line('Uf, llevo un buen rato... Quizás debería descansar un poquito.', 'Alicia', 'idle'),
    line('Mmm, me están pesando los ojitos. ¡Mañana sigo con la aventura!', 'Alicia', 'idle'),
  ],
};

// ── Registry: look up dialogue bank by character ID ──

const CHARACTER_DIALOGUES: Record<string, CharacterDialogueBank> = {
  pascual: pascual,
  'berta-bruno': bertaBruno,
  darwin: darwin,
  momo: momo,
  luna: luna,
  neptuno: neptuno,
};

export function getCharacterDialogues(characterId: string): CharacterDialogueBank | undefined {
  return CHARACTER_DIALOGUES[characterId];
}

// ── Helper: get a random dialogue line from a category ──

export interface DialogueLineWithIndex {
  line: DialogueLine;
  index: number;
}

export function getRandomLine(
  characterId: string,
  category: DialogueCategory,
): DialogueLine | undefined {
  const result = getRandomLineWithIndex(characterId, category);
  return result?.line;
}

/**
 * Same as getRandomLine but also returns the index within the category array.
 * The index is used to look up pre-recorded audio files.
 */
export function getRandomLineWithIndex(
  characterId: string,
  category: DialogueCategory,
): DialogueLineWithIndex | undefined {
  const bank = CHARACTER_DIALOGUES[characterId];
  if (!bank) return undefined;

  const lines = bank[category];
  if (!lines || lines.length === 0) return undefined;

  const index = Math.floor(Math.random() * lines.length);
  return { line: lines[index], index };
}

// ── Helper: format dialogue text with placeholders ──

export function formatDialogue(
  line: DialogueLine,
  replacements: Record<string, string>,
): DialogueLine {
  let text = line.text;
  for (const [key, value] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return { ...line, text };
}
