import type { Chapter } from '../types/game';

export const chapters: Chapter[] = [
  // ─────────────────────────────────────────────
  // Chapter 1: Pascual el Pudú
  // Addition without carry, numbers 1-20
  // ─────────────────────────────────────────────
  {
    id: 'ch1-pudu',
    order: 1,
    animal: {
      id: 'pascual',
      name: 'Pascual',
      species: 'Pudú',
      scientificName: 'Pudu puda',
      personality: 'Tímido y curioso, se esconde detrás de los helechos pero siempre asoma la nariz para investigar.',
      description: 'El pudú es el ciervo más pequeño del mundo. Vive en los bosques del sur de Chile y Argentina. Es tímido y solitario, activo al amanecer y atardecer.',
      conservationStatus: 'Vulnerable',
      size: 'Apenas 35-45 cm de alto, del tamaño de un gato grande.',
    },
    title: 'Pascual el Pudú perdido',
    operation: 'addition',
    difficultyLevel: 1,
    numberRange: { min: 1, max: 20 },
    stages: [
      {
        id: 'ch1-s1',
        chapterId: 'ch1-pudu',
        order: 1,
        title: 'El bosque oscuro',
        description: 'Pascual se ha perdido en el bosque de arrayanes. Ayúdalo a encontrar el camino sumando los pasos que debe dar.',
        exercisesRequired: 5,
        funFact: {
          id: 'ch1-ff1',
          text: 'El pudú marca su territorio frotando sus cuernitos contra los árboles. ¡Así otros pudúes saben que ya pasó por ahí!',
          category: 'behavior',
        },
      },
      {
        id: 'ch1-s2',
        chapterId: 'ch1-pudu',
        order: 2,
        title: 'El arroyo',
        description: 'Pascual llega a un arroyo y necesita contar las piedras para cruzar sin mojarse.',
        exercisesRequired: 7,
        funFact: {
          id: 'ch1-ff2',
          text: 'Los pudúes son excelentes nadadores aunque prefieren no mojarse. ¡Cruzan ríos solo cuando es necesario!',
          category: 'fun',
        },
      },
      {
        id: 'ch1-s3',
        chapterId: 'ch1-pudu',
        order: 3,
        title: 'Los helechos gigantes',
        description: 'Entre helechos enormes, Pascual debe sumar las hojas que encuentra para reconocer el camino correcto.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch1-ff3',
          text: 'El pudú come hojas, cortezas, brotes y frutas caídas. Sus comidas favoritas son las hojas tiernas de los arbustos del bosque.',
          category: 'behavior',
        },
      },
      {
        id: 'ch1-s4',
        chapterId: 'ch1-pudu',
        order: 4,
        title: 'El claro del bosque',
        description: 'Pascual encuentra un claro lleno de luz. ¡Está más cerca de casa! Suma las flores para saber si va bien.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch1-ff4',
          text: 'Cuando un pudú se asusta, corre en zigzag entre los árboles. ¡Su pequeño tamaño le permite escabullirse por donde otros animales no pueden!',
          category: 'fun',
        },
      },
      {
        id: 'ch1-s5',
        chapterId: 'ch1-pudu',
        order: 5,
        title: 'El reencuentro',
        description: '¡Pascual ve a su familia al otro lado del prado! Resuelve las últimas sumas para que llegue con ellos.',
        exercisesRequired: 6,
        funFact: {
          id: 'ch1-ff5',
          text: 'Las mamás pudú tienen solo una cría a la vez. El cervatillo nace con manchas blancas que lo ayudan a camuflarse entre las hojas del bosque.',
          category: 'conservation',
        },
      },
    ],
    storyIntro: '¡Oh no! Pascual, un pequeño pudú, se ha perdido en el bosque de Chiloé. Es de noche y no encuentra el camino a casa. ¿Lo ayudas a volver con su familia resolviendo sumas?',
    completionFact: '¡Pascual llegó a casa gracias a ti! Ahora sabes que el pudú es el ciervo más pequeño del mundo y vive aquí en los bosques de Chiloé. Solo quedan pocos miles en estado salvaje, por eso debemos cuidar su hogar.',
    backgroundTheme: 'bosque-valdiviano',
  },

  // ─────────────────────────────────────────────
  // Chapter 2: Berta y Bruno las Bandurrias
  // Subtraction without borrow, numbers 1-20
  // ─────────────────────────────────────────────
  {
    id: 'ch2-bandurria',
    order: 2,
    animal: {
      id: 'berta-bruno',
      name: 'Berta y Bruno',
      species: 'Bandurria',
      scientificName: 'Theristicus melanopis',
      personality: 'Ruidosos y sociables, siempre andan juntos y hacen mucha bulla.',
      description: 'La bandurria es un ave zancuda con un largo pico curvo. Vive en praderas húmedas, bordes de ríos y humedales del sur de Chile. Es muy ruidosa y se la escucha desde lejos.',
      conservationStatus: 'Preocupación menor',
      size: 'Unos 75 cm de largo con un pico curvo de 15 cm.',
    },
    title: 'Berta y Bruno las Bandurrias separadas',
    operation: 'subtraction',
    difficultyLevel: 2,
    numberRange: { min: 1, max: 20 },
    stages: [
      {
        id: 'ch2-s1',
        chapterId: 'ch2-bandurria',
        order: 1,
        title: 'La pradera vacía',
        description: 'Berta y Bruno se separaron durante una tormenta. Ayúdalos a restar los obstáculos del camino para reencontrarse.',
        exercisesRequired: 5,
        funFact: {
          id: 'ch2-ff1',
          text: 'Las bandurrias hacen un sonido muy fuerte que se escucha a gran distancia: "¡ban-ban-ban!". Así se llaman entre ellas cuando se pierden.',
          category: 'behavior',
        },
      },
      {
        id: 'ch2-s2',
        chapterId: 'ch2-bandurria',
        order: 2,
        title: 'El humedal',
        description: 'Bruno camina por el humedal buscando a Berta. Resta los charcos que debe esquivar.',
        exercisesRequired: 7,
        funFact: {
          id: 'ch2-ff2',
          text: 'Las bandurrias usan su largo pico curvo para buscar insectos y lombrices enterrados en el barro. ¡Es como tener una herramienta especial!',
          category: 'behavior',
        },
      },
      {
        id: 'ch2-s3',
        chapterId: 'ch2-bandurria',
        order: 3,
        title: 'Los acantilados',
        description: 'Berta vuela sobre los acantilados. ¡Debe calcular bien la distancia restando para aterrizar segura!',
        exercisesRequired: 8,
        funFact: {
          id: 'ch2-ff3',
          text: 'Las bandurrias vuelan en grupos formando una V, igual que los aviones. ¡Así gastan menos energía en vuelos largos!',
          category: 'fun',
        },
      },
      {
        id: 'ch2-s4',
        chapterId: 'ch2-bandurria',
        order: 4,
        title: 'El vuelo',
        description: 'Bruno levanta vuelo para buscar a Berta desde las alturas. Resta para encontrar la ruta más corta.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch2-ff4',
          text: 'Las bandurrias construyen sus nidos en acantilados altos o árboles grandes. ¡Pueden poner hasta 3 huevos de color verdoso!',
          category: 'habitat',
        },
      },
      {
        id: 'ch2-s5',
        chapterId: 'ch2-bandurria',
        order: 5,
        title: 'Juntos de nuevo',
        description: '¡Bruno ve a Berta en la pradera! Resuelve las últimas restas para que se reúnan.',
        exercisesRequired: 6,
        funFact: {
          id: 'ch2-ff5',
          text: 'Las bandurrias son fieles a su pareja. ¡Berta y Bruno estarán juntos toda la vida, y cada año vuelven al mismo nido!',
          category: 'conservation',
        },
      },
    ],
    storyIntro: 'Berta y Bruno son dos bandurrias inseparables, pero una gran tormenta las separó. Bruno quedó en el humedal y Berta voló lejos. ¿Puedes ayudarlos a reencontrarse resolviendo restas?',
    completionFact: '¡Berta y Bruno están juntos de nuevo! Las bandurrias son aves muy especiales del sur de Chile. Siempre andan en pareja y son súper ruidosas. Su canto fuerte ayuda a que nunca se pierdan del todo.',
    backgroundTheme: 'pradera-humedal',
  },

  // ─────────────────────────────────────────────
  // Chapter 3: Darwin el Zorrito Chilote
  // Addition with carry, numbers 10-99
  // ─────────────────────────────────────────────
  {
    id: 'ch3-zorro',
    order: 3,
    animal: {
      id: 'darwin',
      name: 'Darwin',
      species: 'Zorro chilote (Zorro de Darwin)',
      scientificName: 'Lycalopex fulvipes',
      personality: 'Valiente y explorador, siempre anda buscando aventuras nuevas en el bosque.',
      description: 'El zorro de Darwin es uno de los cánidos más amenazados del mundo. Solo vive en Chiloé y en una pequeña zona de la cordillera de Nahuelbuta. Es más pequeño y oscuro que otros zorros chilenos.',
      conservationStatus: 'En peligro',
      size: 'Unos 60 cm de largo y solo 3-4 kg de peso. Pequeñito pero valiente.',
    },
    title: 'Darwin el Zorrito explorador',
    operation: 'addition',
    difficultyLevel: 3,
    numberRange: { min: 10, max: 99 },
    stages: [
      {
        id: 'ch3-s1',
        chapterId: 'ch3-zorro',
        order: 1,
        title: 'El despertar',
        description: 'Darwin despierta con hambre. Debe sumar los frutos y semillas que encuentra para saber si tiene suficiente desayuno.',
        exercisesRequired: 5,
        funFact: {
          id: 'ch3-ff1',
          text: 'El zorro de Darwin fue descubierto por Charles Darwin en 1834 durante su famoso viaje en el Beagle. ¡Por eso lleva su nombre!',
          category: 'fun',
        },
      },
      {
        id: 'ch3-s2',
        chapterId: 'ch3-zorro',
        order: 2,
        title: 'Los insectos del tronco',
        description: 'Darwin encuentra un tronco lleno de insectos. ¡Suma cuántos bichitos hay para ver si alcanza para una buena comida!',
        exercisesRequired: 7,
        funFact: {
          id: 'ch3-ff2',
          text: 'El zorro chilote come de todo: frutas, insectos, ranitas, huevos de aves y hasta mariscos en la playa. ¡Es un gran chef del bosque!',
          category: 'behavior',
        },
      },
      {
        id: 'ch3-s3',
        chapterId: 'ch3-zorro',
        order: 3,
        title: 'Las murtas del camino',
        description: 'El sendero está lleno de arbustos de murta con frutitas rojas. Darwin suma las murtas maduras que puede comer.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch3-ff3',
          text: 'Solo existen unos 600 a 800 zorros de Darwin en todo el mundo, y la mayoría vive aquí en Chiloé. ¡Son más raros que los pandas!',
          category: 'conservation',
        },
      },
      {
        id: 'ch3-s4',
        chapterId: 'ch3-zorro',
        order: 4,
        title: 'La orilla del río',
        description: 'Darwin llega al río y ve ranitas en las piedras. Suma para ayudarlo a calcular cuánto alimento hay.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch3-ff4',
          text: 'Los zorros de Darwin son muy importantes para el bosque: al comer frutas y caminar por el bosque, llevan semillas a nuevos lugares. ¡Son jardineros naturales!',
          category: 'habitat',
        },
      },
      {
        id: 'ch3-s5',
        chapterId: 'ch3-zorro',
        order: 5,
        title: 'De vuelta a casa',
        description: 'Con la barriga llena, Darwin vuelve a su madriguera. Suma los pasos finales del camino de regreso.',
        exercisesRequired: 6,
        funFact: {
          id: 'ch3-ff5',
          text: 'Los perros sueltos son el mayor peligro para el zorro de Darwin. Por eso es tan importante que en Chiloé los perros anden con correa.',
          category: 'conservation',
        },
      },
    ],
    storyIntro: 'Darwin es un valiente zorrito chilote que vive en lo profundo del bosque de Chiloé. Hoy salió a explorar y necesita encontrar suficiente comida para el día. ¿Lo ayudas sumando con números más grandes?',
    completionFact: '¡Darwin tuvo un día increíble gracias a ti! El zorro de Darwin es uno de los animales más raros del planeta y solo vive aquí en nuestra isla de Chiloé. Cuidar el bosque es cuidar su hogar.',
    backgroundTheme: 'bosque-profundo',
  },

  // ─────────────────────────────────────────────
  // Chapter 4: Momo el Monito del Monte
  // Subtraction with borrow, numbers 10-99
  // ─────────────────────────────────────────────
  {
    id: 'ch4-monito',
    order: 4,
    animal: {
      id: 'momo',
      name: 'Momo',
      species: 'Monito del monte',
      scientificName: 'Dromiciops gliroides',
      personality: 'Dormilón y dulce, le encanta dormir acurrucado y comer frutitas.',
      description: 'El monito del monte es un marsupial diminuto que solo vive en los bosques templados de Chile y Argentina. Es un fósil viviente: su familia existe hace más de 40 millones de años.',
      conservationStatus: 'Casi amenazado',
      size: 'Solo 8-13 cm de cuerpo, cabe en la palma de tu mano.',
    },
    title: 'Momo el Monito del Monte dormilón',
    operation: 'subtraction',
    difficultyLevel: 4,
    numberRange: { min: 10, max: 99 },
    stages: [
      {
        id: 'ch4-s1',
        chapterId: 'ch4-monito',
        order: 1,
        title: 'El despertar',
        description: 'Momo despierta de su siesta invernal. Debe restar para saber cuántos días durmió y cuánta comida le queda guardada.',
        exercisesRequired: 5,
        funFact: {
          id: 'ch4-ff1',
          text: 'El monito del monte puede hibernar durante el invierno. Su cuerpo se enfría tanto que parece dormido, ¡pero está ahorrando energía para la primavera!',
          category: 'behavior',
        },
      },
      {
        id: 'ch4-s2',
        chapterId: 'ch4-monito',
        order: 2,
        title: 'El árbol vacío',
        description: 'Las reservas de comida de Momo se acabaron. Resta para calcular cuánto necesita buscar afuera.',
        exercisesRequired: 7,
        funFact: {
          id: 'ch4-ff2',
          text: 'El monito del monte es un marsupial, como los canguros. Las mamás llevan a sus crías en una bolsita en la barriga. ¡Es el único marsupial de Chile!',
          category: 'fun',
        },
      },
      {
        id: 'ch4-s3',
        chapterId: 'ch4-monito',
        order: 3,
        title: 'Semillas en el sendero',
        description: 'Momo encuentra semillas pero algunas están secas. Resta las que no sirven para saber cuántas puede comer.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch4-ff3',
          text: 'El monito del monte tiene una cola que puede enrollar en las ramas como los monos. ¡La usa para no caerse mientras trepa de noche!',
          category: 'behavior',
        },
      },
      {
        id: 'ch4-s4',
        chapterId: 'ch4-monito',
        order: 4,
        title: 'El bosque renace',
        description: 'La primavera llega y hay frutas nuevas. Momo resta las que ya se comieron otros animales.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch4-ff4',
          text: 'La familia del monito del monte tiene más de 40 millones de años. ¡Es un fósil viviente! Sus parientes más cercanos están en Australia.',
          category: 'conservation',
        },
      },
      {
        id: 'ch4-s5',
        chapterId: 'ch4-monito',
        order: 5,
        title: 'El festín',
        description: '¡Momo encontró un árbol lleno de frutos! Resta para repartir con sus amigos del bosque.',
        exercisesRequired: 6,
        funFact: {
          id: 'ch4-ff5',
          text: 'Momo ayuda al bosque sin saberlo: cuando come frutos de copihue y quintral, dispersa las semillas con su caca. ¡Es un jardinero nocturno!',
          category: 'habitat',
        },
      },
    ],
    storyIntro: 'Momo es un monito del monte que acaba de despertar de su largo sueño de invierno. Tiene mucha hambre y debe encontrar comida en el bosque. ¿Lo ayudas restando para que sepa cuánto necesita?',
    completionFact: '¡Momo está feliz y con la barriga llena! El monito del monte es un tesoro de Chiloé: un marsupial diminuto que existe desde la época de los dinosaurios. Cuando cuidas el bosque nativo, cuidas la casa de Momo.',
    backgroundTheme: 'bosque-nocturno',
  },

  // ─────────────────────────────────────────────
  // Chapter 5: Luna la Güiña
  // Mixed addition and subtraction, numbers 10-99
  // ─────────────────────────────────────────────
  {
    id: 'ch5-guina',
    order: 5,
    animal: {
      id: 'luna',
      name: 'Luna',
      species: 'Güiña (Kodkod)',
      scientificName: 'Leopardus guigna',
      personality: 'Sigilosa y elegante, se mueve como una sombra entre los árboles por la noche.',
      description: 'La güiña es el felino salvaje más pequeño de América. Vive en los bosques templados del sur de Chile y es completamente nocturna. Es muy difícil de ver en estado salvaje.',
      conservationStatus: 'Vulnerable',
      size: 'Solo 40-50 cm de largo y 2-3 kg. ¡Es más pequeña que un gato doméstico!',
    },
    title: 'Luna la Güiña nocturna',
    operation: 'mixed',
    difficultyLevel: 5,
    numberRange: { min: 10, max: 99 },
    stages: [
      {
        id: 'ch5-s1',
        chapterId: 'ch5-guina',
        order: 1,
        title: 'La noche cae',
        description: 'Luna despierta cuando oscurece. Suma y resta para planificar su recorrido nocturno por el bosque.',
        exercisesRequired: 5,
        funFact: {
          id: 'ch5-ff1',
          text: 'La güiña es completamente nocturna. ¡Sus ojos son tan buenos que puede ver en la oscuridad casi total del bosque!',
          category: 'behavior',
        },
      },
      {
        id: 'ch5-s2',
        chapterId: 'ch5-guina',
        order: 2,
        title: 'El bosque de coigües',
        description: 'Luna trepa los coigües buscando aves dormidas. Suma y resta para calcular sus saltos entre ramas.',
        exercisesRequired: 7,
        funFact: {
          id: 'ch5-ff2',
          text: 'La güiña es una trepadora increíble. ¡Puede subir troncos verticales y saltar entre ramas como una acróbata del bosque!',
          category: 'behavior',
        },
      },
      {
        id: 'ch5-s3',
        chapterId: 'ch5-guina',
        order: 3,
        title: 'El peligro',
        description: 'Luna detecta un peligro en el bosque. Suma y resta rápido para encontrar una ruta de escape segura.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch5-ff3',
          text: 'La güiña es tan pequeña que puede entrar en madrigueras de roedores y huecos de troncos donde otros felinos no caben.',
          category: 'fun',
        },
      },
      {
        id: 'ch5-s4',
        chapterId: 'ch5-guina',
        order: 4,
        title: 'El tronco perfecto',
        description: 'Luna encuentra un tronco hueco ideal para descansar. Suma y resta para asegurarse de que es seguro.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch5-ff4',
          text: 'Solo hay unas 10.000 güiñas en el mundo. La mayor amenaza es la pérdida de bosque nativo. ¡Cada árbol cuenta!',
          category: 'conservation',
        },
      },
      {
        id: 'ch5-s5',
        chapterId: 'ch5-guina',
        order: 5,
        title: 'El nuevo hogar',
        description: 'Luna encontró un lugar perfecto para vivir. Resuelve las últimas operaciones para que se instale en su nuevo hogar.',
        exercisesRequired: 6,
        funFact: {
          id: 'ch5-ff5',
          text: 'Las güiñas marcan su territorio con arañazos en los troncos. Si ves marcas de garras chiquititas en los árboles del bosque, ¡puede que una güiña viva cerca!',
          category: 'habitat',
        },
      },
    ],
    storyIntro: 'Luna es una güiña, el gatito salvaje más pequeño de América. Vive en el bosque de Chiloé y solo sale de noche. Hoy necesita encontrar un nuevo hogar. ¿La ayudas sumando y restando?',
    completionFact: '¡Luna tiene un hogar seguro! La güiña es casi imposible de ver porque solo sale de noche. Si alguna vez ves una en el bosque de Chiloé, es un momento muy especial. Proteger el bosque es proteger a Luna.',
    backgroundTheme: 'bosque-noche-estrellada',
  },

  // ─────────────────────────────────────────────
  // Chapter 6: Neptuno el Chungungo
  // Addition and subtraction with 3 digits, 100-999
  // ─────────────────────────────────────────────
  {
    id: 'ch6-chungungo',
    order: 6,
    animal: {
      id: 'neptuno',
      name: 'Neptuno',
      species: 'Chungungo (Nutria marina)',
      scientificName: 'Lontra felina',
      personality: 'Juguetón y acuático, le encanta nadar, bucear y romper erizos contra las rocas.',
      description: 'El chungungo es la nutria marina más pequeña del mundo. Vive en las costas rocosas del Pacífico sur, desde Perú hasta el Cabo de Hornos. Es un excelente buceador y come erizos, cangrejos y peces.',
      conservationStatus: 'En peligro',
      size: 'Unos 80-115 cm de largo incluyendo la cola. Pesado para su tamaño: 3-6 kg de puro músculo acuático.',
    },
    title: 'Neptuno el Chungungo aventurero',
    operation: 'mixed',
    difficultyLevel: 6,
    numberRange: { min: 100, max: 999 },
    stages: [
      {
        id: 'ch6-s1',
        chapterId: 'ch6-chungungo',
        order: 1,
        title: 'La poza de las rocas',
        description: 'Neptuno empieza su día en su poza favorita. Suma y resta los mariscos y algas que encuentra.',
        exercisesRequired: 5,
        funFact: {
          id: 'ch6-ff1',
          text: 'El chungungo tiene el pelaje más denso de todos los mamíferos marinos: ¡hasta 130.000 pelos por centímetro cuadrado! Así se mantiene calentito en el agua fría.',
          category: 'fun',
        },
      },
      {
        id: 'ch6-s2',
        chapterId: 'ch6-chungungo',
        order: 2,
        title: 'Las olas pequeñas',
        description: 'Neptuno nada entre las olas buscando cangrejos. Opera con números de tres cifras para ayudarlo.',
        exercisesRequired: 7,
        funFact: {
          id: 'ch6-ff2',
          text: 'Los chungungos son muy inteligentes: usan rocas como herramientas para romper las conchas de los erizos y sacar la comida de adentro.',
          category: 'behavior',
        },
      },
      {
        id: 'ch6-s3',
        chapterId: 'ch6-chungungo',
        order: 3,
        title: 'Buscando erizos',
        description: 'Neptuno bucea hasta el fondo buscando erizos. Suma y resta para calcular cuántos necesita.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch6-ff3',
          text: 'El chungungo puede aguantar la respiración bajo el agua por varios minutos. ¡Es un campeón de buceo que puede sumergirse hasta 40 metros!',
          category: 'behavior',
        },
      },
      {
        id: 'ch6-s4',
        chapterId: 'ch6-chungungo',
        order: 4,
        title: 'La corriente',
        description: 'Una corriente fuerte arrastra a Neptuno. Suma y resta rápido para que calcule cómo volver a las rocas.',
        exercisesRequired: 8,
        funFact: {
          id: 'ch6-ff4',
          text: 'Los chungungos viven en familias pequeñas. Los padres enseñan a sus crías a nadar, bucear y encontrar comida durante varios meses.',
          category: 'conservation',
        },
      },
      {
        id: 'ch6-s5',
        chapterId: 'ch6-chungungo',
        order: 5,
        title: 'Mar abierto',
        description: '¡Neptuno nada en mar abierto como un campeón! Resuelve los últimos desafíos de tres cifras.',
        exercisesRequired: 6,
        funFact: {
          id: 'ch6-ff5',
          text: 'Quedan muy pocos chungungos en Chile. La contaminación del mar y la pesca con redes son sus mayores amenazas. ¡Cuidar el mar es cuidar a Neptuno!',
          category: 'conservation',
        },
      },
    ],
    storyIntro: 'Neptuno es un chungungo que vive en las rocas de la costa de Chiloé. Es el nadador más rápido de la costa y hoy tiene una gran aventura por delante. ¿Lo ayudas con sumas y restas de números grandes?',
    completionFact: '¡Neptuno es el rey del mar! El chungungo es una nutria marina única que vive en las costas de Chile. Está en peligro porque el mar se contamina. Cada vez que cuidas la playa y el mar, ayudas a Neptuno y sus amigos.',
    backgroundTheme: 'costa-rocosa',
  },
];

export const getChapterById = (id: string): Chapter | undefined =>
  chapters.find((ch) => ch.id === id);

export const getNextChapter = (currentId: string): Chapter | undefined => {
  const current = chapters.find((ch) => ch.id === currentId);
  if (!current) return undefined;
  return chapters.find((ch) => ch.order === current.order + 1);
};

export const EXERCISES_PER_STAGE = [5, 7, 8, 8, 6] as const;
