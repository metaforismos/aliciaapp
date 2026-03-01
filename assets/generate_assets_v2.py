#!/usr/bin/env python3
"""
Chiloé Game Asset Generator v2
================================
Converts reference photos of real Chiloé flora/fauna into cartoon game assets
with transparent backgrounds using OpenAI's GPT Image API (image-to-image edit).

KEY CHANGE vs v1: Instead of generating from text (which produces inaccurate species),
this version takes REAL PHOTOS as input and stylizes them into cartoon illustrations,
preserving the actual appearance of each species.

Pipeline: Reference Photo → GPT Image Edit (cartoonize + transparent bg) → PNG asset

Usage:
    export OPENAI_API_KEY="sk-..."
    
    # Step 1: Populate reference photos
    python generate_assets_v2.py --download-refs          # Auto-download from Wikipedia/iNaturalist
    # OR manually place photos in refs/{categoria}/{nombre}.jpg
    
    # Step 2: Generate cartoon assets
    python generate_assets_v2.py                           # Process all
    python generate_assets_v2.py --only fauna              # Process one category
    python generate_assets_v2.py --dry-run                 # Preview without API calls

Requirements:
    pip install openai requests pillow
"""

import os
import csv
import sys
import time
import json
import argparse
import base64
import requests
from pathlib import Path
from io import BytesIO

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install pillow")
    sys.exit(1)

try:
    from openai import OpenAI
except ImportError:
    print("ERROR: openai not installed. Run: pip install openai")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
INVENTORY_FILE = Path(__file__).parent / "inventory_v2.csv"
REFS_DIR = Path(__file__).parent / "refs"        # Reference photos go here
OUTPUT_DIR = Path(__file__).parent / "assets"     # Final transparent PNGs
RAW_DIR = Path(__file__).parent / "assets" / "_raw"  # Pre-transparency versions
LOG_FILE = Path(__file__).parent / "generation_log.csv"

# Model config
MODEL = "gpt-image-1"  # Use gpt-image-1.5 if available on your account
MAX_IMAGE_SIZE = (1024, 1024)  # Resize refs before sending to API

# Rate limiting
API_DELAY = 3.0  # seconds between requests (gpt-image-1 is slower than DALL-E)

# The cartoonization prompt — consistent style across ALL assets
CARTOON_PROMPT = """Transform this reference photo into a children's book illustration style cartoon.

CRITICAL RULES:
- PRESERVE the exact shape, structure, and proportions of the subject in the photo
- Keep it botanically/zoologically ACCURATE — this is a real species from Chiloé Island, Chile
- Use a warm, hand-drawn cartoon style with soft edges suitable for kids aged 5-9
- Use warm earth tones (greens, browns, oranges) consistent with a forest game
- The subject must be ISOLATED — no ground, no shadows, no background elements
- Clean edges suitable for compositing in a game

STYLE: Similar to a high-quality children's nature book illustration. Think "Charley Harper meets Studio Ghibli" — stylized but recognizable.
"""

# Per-category prompt additions
CATEGORY_PROMPTS = {
    "trees": "Keep the tree's distinctive bark texture, branching pattern, and leaf shape clearly visible and accurate.",
    "plants": "Preserve the plant's unique leaf shape, size proportions, and any flowers or distinctive features.",
    "fauna": "Keep the animal's body proportions, coloring, and distinctive features accurate. Make it cute but recognizable as the actual species.",
    "environment": "Maintain the natural formation and textures. Simplify but keep it recognizable.",
    "buildings": "Keep the architectural style authentic to Chiloé. Preserve colors and structural details.",
}


# ---------------------------------------------------------------------------
# Reference Image Handling
# ---------------------------------------------------------------------------
def prepare_reference_image(image_path: Path) -> bytes:
    """Load, resize, and encode a reference image for the API."""
    img = Image.open(image_path)
    
    # Convert to RGB if necessary (remove alpha channel from refs)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # Resize if too large (API has limits + saves tokens/cost)
    img.thumbnail(MAX_IMAGE_SIZE, Image.LANCZOS)
    
    # Convert to PNG bytes
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


def find_reference_image(nombre: str, categoria: str) -> Path | None:
    """Find a reference image for the given asset."""
    base_name = nombre.split("_v")[0]  # Strip variant suffix
    
    search_paths = [
        REFS_DIR / categoria / f"{nombre}.jpg",
        REFS_DIR / categoria / f"{nombre}.png",
        REFS_DIR / categoria / f"{nombre}.jpeg",
        REFS_DIR / categoria / f"{nombre}.webp",
        REFS_DIR / categoria / f"{base_name}.jpg",
        REFS_DIR / categoria / f"{base_name}.png",
        REFS_DIR / categoria / f"{base_name}.jpeg",
        REFS_DIR / categoria / f"{base_name}.webp",
    ]
    
    for path in search_paths:
        if path.exists():
            return path
    
    return None


