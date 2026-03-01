#!/usr/bin/env node
/**
 * generate-voices.mjs
 *
 * Generates audio files for all character dialogue lines using ElevenLabs API.
 * Outputs MP3 files to public/audio/voices/{characterId}/{category}_{index}.mp3
 * Also generates a manifest at public/audio/voices/manifest.json
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... node scripts/generate-voices.mjs
 *
 * Options:
 *   --dry-run     Print all lines without generating audio
 *   --character X Only generate for character X (e.g. pascual, darwin)
 *   --skip-existing  Skip files that already exist
 *   --list-voices    List available ElevenLabs voices and exit
 */

import { writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'audio', 'voices');

// ────────────────────────────────────────────
// Configuration: Map each character to an ElevenLabs voice ID
//
// Browse voices at: https://elevenlabs.io/voice-library
// Or run: node scripts/generate-voices.mjs --list-voices
//
// Recommended voice characteristics per character:
//   pascual:     Timid young male, soft, high-pitched, slow
//   berta:       Loud expressive female, fast, energetic
//   bruno:       Loud expressive male, energetic
//   darwin:      Confident male, firm, slightly deep
//   momo:        Very soft, sleepy, gentle male
//   luna:        Low whispery female, mysterious, calm
//   neptuno:     Fast bubbly male, energetic, playful
//   alicia:      Young girl, natural, warm
// ────────────────────────────────────────────

const VOICE_MAP = {
  pascual:  { voiceId: 'jBpfuIE2acCO8z3wKNLl', name: 'Pascual el Pudú (Gigi)',              stability: 0.65, similarity: 0.80, style: 0.15 },
  berta:    { voiceId: 'tTdCI0IDTgFa2iLQiWu4', name: 'Berta la Bandurria (Daniela)',        stability: 0.30, similarity: 0.75, style: 0.45 },
  bruno:    { voiceId: '0cheeVA5B3Cv6DGq65cT', name: 'Bruno la Bandurria (Alejandro)',       stability: 0.35, similarity: 0.75, style: 0.40 },
  darwin:   { voiceId: 'cMKZRsVE5V7xf6qCp9fF', name: 'Darwin el Zorrito (Víctor)',          stability: 0.55, similarity: 0.80, style: 0.25 },
  momo:     { voiceId: 'gt8UWQljAEAt5YLqG4LW', name: 'Momo el Monito (Ninoska)',            stability: 0.75, similarity: 0.80, style: 0.10 },
  luna:     { voiceId: '9rvdnhrYoXoUt4igKpBw', name: 'Luna la Güiña (Mariana)',              stability: 0.70, similarity: 0.85, style: 0.10 },
  neptuno:  { voiceId: 'wSFJ1H2XywFI0wLdTylp', name: 'Neptuno el Chungungo (Karim)',        stability: 0.25, similarity: 0.70, style: 0.50 },
  alicia:   { voiceId: 'eRALiEwGnmo3g1ze76Y2', name: 'Alicia (Lolita)',                      stability: 0.50, similarity: 0.75, style: 0.20 },
};

// ────────────────────────────────────────────
// All dialogue lines (extracted from characterDialogues.ts)
// ────────────────────────────────────────────

