#!/usr/bin/env node
/**
 * generate-backgrounds.mjs
 *
 * Generates stage background images using OpenAI DALL-E 3.
 * Outputs PNG images to public/images/backgrounds/{theme}.png
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-backgrounds.mjs
 *   OPENAI_API_KEY=sk-... node scripts/generate-backgrounds.mjs --dry-run
 *   OPENAI_API_KEY=sk-... node scripts/generate-backgrounds.mjs --only bosque-valdiviano
 *   OPENAI_API_KEY=sk-... node scripts/generate-backgrounds.mjs --skip-existing
 */

import { writeFile, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'images', 'backgrounds');

// ────────────────────────────────────────────
// Style base prompt — consistent children's book illustration feel
// ────────────────────────────────────────────

const STYLE_BASE = `Children's book illustration style, hand-drawn watercolor and gouache, warm earth tones with rich natural colors, soft edges, slightly stylized, suitable for an educational game for kids aged 5-9. Scenic landscape background with depth and layers (foreground, midground, background). No characters, no animals, no text, no UI elements. The scene should feel immersive and inviting, like stepping into a storybook page set in Chiloé Island, southern Chile.`;

// ────────────────────────────────────────────
// Background definitions — one per chapter theme
// ────────────────────────────────────────────

const BACKGROUNDS = [
  {
    id: 'bosque-valdiviano',
    name: 'Valdivian Temperate Rainforest',
    prompt: `${STYLE_BASE}

Scene: A lush Valdivian temperate rainforest on Chiloé Island. Dense canopy of native trees including Arrayán trees with distinctive smooth orange-cinnamon colored bark, tall dark Coigüe trees, and Canelo trees with glossy broad leaves. The forest floor is covered in giant ferns (Ampe and Costilla de vaca), thick green moss on rocks and fallen logs. Soft misty light filters through the canopy creating a mystical atmosphere. A narrow dirt trail winds through the forest. Rich palette of deep greens (#2D5016, #4A7C2E), earthy browns (#8B6914, #5C3D1A), with touches of the distinctive orange Arrayán bark. Vertical composition showing the towering forest.`,
  },
  {
    id: 'pradera-humedal',
    name: 'Wetland Prairie',
    prompt: `${STYLE_BASE}

Scene: An open wetland prairie (humedal) on Chiloé Island. Wide open landscape with tall grasses, cattails, and reeds along the edges of shallow water pools that reflect the sky. Scattered low bushes and flowering plants. In the distance, gentle rolling green hills. The sky takes up more space here — it's an open, airy scene compared to the dense forest. A muddy trail winds between pools and grass patches. Palette of sky blues (#4A9CC7), water reflections, fresh greens (#7CB342, #A5D6A7), golden grass tips. Some small wildflowers dot the prairie. Vertical composition with big sky.`,
  },
  {
    id: 'bosque-profundo',
    name: 'Deep Dense Forest',
    prompt: `${STYLE_BASE}

Scene: The deepest, darkest part of the Chiloé native forest. Massive ancient trees with enormous trunks covered in thick moss and lichen. Very dense canopy that barely lets light through. Fallen logs on the forest floor with colorful mushrooms growing on them. Thick undergrowth of ferns and native bamboo (Quila). A barely visible trail covered in leaves winds through the undergrowth. Mysterious but not scary — more enchanting, like a fairy tale forest. Very dark greens (#1E4510, #163A0D), rich browns (#5C3D1A, #3D2B1F). Subtle rays of light breaking through the canopy. Vertical composition emphasizing the towering trees.`,
  },
  {
    id: 'bosque-nocturno',
    name: 'Night Forest with Fireflies',
    prompt: `${STYLE_BASE}

Scene: A Chiloé forest at nighttime but warm and magical, not scary. Dark blue-purple sky visible through tree canopy gaps with a few stars. The trees are silhouetted in deep dark blues and purples. Scattered throughout the forest are glowing fireflies (luciérnagas) creating warm golden dots of light. A cozy hollow tree trunk is visible, like a warm den. Soft bioluminescent mushrooms glow faintly on tree trunks. The overall feeling is cozy, dreamy, and magical — like a child's bedroom nightlight. Palette: deep purples (#1a1a2e, #533483), midnight blues (#16213e, #0f3460), warm firefly gold (#FFD700). A trail with faintly glowing stepping stones.`,
  },
  {
    id: 'bosque-noche-estrellada',
    name: 'Starry Moonlit Forest',
    prompt: `${STYLE_BASE}

Scene: A Chiloé forest under a spectacular starry sky with a large bright moon. Silver moonlight streams through the tree branches creating beautiful light rays. The trees are elegant dark silhouettes against the starry sky. Stars twinkle brightly — this is the Chiloé sky far from city lights. Moonbeams create silver patches on the forest floor. The atmosphere is mysterious but beautiful, elegant and calm. Tree branches create interesting silhouette patterns against the sky. Palette: deep night sky (#0d1b2a, #1b2838), silver moonlight (#C0C0C0), warm moon glow (#F5F5DC), subtle blue-grey trees (#415a77). A moonlit trail through the forest. Vertical composition with starry sky visible through canopy.`,
  },
  {
    id: 'costa-rocosa',
    name: 'Rocky Chiloé Coast',
    prompt: `${STYLE_BASE}

Scene: The rocky Pacific coast of Chiloé Island. Dark volcanic rocks and boulders in the foreground with tide pools containing colorful sea life (starfish, anemones, small crabs visible in the pools). Ocean waves crash against the rocks creating white sea foam and spray. Green and brown seaweed/kelp drapes over the rocks. In the background, the vast Pacific Ocean stretches to the horizon under a dynamic sky. A path winds between the large coastal rocks. The feeling is adventurous and wild, with the power of the ocean. Palette: ocean blues (#1a535c, #2E6B8A), teal water (#4ecdc4), dark grey rocks (#5C5C5C, #4A4A4A), white foam (#F0F8FF), kelp greens. Vertical composition with ocean at top and rocky shore below.`,
  },
];

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(apiKey, prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      size: '1024x1792', // Vertical/portrait — matches the left panel layout
      quality: 'hd',     // HD for backgrounds ($0.12 per image)
      n: 1,
      response_format: 'url',
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${error}`);
  }

  const data = await res.json();
  const imageUrl = data.data[0].url;
  const revisedPrompt = data.data[0].revised_prompt;

  // Download the image
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
  const imageBuffer = Buffer.from(await imgRes.arrayBuffer());

  return { imageBuffer, revisedPrompt };
}

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipExisting = args.includes('--skip-existing');
  const onlyFilter = args.find((a) => args[args.indexOf(a) - 1] === '--only');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey && !dryRun) {
    console.error('ERROR: Set OPENAI_API_KEY environment variable.');
    console.error('Usage: OPENAI_API_KEY=sk-... node scripts/generate-backgrounds.mjs');
    process.exit(1);
  }

  const backgrounds = onlyFilter
    ? BACKGROUNDS.filter((b) => b.id === onlyFilter)
    : BACKGROUNDS;

  if (backgrounds.length === 0) {
    console.error(`No background found matching: ${onlyFilter}`);
    console.error(`Available: ${BACKGROUNDS.map((b) => b.id).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🎨  AliciaApp Background Generator (DALL-E 3)\n`);
  console.log(`Backgrounds to generate: ${backgrounds.length}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Size: 1024x1792 (portrait, HD quality)`);

  if (dryRun) {
    console.log(`\n── DRY RUN ──\n`);
    for (const bg of backgrounds) {
      console.log(`[${bg.id}] ${bg.name}`);
      console.log(`  Prompt: ${bg.prompt.substring(0, 120)}...\n`);
    }
    const cost = backgrounds.length * 0.12;
    console.log(`Estimated cost: ${backgrounds.length} × $0.12 (HD) = $${cost.toFixed(2)}`);
    console.log(`Estimated time: ~${backgrounds.length * 20} seconds`);
    return;
  }

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const bg of backgrounds) {
    const outputPath = join(OUTPUT_DIR, `${bg.id}.png`);

    if (skipExisting && await fileExists(outputPath)) {
      console.log(`  → Skipped ${bg.id} (already exists)`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`  ⏳ [${generated + skipped + errors + 1}/${backgrounds.length}] ${bg.id}...`);

      const { imageBuffer, revisedPrompt } = await generateImage(apiKey, bg.prompt);
      await writeFile(outputPath, imageBuffer);

      generated++;
      console.log(` ✓ (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
      console.log(`    Revised: ${revisedPrompt.substring(0, 100)}...`);

      // Rate limit
      await sleep(2000);
    } catch (err) {
      console.log(` ✗ ERROR: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n── Done ──\n`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`\nBackgrounds saved to: ${OUTPUT_DIR}`);
  console.log(`\nTo use in StageScene.tsx, update it to load:`);
  console.log(`  /images/backgrounds/{theme}.png`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