# ---------------------------------------------------------------------------
# Wikipedia/iNaturalist Reference Image Downloader
# ---------------------------------------------------------------------------
def download_wikipedia_image(search_term: str, output_path: Path) -> bool:
    """Try to download a reference image from Wikipedia."""
    try:
        # Search Wikipedia for the page
        search_url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "format": "json",
            "titles": search_term,
            "prop": "pageimages",
            "pithumbsize": 1024,
            "redirects": 1,
        }
        resp = requests.get(search_url, params=params, timeout=10)
        data = resp.json()
        
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumb_url = page.get("thumbnail", {}).get("source")
            if thumb_url:
                img_resp = requests.get(thumb_url, timeout=15)
                if img_resp.status_code == 200:
                    output_path.parent.mkdir(parents=True, exist_ok=True)
                    output_path.write_bytes(img_resp.content)
                    return True
        return False
    except Exception as e:
        print(f"    Wikipedia download failed: {e}")
        return False


def download_references(inventory: list[dict]):
    """Download reference images for all items in inventory."""
    print("Downloading reference images from Wikipedia...\n")
    
    success = 0
    skipped = 0
    failed = 0
    
    for item in inventory:
        nombre = item["nombre"].split("_v")[0]  # Base name without variant
        categoria = item["categoria"]
        wiki_term = item.get("wiki_search", item["descripcion"].split(",")[0])
        
        # Check if we already have a ref
        existing = find_reference_image(nombre, categoria)
        if existing:
            print(f"  ✓ {nombre}: already have {existing.name}")
            skipped += 1
            continue
        
        output_path = REFS_DIR / categoria / f"{nombre}.jpg"
        print(f"  → {nombre}: searching '{wiki_term}'...", end=" ")
        
        if download_wikipedia_image(wiki_term, output_path):
            print(f"✓ saved")
            success += 1
        else:
            print(f"✗ NOT FOUND — add manually to refs/{categoria}/{nombre}.jpg")
            failed += 1
        
        time.sleep(0.5)  # Be nice to Wikipedia
    
    print(f"\nDone: {success} downloaded, {skipped} already existed, {failed} need manual download")
    if failed > 0:
        print(f"\nFor missing images, manually save photos to refs/{{category}}/{{name}}.jpg")
        print("Good sources: iNaturalist.org, Wikipedia Commons, Flickr (CC licensed)")


# ---------------------------------------------------------------------------
# Cartoon Generation via GPT Image Edit API
# ---------------------------------------------------------------------------
def cartoonize_image(
    client: OpenAI,
    ref_image_bytes: bytes,
    nombre: str,
    descripcion: str,
    categoria: str,
    model: str = MODEL,
) -> bytes | None:
    """Transform a reference photo into a cartoon game asset using GPT Image edit."""
    
    category_extra = CATEGORY_PROMPTS.get(categoria, "")
    
    prompt = (
        f"{CARTOON_PROMPT}\n\n"
        f"Species/subject: {descripcion}\n"
        f"{category_extra}"
    )
    
    try:
        result = client.images.edit(
            model=model,
            image=ref_image_bytes,
            prompt=prompt,
            size="1024x1024",
            quality="medium",
            background="transparent",
        )
        
        image_base64 = result.data[0].b64_json
        image_bytes = base64.b64decode(image_base64)
        
        print(f"  ✓ Cartoonized: {nombre} ({len(image_bytes) // 1024}KB)")
        return image_bytes
        
    except Exception as e:
        print(f"  ✗ API error for {nombre}: {e}")
        return None