const DIALOGUE_LINES = {
  pascual: {
    greeting: [
      '¡A-Alicia! ¡Viniste! Yo... es que me perdí y está muy oscuro aquí...',
      '¡H-hola! Soy Pascual... perdón, es que soy un poco tímido.',
      '¡Alicia! Menos mal que llegaste... me da un poquito de susto este bosque de noche.',
      '¡Oh! ¿Eres Alicia? Me dijeron que eres muy valiente. Yo... yo no tanto, pero contigo me siento más seguro.',
    ],
    correct: [
      '¡Sí, sí, sí! ¡Esa era! ¡Eres muy lista!',
      '¡Lo hiciste, Alicia! ¡Sabía que podías!',
      '¡Woow! ¡Correcto! Oye, eres mucho más inteligente que yo. Yo me confundo hasta contando mis patitas.',
      '¡Esa era! ¡Esa era! ¡Gracias, Alicia!',
      '¡Sííí! ¡Ahora puedo avanzar un poquito más! Contigo no me da tanto miedo.',
      '¡Perfecto! ¿Sabías que me pongo tan feliz que me tiemblan las orejitas? Mira...',
      '¡Bien, bien, bien! ¡Perdón, es que me emociono y me escondo!',
    ],
    incorrect: [
      'Mmm, esa no era... ¡pero no te preocupes! A mí me cuesta hasta caminar sin tropezarme, jiji.',
      'No te preocupes, Alicia. Yo me pierdo todos los días y siempre encuentro el camino al final.',
      'Uy, esa era difícil... Pero oye, ¡tú puedes! Si yo puedo cruzar un arroyo siendo tan chiquitito, tú puedes con esto.',
      'No era esa, pero... ¿intentamos de nuevo? Yo te espero, no me voy a ningún lado. Bueno, porque estoy perdido, pero igual te espero.',
      'Mmm, casi... ¡Pero eso está bien! Mi mamá dice que equivocarse es parte de aprender. Dale de nuevo, Alicia.',
      '¡Ups! Esa no era... Pero sabes qué, yo una vez me caí en una poza y salí nadando. ¡Siempre se puede intentar de nuevo!',
      'No te rindas, Alicia. Yo creo en ti. ...Es que eres la única persona que conozco, pero ¡creo mucho en ti!',
    ],
    hint1: [
      'Oye Alicia, ¿y si pruebas contando con los deditos? A mí me funciona con las hojas del bosque.',
      '¿Sabías que yo cuento los pasos cuando camino? Empieza desde el número más grande y cuenta desde ahí.',
      'Mmm... ¿y si piensas en bolitas? Como las frutitas que como yo. Junta los dos grupos en tu cabeza.',
    ],
    hint2: [
      'Mira, Alicia: primero fíjate en los numeritos de la derecha, los chiquititos. Como yo, que soy chiquitito pero importante.',
      'Mi mamá me enseñó: separa las decenas de las unidades. ¡Así todo es más fácil!',
      'Oye, recuerda que 10 unidades son 1 decena. Como 10 hojas hacen un ramito.',
    ],
    hint3: [
      '¡Oye! Cuando las unidades suman más de 9, hay que llevar una decena. Como cuando llevo muchas hojas y se me caen y tengo que juntarlas de nuevo.',
      'Empieza por la derecha, Alicia. Primero las unidades, después las decenas. Pasito a pasito, como camino yo.',
    ],
    hint4: [
      'Mira bien, Alicia... yo creo que la respuesta está entre {min} y {max}. ¿Probamos?',
      'Te doy una pista grande: ¡el resultado está cerquita de {nearAnswer}! ...Perdón, es que quiero ayudar.',
    ],
    stageComplete: [
      '¡Alicia, mira! ¡Puedo ver un poquito más del camino! ¿Seguimos juntos? ...¿sí?',
      '¡Lo logramos! Bueno, lo lograste tú. Yo solo te miraba con admiración. ¡Pero ayudé moralmente!',
      '¡Avanzamos! Oye, ¿te cuento algo del bosque?',
    ],
    chapterComplete: [
      '¡Alicia! ¡Ahí está mi mamá! ¡Gracias, gracias, gracias! Sin ti no habría llegado nunca. Eres mi mejor amiga.',
      '¡Lo logramos, Alicia! ¡Estoy en casa! Nunca te voy a olvidar...',
    ],
  },

  'berta-bruno': {
    greeting: [
      { text: '¡ALICIA! ¡Por fin! ¡La tormenta nos separó y no encuentro a Bruno! ¡Ayúdame, porfa!', voice: 'berta' },
      { text: '¡¡Berta!! ¿Eres tú? ¡¡Estoy aquí!! ...¿Dónde es aquí? ¡ALICIA, AYUDA!', voice: 'bruno' },
      { text: '¡Alicia! ¡Qué bueno que llegaste! ¡Bruno se perdió y yo no puedo encontrarlo sola! ¡BRUNOOO!', voice: 'berta' },
    ],
    correct: [
      { text: '¡ESO! ¡Sabía que Alicia podía! ¡Bruno, escuchaste? ¡ALICIA ES LA MEJOR!', voice: 'berta' },
      { text: '¡Sí, sí! ¡Es la mejor! ¡Hagamos bulla para celebrar! ¡CRAAA!', voice: 'bruno' },
      { text: '¡Excelente! ¡Estamos más cerca! ¡BRUNOOO, YA VAMOS!', voice: 'berta' },
      { text: '¡Bravísimo! ¡Alicia, eres más inteligente que todas las bandurrias del humedal juntas!', voice: 'berta' },
      { text: '¡Wow! ¡Correcto! Oye Berta, ¿escuchaste? ¡CORRECTO! ¡CRAAA CRAAA!', voice: 'bruno' },
      { text: '¡SÍÍÍÍ! ¡Perdón, es que me emociono! ¡DALE, OTRA MÁS!', voice: 'berta' },
      { text: '¡LO HICISTE! ¡Berta va a estar tan contenta! Bueno, yo también. ¡TODOS CONTENTOS! ¡CRAAA!', voice: 'bruno' },
    ],
    incorrect: [
      { text: '¡No era esa, pero tranquila! A Bruno le toma como diez intentos encontrar comida y míralo, sigue vivo.', voice: 'berta' },
      { text: '¡Oye! ...bueno, es verdad. ¡Pero tú puedes, Alicia! ¡Yo creo en ti! ¡CRAAAA!', voice: 'bruno' },
      { text: 'Mmm, no era. ¡Pero no importa! ¿Sabías que una vez Bruno se perdió tres días? Y aquí está. ¡Inténtalo de nuevo!', voice: 'berta' },
      { text: '¡Casi! ¡Estás re cerca! A mí me costó como seis intentos aprender a volar. ¡TÚ PUEDES!', voice: 'bruno' },
      { text: 'Esa no era, pero ¡ánimo! Nosotras las bandurrias nunca nos rendimos. ¡VAMOS DE NUEVO!', voice: 'berta' },
    ],
    hint1: [
      { text: '¡Oye, prueba contando con los dedos! Yo no tengo dedos pero ¡cuento con las plumas! ¡CRAAA!', voice: 'berta' },
      { text: 'Empieza desde el número más grande. Como cuando vuelo: siempre parto de lo más alto. ¡Es más fácil!', voice: 'bruno' },
    ],
    hint2: [
      { text: '¡Mira las unidades primero! El numerito de la derecha. ¡Como mirar el humedal desde arriba!', voice: 'berta' },
      { text: 'Separa decenas y unidades, Alicia. ¡Como separar los insectos de las lombrices en el almuerzo!', voice: 'bruno' },
    ],
    hint3: [
      { text: '¡OJO! Si restando el de arriba es más chiquitito, hay que pedirle prestado al vecino. ¡Como cuando Bruno me pide comida!', voice: 'berta' },
      { text: '¡Empieza por la derecha! Primero unidades, luego decenas. Paso a paso, como caminamos en el barro.', voice: 'bruno' },
    ],
    hint4: [
      { text: '¡Pista GIGANTE! La respuesta está entre {min} y {max}. ¡DALE QUE TÚ PUEDES! ¡CRAAA!', voice: 'berta' },
      { text: 'Oye Alicia, yo creo que el resultado está cerquita de {nearAnswer}... ¡Berta no me deja decir más!', voice: 'bruno' },
    ],
    stageComplete: [
      { text: '¡ETAPA LISTA! ¡Estamos más cerca de Bruno! ¡BRUNOOO, YA VAMOOOOS!', voice: 'berta' },
      { text: '¡Alicia, eres increíble! ¡Espera que te cuento algo genial de las bandurrias!', voice: 'berta' },
    ],
    chapterComplete: [
      { text: '¡BRUNOOO! ¡Alicia nos reunió! ¡Eres la mejor amiga del mundo! ¡CRAAA CRAAA!', voice: 'berta' },
      { text: '¡BERTAAA! ¡Te extrañé tanto! ¡Gracias Alicia! ¡Nunca te vamos a olvidar! ¡CRAAA!', voice: 'bruno' },
    ],
  },

  darwin: {
    greeting: [
      '¡Alicia! Justo la exploradora que necesitaba. Tengo hambre y el bosque es grande. ¿Vamos?',
      '¡Bienvenida a mi territorio! Soy Darwin, el zorro más valiente de Chiloé. Bueno, el único que se atreve a presentarse.',
      '¡Ah, por fin alguien que sabe de números! Yo soy más de olfato, pero hoy necesito tu cerebro. ¿Lista?',
    ],
    correct: [
      '¡Excelente cálculo! Según mis observaciones, eres tan inteligente como Charles Darwin. Bueno, casi.',
      '¡Mira eso! ¡Perfecto! Un buen explorador siempre tiene una amiga lista como tú.',
      '¡Correcto! Yo sabía que ibas a poder. Bueno, tenía un 87% de confianza.',
      '¡Impresionante! Según mis cálculos, llevas una racha increíble. ¡Sigue así, exploradora!',
      '¡Eso es! ¡Otro paso más cerca del desayuno! Digo, de la aventura. Pero también del desayuno.',
      '¡Brillante! Charles Darwin estaría orgulloso. Y yo también. Sobre todo yo.',
      '¡JA! ¡Lo sabía! Oye Alicia, tú y yo somos el mejor equipo del bosque.',
    ],
    incorrect: [
      'Hmm, no era esa. Pero un buen explorador nunca se rinde con el primer intento. ¡Yo una vez me perdí tres días y aquí estoy!',
      'No te preocupes. Según mis observaciones, los mejores descubrimientos vienen después de muchos intentos fallidos.',
      'Esa no era, pero ¡ánimo! ¿Sabías que Charles Darwin se equivocó muchas veces antes de descubrirme? La ciencia es así.',
      'Hmm, necesitamos recalcular la ruta. ¡Pero tranquila! Un explorador siempre tiene un plan B. Y C. Y D.',
      'No era esa. Pero oye, yo choqué con una rama hace un rato y nadie me vio. Los errores pasan. ¡De nuevo!',
    ],
    hint1: [
      'Mira, Alicia: un explorador siempre empieza por lo que sabe. ¿Qué número conoces seguro?',
      'Usa tus dedos como herramientas. Yo uso mi nariz, tú usa tus manos. ¡Cada explorador con lo suyo!',
    ],
    hint2: [
      'Según mis cálculos, conviene empezar por las unidades. El numerito de la derecha. Paso uno de todo buen plan.',
      'Separa el problema en partes. Decenas por un lado, unidades por otro. ¡Divide y vencerás!',
    ],
    hint3: [
      '¡Atención! Cuando sumas y las unidades pasan de 9, llevas una decena. Es como cuando llevo tanta comida que se me cae y tengo que reorganizar.',
      'Empieza por la derecha, siempre. Unidades, decenas, centenas. Orden y método, como un verdadero explorador.',
    ],
    hint4: [
      'Pista de explorador: la respuesta está entre {min} y {max}. ¡Confío en tu instinto!',
      'Te doy un dato: el resultado está muy cerquita de {nearAnswer}. Según mis cálculos, ¡estás casi!',
    ],
    stageComplete: [
      '¡Excelente expedición! Según mi mapa, estamos avanzando perfecto. ¿Te cuento algo del bosque?',
      '¡Etapa superada! Yo sabía que este equipo iba a funcionar.',
    ],
    chapterComplete: [
      '¡Alicia, hoy fue la mejor aventura de mi vida! Bueno, después de cuando Charles Darwin me descubrió. ¡Gracias, exploradora!',
      'Sabes, Alicia... no todos los días se encuentra una amiga así. Vuelve cuando quieras. El bosque siempre te va a recibir.',
    ],
  },

  momo: {
    greeting: [
      'Mmm... ¿Alicia? Ah, hola... Recién desperté del invierno y... tengo muuucha hambre...',
      'Hola... ¿Tú eres Alicia? Me contaron que eres muy buena con los números... Yo solo sé contar frutitas... y dormirme.',
      'Mmm... cinco minutitos más... Ah, ¿Alicia? ¡Perdón! Es que dormir es lo que mejor hago. ¿Me ayudas a buscar comida?',
    ],
    correct: [
      '¡Esa era! ¡Ahora sí puedo buscar mis frutitas! ...después de una siestita.',
      'Mmm, qué rico... digo, ¡qué bien! ¡Correcto! Oye, eres más despierta que yo. Bueno, eso no es difícil.',
      '¡Sí! ¡Esa era! Estoy tan feliz que casi se me quita el sueño. Casi.',
      '¡Wow! ¡Correcto! Eres como un sueño hecho realidad, Alicia. Hablando de sueños... no, no, ¡sigamos!',
      '¡Lo hiciste! Eres la mejor amiga que un monito dormilón puede tener.',
      'Mmm... ¡perfecto! Esto merece una celebración. ¿Frutitas para todos? Bueno, primero encontrémoslas.',
      '¡Bien! Perdón, no es aburrimiento, ¡es emoción! Yo bostezo cuando estoy contento.',
    ],
    incorrect: [
      'No te preocupes, Alicia... yo me equivoco de rama todo el tiempo cuando tengo sueño. Intenta de nuevo con calma...',
      'Mmm, esa no era... Pero sabes, cuando sueño, a veces las respuestas me llegan solitas. Respira hondo y piénsalo despacito.',
      'No era esa... pero todo bien. Roma no se construyó en una siesta. Digo, en un día.',
      'Ups... Pero no te rindas, Alicia. Yo me caí de una rama ayer y aquí sigo. ¡Las caídas nos hacen más fuertes!',
      'Mmm, casi... Cierra los ojitos un segundito y piensa con calma. A mí me funciona. Bueno, a veces me quedo dormido, pero eso es otra cosa.',
    ],
    hint1: [
      'Sabes... cuando no puedo encontrar una fruta, cierro los ojos y pienso despacio. Prueba contar despacito.',
      'Mmm... ¿y si cuentas con los deditos? Yo cuento con mi colita cuando puedo...',
    ],
    hint2: [
      'Fíjate en las unidades primero... los numeritos chiquititos de la derecha. Como las frutitas chiquititas que son las más ricas.',
      'Separa todo en partecitas... decenas y unidades... como separar las frutitas maduras de las verdes...',
    ],
    hint3: [
      'Oye... si las unidades suman más de 9, hay que llevar una decena. Es como cuando mi bolsita de frutitas se llena y tengo que empezar otra.',
      'Empieza por la derecha... pasito a pasito... como trepo yo de noche por las ramitas... despacito pero seguro.',
    ],
    hint4: [
      'Alicia... yo creo que la respuesta está entre {min} y {max}... No le digas a nadie que te ayudé.',
      'Mmm... estás cerquita de {nearAnswer}... Eso me dijo un pajarito. Bueno, me lo soñé, pero ¡confío en mis sueños!',
    ],
    stageComplete: [
      '¡Etapa lista! Mmm, eso fue cansador. ¿Te cuento algo mientras descanso un poquito?',
      '¡Lo logramos! Bueno, lo lograste tú. Yo solo... te observaba con mucho cariño.',
    ],
    chapterComplete: [
      '¡Alicia! ¡Tengo la barriga llena de frutitas! Todo gracias a ti. Eres la mejor... ¡...amiga del mundo!',
      'Mmm... Gracias, Alicia. Voy a soñar contigo esta noche. Y mañana. Y pasado...',
    ],
  },

  luna: {
    greeting: [
      'Shh... Alicia. Soy Luna. No te asustes — mis ojos brillan en la noche, pero soy amiga. Necesito encontrar un hogar nuevo.',
      '...Alicia. Te estaba observando. No te preocupes, observar es lo que hago. Necesito tu ayuda esta noche.',
      'Buenas noches, Alicia. El bosque es diferente cuando se pone oscuro. Pero no tengas miedo. Yo veo todo.',
    ],
    correct: [
      'Bien. Muy bien. Tienes ojos de gata nocturna, Alicia — ves lo que otros no ven.',
      'Correcto. Como un salto perfecto entre ramas en la oscuridad. Silencioso y preciso.',
      'Mmm. Impresionante. Pocos tienen esa claridad. Tú sí, Alicia.',
      'Exacto. En la noche hay que ser precisa, y tú lo eres.',
      'Bien hecho. Cada respuesta correcta nos acerca a un hogar seguro. Gracias.',
      '...Perfecto. Sigamos, el bosque nos espera.',
      'Correcto. ¿Sabes? En la oscuridad, la certeza vale más que la velocidad. Y tú tienes ambas.',
    ],
    incorrect: [
      'No era esa. Pero en la oscuridad, hay que intentar muchas veces antes de encontrar el camino. Otra vez.',
      'Mmm, no. Pero escucha: incluso yo fallo un salto de vez en cuando. La noche es paciente. Intenta de nuevo.',
      'Esa no era. Cierra los ojos un segundo. Abre. Ahora mira de nuevo. Los números a veces se esconden como yo.',
      'No. Pero no te frustres. La paciencia es la herramienta más poderosa en la noche.',
      'Incorrecto. Pero sabes qué, Alicia... los mejores cazadores son los que más fallan antes de acertar.',
    ],
    hint1: [
      'Mira con atención... los números tienen un patrón. Como las huellas en el barro.',
      'Cuenta despacio, como mis pasos en la noche. Uno. Dos. Tres. Sin apuro.',
    ],
    hint2: [
      'Fíjate en la derecha primero. Las unidades. Como cuando observo la presa antes de saltar.',
      'Separa los números. Las sombras se ven mejor cuando las miras por partes.',
    ],
    hint3: [
      'Cuando las unidades son muchas, una se va para las decenas. Como cuando cambio de rama porque una ya no aguanta.',
      'Derecha a izquierda. Paso a paso. Como camino yo entre los coigues en la noche oscura.',
    ],
    hint4: [
      '...La respuesta está entre {min} y {max}. Puedo olerla. Confía en ti.',
      'Shh. Escucha. El número está cerquita de {nearAnswer}. ¿Lo ves ahora?',
    ],
    stageComplete: [
      'Bien. Otra etapa en la oscuridad, superada con luz. Te cuento un secreto del bosque...',
      'Avanzamos. El bosque se abre poco a poco. Como mis pupilas en la noche.',
    ],
    chapterComplete: [
      'Alicia... encontré un hogar. Gracias a ti. No voy a olvidarte. Si alguna vez ves dos ojos brillando en el bosque de noche... soy yo, saludándote.',
      'Tengo un lugar seguro ahora. Eso es lo más valioso que alguien me ha dado. Gracias, Alicia.',
    ],
  },

  neptuno: {
    greeting: [
      '¡SPLASH! ¡Hola Alicia! ¡Soy Neptuno! ¿Te mojé? ¡Perdón! Es que estoy emocionado — ¡hoy vamos a explorar las pozas de roca!',
      '¡Alicia! ¡Ven, ven, ven! ¡El mar está increíble hoy! ¡Hay erizos, cangrejos, algas! ¡TODO! ¡Vamos!',
      '¡WOOO! ¡Llegaste! ¡Soy Neptuno y soy el mejor nadador de toda la costa! Bueno, eso digo yo. ¡Vamos al agua!',
    ],
    correct: [
      '¡WOOO! ¡Correctísimo! ¡Eso merece un chapuzón de celebración!',
      '¡SPLASH DE FELICIDAD! ¡Lo hiciste! ¡Alicia, eres como una ola perfecta!',
      '¡SÍÍÍÍ! ¡Eso fue INCREÍBLE! ¡Como romper un erizo al primer golpe!',
      '¡PERFECTO! ¡Alicia, eres más lista que un delfín! Y eso es muuucho decir. ¡SPLASH!',
      '¡GENIAL! ¡Ups, perdón! ¡Es que estoy tan contento que no me controlo!',
      '¡CORRECTO! ¡Como una ola que llega justo donde tiene que llegar! ¡TÚ ERES ESA OLA, ALICIA!',
      '¡WOW WOW WOW! ¡Otra más! ¡Eres imparable como la corriente del Pacífico!',
    ],
    incorrect: [
      '¡Ups! Esa no era, pero tranqui — yo me caigo de las rocas como diez veces al día y siempre vuelvo a subir. ¡Dale de nuevo!',
      'No era esa, ¡pero no importa! ¿Sabías que para abrir un erizo a veces necesito como veinte golpes? ¡La práctica hace al maestro!',
      'Mmm, no. ¡Pero las olas también se equivocan de roca a veces! ¡Vuélvelo a intentar! ¡VAMOS!',
      '¡Casi! ¡Estás más cerca que un cangrejo de su cueva! ¡Una más y lo sacas! ¡YO SÉ QUE SÍ!',
      'No fue esa, ¡pero ni modo! En el mar aprendes que cada ola trae una nueva oportunidad. ¡SPLASH!',
    ],
    hint1: [
      'Oye, ¿y si lo piensas como contar erizos en la poza? Uno por uno, sin apuro. ¡El mar es paciente!',
      '¡Cuenta con los dedos! Yo cuento con mis patitas mojadas. ¡Empieza desde el número más grande y suma!',
    ],
    hint2: [
      '¡Mira las unidades! El numerito de la derecha. Como contar las algas más cercanas primero. ¡Después las de más lejos!',
      'Separa en decenas y unidades. ¡Como separar los cangrejos grandes de los chiquititos en la poza!',
    ],
    hint3: [
      '¡Ojo! Si las unidades suman más de 9, ¡llevas una decena! Como cuando mi poza se llena y el agua pasa a la siguiente. ¡Splash!',
      'Empieza por la derecha, como las olas que vienen del mar. ¡Unidades, decenas, centenas! ¡En orden!',
    ],
    hint4: [
      '¡Pista de nutria marina! La respuesta está entre {min} y {max}. ¡Estás cerquísima! ¡SPLASH!',
      'Oye oye oye, ¡está cerquita de {nearAnswer}! ¡Como un erizo escondido bajo la roca! ¡Búscalo!',
    ],
    stageComplete: [
      '¡SPLASH SPLASH SPLASH! ¡Etapa terminada! ¿Te cuento algo genial sobre el mar? ¡Ven, ven!',
      '¡WOOOO! ¡Otra etapa en el bolsillo! Bueno, yo no tengo bolsillos, pero ¡tú me entiendes! ¡SPLASH!',
    ],
    chapterComplete: [
      '¡ALICIA! ¡Fue la mejor aventura marina de toda mi vida! ¡Vuelve pronto! ¡El mar siempre te va a recibir con un SPLASH!',
      '¡Lo logramos! Oye Alicia, eres la mejor amiga que un chungungo puede tener. ¡SPLASH de despedida!',
    ],
  },

  alicia: {
    chapterSelect: [
      'Hmm, ¿a quién ayudo hoy? ¡El bosque tiene muchos amigos que me necesitan!',
      '¡Mira cuántos animales! ¿Por dónde empiezo? ¡Esto va a ser genial!',
      '¡Hola! ¡El bosque de Chiloé me está llamando!',
    ],
    streak_day2: [
      '¡Llevo 2 días seguidos! ¡Mis amigos del bosque saben que pueden contar conmigo!',
    ],
    streak_day3: [
      '¡3 días seguidos! ¡Soy re buena para esto, cachai!',
    ],
    streak_day5: [
      '¡5 días seguidos! ¡Soy la mejor exploradora de Chiloé!',
    ],
    streak_day7: [
      '¡Una semana entera! ¡Nadie me para, po!',
    ],
    sessionWarning: [
      'Uf, llevo un buen rato... Quizás debería descansar un poquito.',
      'Mmm, me están pesando los ojitos. ¡Mañana sigo con la aventura!',
    ],
  },
};

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

