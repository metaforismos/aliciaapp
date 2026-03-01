#!/usr/bin/env node

/**
 * Asset Generation Pipeline for AliciaApp
 *
 * Generates animal character images and stage backgrounds using:
 * - OpenAI DALL-E 3 for image generation
 * - remove.bg for background removal on animal characters
 *
 * Usage:
 *   # Option 1: env vars inline
 *   OPENAI_API_KEY=... REMOVEBG_API_KEY=... node scripts/generate-assets.mjs
 *
 *   # Option 2: create .env file in project root then run
 *   npm run generate-assets
 *
 *   # Option 3: generate only animals or backgrounds
 *   npm run generate-assets -- --animals-only
 *   npm run generate-assets -- --backgrounds-only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load .env file if it exists (no dependency needed)
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY env var is required');
  process.exit(1);
}
if (!REMOVEBG_API_KEY) {
  console.error('ERROR: REMOVEBG_API_KEY env var is required');
  process.exit(1);
}

// ─── Asset definitions ───────────────────────────────────────

const STYLE_PREFIX = 'Watercolor children\'s book illustration style, warm and friendly, soft edges, Chilean Valdivian forest color palette (deep greens, earthy browns, river blues, sunset oranges). Cute but anatomically respectful. No text or letters in the image.';

const animals = [
  {
    id: 'pudu',
    name: 'Pascual el Pudú',
    prompt: `${STYLE_PREFIX} A cute small Pudú deer (Pudu puda), the smallest deer in the world, standing in a Chilean temperate rainforest. Reddish-brown fur, small rounded ears, tiny antler nubs, big expressive dark eyes. The pudú is about 35-45cm tall. Friendly expression, slightly shy posture. Full body view, facing slightly right. White background.`,
  },
  {
    id: 'bandurria',
    name: 'Berta y Bruno las Bandurrias',
    prompt: `${STYLE_PREFIX} Two cute Bandurria birds (Theristicus melanopis, Black-faced Ibis) standing together as a pair in a Chilean wetland. Long curved beaks, grey plumage with yellowish head and neck, pinkish legs. One bird slightly taller than the other. Friendly expressions, sociable posture. Full body view. White background.`,
  },
  {
    id: 'zorro',
    name: 'Darwin el Zorrito',
    prompt: `${STYLE_PREFIX} A cute Darwin's Fox (Lycalopex fulvipes), a small endangered Chilean fox, standing alert in a dense forest. Dark grey-brown fur, shorter legs than typical foxes, bushy tail, bright curious eyes. Brave and adventurous expression. The fox is small, about 60cm long. Full body view, facing slightly left. White background.`,
  },
  {
    id: 'monito',
    name: 'Momo el Monito del Monte',
    prompt: `${STYLE_PREFIX} A tiny adorable Monito del Monte (Dromiciops gliroides), a small marsupial from Chilean temperate forests. Very small (fits in a palm), grey-brown fur, large round dark eyes, rounded ears, prehensile tail curled around a branch. Sleepy and sweet expression. Full body view, sitting on a mossy branch. White background.`,
  },
  {
    id: 'guina',
    name: 'Luna la Güiña',
    prompt: `${STYLE_PREFIX} A cute Kodkod cat (Leopardus guigna), the smallest wild cat in the Americas, in a nighttime Chilean forest setting. Small spotted cat with tawny fur with dark spots, round face, large green eyes glowing slightly, short tail. Stealthy but friendly expression. The cat is smaller than a domestic cat. Full body view. White background.`,
  },
  {
    id: 'chungungo',
    name: 'Neptuno el Chungungo',
    prompt: `${STYLE_PREFIX} A cute Marine Otter / Chungungo (Lontra felina), the smallest marine otter in the world, on rocky Chilean coast. Dark brown dense fur, webbed feet, whiskers, playful expression, holding a sea urchin. Muscular but cute build, about 80cm long. Rocky tide pool environment. Full body view. White background.`,
  },
];

const backgrounds = [
  {
    id: 'bosque-valdiviano',
    name: 'Bosque Valdiviano (Ch1: Pudú)',
    prompt: `${STYLE_PREFIX} A panoramic scene of a Chilean Valdivian temperate rainforest. Dense canopy of Arrayán trees with characteristic smooth orange-cinnamon bark, Coigüe trees, Canelo trees. Ferns on the forest floor, moss-covered logs, filtered green light. Mysterious but inviting atmosphere. A small dirt path winds through the forest. No animals, no people. Landscape orientation, suitable as a game background.`,
  },
  {
    id: 'pradera-humedal',
    name: 'Pradera y Humedal (Ch2: Bandurria)',
    prompt: `${STYLE_PREFIX} A panoramic scene of a Chilean Chiloé wetland and meadow. Open grassy prairie transitioning into a marshy wetland with reeds and rushes. Distant rolling green hills. Overcast sky typical of Chiloé. Small streams cutting through the grass. Peaceful and open atmosphere. No animals, no people. Landscape orientation, suitable as a game background.`,
  },
  {
    id: 'bosque-profundo',
    name: 'Bosque Profundo (Ch3: Zorro)',
    prompt: `${STYLE_PREFIX} A panoramic scene of a deep Chilean forest at dawn. Thick moss-covered trees, fallen logs with insects visible, murta bushes with small red berries. Morning mist filtering through the canopy. Ground covered with leaves and small mushrooms. Dense and wild but beautiful. No animals, no people. Landscape orientation, suitable as a game background.`,
  },
  {
    id: 'bosque-nocturno',
    name: 'Bosque Nocturno (Ch4: Monito del Monte)',
    prompt: `${STYLE_PREFIX} A panoramic scene of a Chilean forest at night under moonlight. Silver moonlight filtering through branches, bioluminescent moss on tree trunks, quintral plants with bright berries. Fireflies dotting the darkness. Magical and mysterious nighttime atmosphere. Stars visible through canopy gaps. No animals, no people. Landscape orientation, suitable as a game background.`,
  },
  {
    id: 'bosque-noche-estrellada',
    name: 'Bosque Noche Estrellada (Ch5: Güiña)',
    prompt: `${STYLE_PREFIX} A panoramic scene of a Chilean forest at night with a spectacular starry sky. Tall Coigüe trees silhouetted against a star-filled sky. Southern Cross constellation visible. Some tree trunks with hollow openings. Peaceful but slightly wild nighttime forest. Subtle blue and purple tones. No animals, no people. Landscape orientation, suitable as a game background.`,
  },
  {
    id: 'costa-rocosa',
    name: 'Costa Rocosa (Ch6: Chungungo)',
    prompt: `${STYLE_PREFIX} A panoramic scene of the rocky coast of Chiloé Island, Chile. Dark volcanic rocks with tide pools, kelp forests visible in clear water, sea urchins and starfish in pools. Waves crashing on rocks in the background. Dramatic Pacific Ocean coast. Seaweed and coastal vegetation. No animals, no people. Landscape orientation, suitable as a game background.`,
  },
];

// ─── API helpers ─────────────────────────────────────────────

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateImage(prompt, size = '1024x1024') {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  [DALL-E] Requesting image (attempt ${attempt})...`);
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size,
          quality: 'standard',
          response_format: 'b64_json',
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      return Buffer.from(data.data[0].b64_json, 'base64');
    } catch (err) {
      console.error(`  [DALL-E] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`  [DALL-E] Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

async function removeBackground(imageBuffer) {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  [remove.bg] Removing background (attempt ${attempt})...`);

      const formData = new FormData();
      formData.append('image_file', new Blob([imageBuffer], { type: 'image/png' }), 'image.png');
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVEBG_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`remove.bg API error ${response.status}: ${errorBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      console.error(`  [remove.bg] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`  [remove.bg] Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
}

// ─── Pipeline ────────────────────────────────────────────────

async function generateAnimalAssets() {
  const animalsDir = path.join(ROOT, 'public/assets/animals');
  fs.mkdirSync(animalsDir, { recursive: true });

  console.log('\n═══ Generating Animal Characters ═══\n');

  for (const animal of animals) {
    const pngPath = path.join(animalsDir, `${animal.id}.png`);
    const noBgPath = path.join(animalsDir, `${animal.id}-nobg.png`);

    // Skip if already generated
    if (fs.existsSync(noBgPath)) {
      console.log(`✓ ${animal.name} — already exists, skipping`);
      continue;
    }

    console.log(`▶ Generating: ${animal.name}`);

    // Step 1: Generate with DALL-E
    const imageBuffer = await generateImage(animal.prompt);
    fs.writeFileSync(pngPath, imageBuffer);
    console.log(`  ✓ Saved original: ${pngPath}`);

    // Step 2: Remove background
    try {
      const noBgBuffer = await removeBackground(imageBuffer);
      fs.writeFileSync(noBgPath, noBgBuffer);
      console.log(`  ✓ Saved no-bg: ${noBgPath}`);
    } catch (err) {
      console.error(`  ✗ Background removal failed for ${animal.id}: ${err.message}`);
      console.log(`  → Original image saved at ${pngPath}`);
    }

    // Rate limiting: wait between requests to avoid hitting limits
    console.log('  ⏳ Waiting before next generation...');
    await sleep(3000);
  }
}

async function generateBackgroundAssets() {
  const bgDir = path.join(ROOT, 'public/assets/backgrounds');
  fs.mkdirSync(bgDir, { recursive: true });

  console.log('\n═══ Generating Stage Backgrounds ═══\n');

  for (const bg of backgrounds) {
    const pngPath = path.join(bgDir, `${bg.id}.png`);

    // Skip if already generated
    if (fs.existsSync(pngPath)) {
      console.log(`✓ ${bg.name} — already exists, skipping`);
      continue;
    }

    console.log(`▶ Generating: ${bg.name}`);

    const imageBuffer = await generateImage(bg.prompt, '1792x1024');
    fs.writeFileSync(pngPath, imageBuffer);
    console.log(`  ✓ Saved: ${pngPath}`);

    // Rate limiting
    console.log('  ⏳ Waiting before next generation...');
    await sleep(3000);
  }
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const animalsOnly = args.includes('--animals-only');
  const backgroundsOnly = args.includes('--backgrounds-only');
  const runAnimals = !backgroundsOnly;
  const runBackgrounds = !animalsOnly;

  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   AliciaApp — Asset Generation Pipeline       ║');
  if (runAnimals) console.log('║   Animals: 6 characters with bg removal       ║');
  if (runBackgrounds) console.log('║   Backgrounds: 6 stage scenes                 ║');
  console.log('╚═══════════════════════════════════════════════╝');

  const startTime = Date.now();

  try {
    if (runAnimals) await generateAnimalAssets();
    if (runBackgrounds) await generateBackgroundAssets();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Pipeline complete in ${elapsed}s`);
    console.log('\nGenerated assets:');
    if (runAnimals) console.log('  public/assets/animals/   — 6 animal characters (original + no-bg)');
    if (runBackgrounds) console.log('  public/assets/backgrounds/ — 6 stage backgrounds');
  } catch (err) {
    console.error(`\n❌ Pipeline failed: ${err.message}`);
    process.exit(1);
  }
}

main();