# ---------------------------------------------------------------------------
# Inventory
# ---------------------------------------------------------------------------
def load_inventory(filepath: Path, only_category: str | None = None) -> list[dict]:
    """Load and filter the CSV inventory."""
    items = []
    seen_bases = set()
    
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if only_category and row["categoria"] != only_category:
                continue
            
            variantes = int(row.get("variantes", 1))
            for v in range(variantes):
                item = dict(row)
                if variantes > 1:
                    item["nombre"] = f"{row['nombre']}_v{v+1}"
                items.append(item)
    
    return items


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
def log_result(log_path: Path, item: dict, status: str, notes: str = ""):
    write_header = not log_path.exists()
    with open(log_path, "a", encoding="utf-8") as f:
        if write_header:
            f.write("timestamp,nombre,categoria,etapa,status,notes\n")
        f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')},{item['nombre']},{item['categoria']},{item['etapa']},{status},{notes}\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Chiloé Game Asset Generator v2")
    parser.add_argument("--dry-run", action="store_true", help="Preview without API calls")
    parser.add_argument("--only", type=str, help="Only process this category")
    parser.add_argument("--skip-existing", action="store_true", help="Skip assets that already exist")
    parser.add_argument("--download-refs", action="store_true", help="Download reference images from Wikipedia")
    parser.add_argument("--inventory", type=str, default=str(INVENTORY_FILE))
    parser.add_argument("--model", type=str, default=MODEL, help="OpenAI model (gpt-image-1 or gpt-image-1.5)")
    args = parser.parse_args()
    
    if args.model != MODEL:
        # Override model at module level for cartoonize_image
        os.environ["_CHILOE_MODEL"] = args.model
    
    model_to_use = args.model
    
    # Load inventory
    inventory = load_inventory(Path(args.inventory), args.only)
    if not inventory:
        print("No items in inventory. Check your CSV.")
        sys.exit(1)
    
    # Download refs mode
    if args.download_refs:
        download_references(inventory)
        return
    
    # Validate API key
    openai_key = os.environ.get("OPENAI_API_KEY")
    if not openai_key and not args.dry_run:
        print("ERROR: OPENAI_API_KEY not set.")
        sys.exit(1)
    
    # Create directories
    categories = set(item["categoria"] for item in inventory)
    for cat in categories:
        (OUTPUT_DIR / cat).mkdir(parents=True, exist_ok=True)
        (RAW_DIR / cat).mkdir(parents=True, exist_ok=True)
        (REFS_DIR / cat).mkdir(parents=True, exist_ok=True)
    
    # Check which items have reference images
    items_with_refs = []
    items_missing_refs = []
    
    for item in inventory:
        ref_path = find_reference_image(item["nombre"], item["categoria"])
        if ref_path:
            item["_ref_path"] = ref_path
            items_with_refs.append(item)
        else:
            items_missing_refs.append(item)
    
    # Summary
    print("=" * 60)
    print(f"Chiloé Asset Generator v2 (image-to-image)")
    print(f"=" * 60)
    print(f"Model: {model_to_use}")
    print(f"Inventory: {len(inventory)} assets total")
    print(f"  ✓ With reference photos: {len(items_with_refs)}")
    print(f"  ✗ Missing reference photos: {len(items_missing_refs)}")
    
    if items_missing_refs:
        print(f"\nMissing refs (add photos to refs/ or run --download-refs):")
        for item in items_missing_refs:
            print(f"  refs/{item['categoria']}/{item['nombre']}.jpg")
    
    if args.dry_run:
        # Cost estimate: GPT Image edit is ~$0.02-0.08 per image depending on quality
        est_cost = len(items_with_refs) * 0.04
        est_time = len(items_with_refs) * 8
        
        print(f"\n--- DRY RUN ---")
        print(f"\nWould process {len(items_with_refs)} assets:")
        for item in items_with_refs:
            print(f"  [{item['categoria']}] {item['nombre']} ← {item['_ref_path'].name}")
        
        print(f"\n--- Estimated Costs ---")
        print(f"  GPT Image edit: {len(items_with_refs)} images × ~$0.04 = ~${est_cost:.2f}")
        print(f"  remove.bg: NOT NEEDED (transparent bg is native)")
        print(f"  TOTAL: ~${est_cost:.2f}")
        print(f"  Estimated time: ~{est_time}s ({est_time / 60:.1f} min)")
        return
    
    if not items_with_refs:
        print("\nNo items with reference photos. Nothing to process.")
        print("Run --download-refs or manually add photos to refs/")
        return
    
    # Initialize client
    client = OpenAI(api_key=openai_key)
    
    # Process
    success = 0
    errors = 0
    skipped = 0
    
    for i, item in enumerate(items_with_refs, 1):
        nombre = item["nombre"]
        cat = item["categoria"]
        ref_path = item["_ref_path"]
        final_path = OUTPUT_DIR / cat / f"{nombre}.png"
        
        print(f"\n[{i}/{len(items_with_refs)}] {nombre} ({cat}) ← {ref_path.name}")
        
        if args.skip_existing and final_path.exists():
            print(f"  → Skipped (exists)")
            skipped += 1
            continue
        
        # Prepare reference image
        ref_bytes = prepare_reference_image(ref_path)
        
        # Cartoonize
        result_bytes = cartoonize_image(
            client, ref_bytes, nombre, item["descripcion"], cat, model=model_to_use
        )
        
        if result_bytes is None:
            errors += 1
            log_result(LOG_FILE, item, "error", "API call failed")
            continue
        
        # Save
        final_path.write_bytes(result_bytes)
        
        # Also save raw copy
        raw_path = RAW_DIR / cat / f"{nombre}.png"
        raw_path.write_bytes(result_bytes)
        
        success += 1
        log_result(LOG_FILE, item, "success")
        
        time.sleep(API_DELAY)
    
    # Summary
    print(f"\n{'=' * 60}")
    print(f"Done!")
    print(f"  ✓ Success: {success}")
    print(f"  ✗ Errors: {errors}")
    print(f"  → Skipped: {skipped}")
    print(f"\nAssets: {OUTPUT_DIR}")
    print(f"Log: {LOG_FILE}")


if __name__ == "__main__":
    main()