const API_BASE = 'https://api.elevenlabs.io/v1';

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listVoices(apiKey) {
  const res = await fetch(`${API_BASE}/voices`, {
    headers: { 'xi-api-key': apiKey },
  });
  if (!res.ok) throw new Error(`Failed to list voices: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.voices;
}

async function generateSpeech(apiKey, voiceId, text, settings = {}) {
  const res = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: settings.stability ?? 0.5,
        similarity_boost: settings.similarity ?? 0.75,
        style: settings.style ?? 0.5,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`ElevenLabs API error (${res.status}): ${error}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipExisting = args.includes('--skip-existing');
  const listVoicesFlag = args.includes('--list-voices');
  const charFilter = args.find((a) => args[args.indexOf(a) - 1] === '--character');

  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey && !dryRun) {
    console.error('ERROR: Set ELEVENLABS_API_KEY environment variable.');
    console.error('Usage: ELEVENLABS_API_KEY=sk_... node scripts/generate-voices.mjs');
    process.exit(1);
  }

  // --list-voices mode
  if (listVoicesFlag) {
    console.log('Fetching available voices...\n');
    const voices = await listVoices(apiKey);
    for (const v of voices) {
      const labels = v.labels ? Object.entries(v.labels).map(([k, val]) => `${k}:${val}`).join(', ') : '';
      console.log(`  ${v.voice_id}  ${v.name}  [${labels}]`);
    }
    console.log(`\nTotal: ${voices.length} voices`);
    console.log('\nCopy voice IDs to the VOICE_MAP config in this script.');
    return;
  }

  // Validate voice IDs are configured (unless dry-run)
  if (!dryRun) {
    const missingVoices = Object.entries(VOICE_MAP)
      .filter(([, config]) => !config.voiceId)
      .map(([key]) => key);

    if (missingVoices.length > 0) {
      console.error(`ERROR: Missing voice IDs for: ${missingVoices.join(', ')}`);
      console.error('Edit the VOICE_MAP config in this script to set ElevenLabs voice IDs.');
      console.error('Run with --list-voices to see available voices.');
      process.exit(1);
    }
  }

  // Build task list
  const tasks = [];
  let totalLines = 0;
  let skippedPlaceholders = 0;

  for (const [characterId, categories] of Object.entries(DIALOGUE_LINES)) {
    if (charFilter && characterId !== charFilter) continue;

    for (const [category, lines] of Object.entries(categories)) {
      for (let i = 0; i < lines.length; i++) {
        const lineData = lines[i];
        const text = typeof lineData === 'string' ? lineData : lineData.text;
        const voice = typeof lineData === 'string'
          ? characterId
          : lineData.voice;

        // Skip lines with dynamic placeholders
        if (text.includes('{min}') || text.includes('{max}') || text.includes('{nearAnswer}')) {
          skippedPlaceholders++;
          continue;
        }

        const filename = `${category}_${i}.mp3`;
        const dir = join(OUTPUT_DIR, characterId);
        const filepath = join(dir, filename);
        const relativePath = `audio/voices/${characterId}/${filename}`;

        tasks.push({
          characterId,
          voice,
          category,
          index: i,
          text,
          filepath,
          relativePath,
          dir,
        });
        totalLines++;
      }
    }
  }

  console.log(`\n🎙️  AliciaApp Voice Generator (ElevenLabs)\n`);
  console.log(`Total dialogue lines: ${totalLines + skippedPlaceholders}`);
  console.log(`Skipped (dynamic placeholders): ${skippedPlaceholders}`);
  console.log(`Lines to generate: ${totalLines}`);
  console.log(`Characters: ${[...new Set(tasks.map((t) => t.voice))].join(', ')}`);

  if (dryRun) {
    console.log(`\n── DRY RUN: Listing all lines ──\n`);
    for (const task of tasks) {
      console.log(`[${task.voice}] ${task.relativePath}`);
      console.log(`  "${task.text}"\n`);
    }
    console.log(`\nTotal: ${totalLines} audio files would be generated.`);
    return;
  }

  // Generate audio files
  console.log(`\n── Generating audio files ──\n`);

  const manifest = {};
  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const task of tasks) {
    // Check if already exists
    if (skipExisting && await fileExists(task.filepath)) {
      manifest[`${task.characterId}/${task.category}/${task.index}`] = task.relativePath;
      skipped++;
      continue;
    }

    const voiceConfig = VOICE_MAP[task.voice];
    if (!voiceConfig || !voiceConfig.voiceId) {
      console.error(`  ✗ No voice configured for: ${task.voice}`);
      errors++;
      continue;
    }

    try {
      process.stdout.write(`  ⏳ [${generated + 1}/${totalLines}] ${task.voice}/${task.category}_${task.index}...`);

      const audioData = await generateSpeech(apiKey, voiceConfig.voiceId, task.text, {
        stability: voiceConfig.stability,
        similarity: voiceConfig.similarity,
        style: voiceConfig.style,
      });

      await mkdir(task.dir, { recursive: true });
      await writeFile(task.filepath, audioData);

      manifest[`${task.characterId}/${task.category}/${task.index}`] = task.relativePath;
      generated++;
      console.log(` ✓ (${(audioData.length / 1024).toFixed(1)}KB)`);

      // Rate limit: ElevenLabs free tier is ~2 req/s
      await sleep(600);
    } catch (err) {
      console.log(` ✗ ERROR: ${err.message}`);
      errors++;
    }
  }

  // Write manifest
  const manifestPath = join(OUTPUT_DIR, 'manifest.json');
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n── Done ──\n`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Skipped (placeholders): ${skippedPlaceholders}`);
  console.log(`Errors: ${errors}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
