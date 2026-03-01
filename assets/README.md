# Chiloé Game Asset Generator

Genera assets cartoon con fondo transparente para el juego "Las Aventuras de Alicia en Chiloé".

## Setup

```bash
pip install -r requirements.txt
```

## API Keys

Necesitas 2 API keys como variables de entorno:

```bash
export OPENAI_API_KEY="sk-..."          # https://platform.openai.com/api-keys
export REMOVEBG_API_KEY="..."           # https://www.remove.bg/api (free: 50/mes)
```

## Uso

### 1. Dry run (ver qué se va a generar + costos estimados)
```bash
python generate_assets.py --dry-run
```

### 2. Generar todo
```bash
python generate_assets.py
```

### 3. Generar solo una categoría
```bash
python generate_assets.py --only fauna
python generate_assets.py --only trees
python generate_assets.py --only plants
python generate_assets.py --only environment
python generate_assets.py --only buildings
```

### 4. Cambiar estilo artístico
```bash
python generate_assets.py --style watercolor
python generate_assets.py --style flat
python generate_assets.py --style default    # children's book illustration
```

### 5. Reruns parciales
```bash
# Saltar assets que ya existen
python generate_assets.py --skip-existing

# Solo generar cartoons sin remover fondo (para revisar calidad primero)
python generate_assets.py --skip-bg-removal

# Solo remover fondo de imágenes raw ya generadas
python generate_assets.py --only-bg-removal
```

## Estructura de salida

```
assets/
├── trees/
│   ├── arrayan_grande.png      ← PNG transparente final
│   ├── arrayan_mediano.png
│   └── ...
├── fauna/
│   ├── pudu_idle_v1.png
│   ├── pudu_idle_v2.png        ← variantes
│   ├── pudu_idle_v3.png
│   └── ...
├── plants/
├── environment/
├── buildings/
└── _raw/                       ← originales pre-bg-removal
    ├── trees/
    ├── fauna/
    └── ...
```

## Inventario

Edita `inventory.csv` para agregar/quitar assets. Columnas:

| Columna | Descripción |
|---------|-------------|
| nombre | ID único del asset (sin espacios) |
| descripcion | Descripción en inglés para DALL-E (más detalle = mejor resultado) |
| categoria | trees / plants / fauna / environment / buildings |
| etapa | bosque_oscuro / arroyo / helechos / claro / reef |
| variantes | Número de variaciones a generar (default: 1) |

## Costos estimados (inventario actual: ~45 assets)

| Servicio | Costo |
|----------|-------|
| DALL-E 3 (standard) | ~$1.80 |
| remove.bg | $0 (50 gratis/mes) |
| **Total** | **~$1.80** |

## Tips

- Corre primero con `--skip-bg-removal` para revisar la calidad de las imágenes
- Si un asset no te gusta, borra el archivo raw y vuelve a correr con `--skip-existing`
- Las descripciones en inglés dan mejor resultado en DALL-E que en español
- El campo `variantes` genera múltiples versiones del mismo asset (útil para el Pudú)
