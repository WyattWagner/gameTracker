---
name: Monster Database Expansion
overview: Expand the Monster Hunter monster database and monster detail pages to support Rise, Sunbreak, and Wilds with game-specific data, materials, images, and presentation while sharing a common monster framework.
todos:
  - id: phase1-core-monster-table
    content: "Phase 1: Design shared monsters table (id, name, slug, species, description, game, monster_type, threat_level, icon_image, large_render_image)"
    status: completed
  - id: phase1-rise-data-table
    content: "Phase 1: Create monster_rise_data table (elemental/ailment weaknesses, status resistances, body parts, hunt/capture/break rewards)"
    status: completed
  - id: phase1-wilds-data-table
    content: "Phase 1: Create monster_wilds_data table (weaknesses, wounds, breakable parts, resistances, Wilds-specific mechanics)"
    status: completed
  - id: phase1-materials-table
    content: "Phase 1: Create monster_materials table (game, name, rarity, drop_source, drop_rate, rank, icon)"
    status: completed
  - id: phase1-images-table
    content: "Phase 1: Create monster_images table (portrait, render, icon, ecology, gallery)"
    status: completed
  - id: phase2-rise-import
    content: "Phase 2: Import Rise monsters (base, Apex, event-exclusive)"
    status: completed
  - id: phase2-sunbreak-import
    content: "Phase 2: Import Sunbreak monsters (MR, variants, rare species, Risen elders)"
    status: completed
  - id: phase2-wilds-import
    content: "Phase 2: Import Wilds monsters with weaknesses, parts, materials, images, ecology"
    status: completed
  - id: phase3-detail-tabs
    content: "Phase 3: Monster detail tabs — Overview, Rise, Sunbreak, Wilds (show only where data exists)"
    status: completed
  - id: phase4-rise-layout
    content: "Phase 4: Rise/Sunbreak layout — reuse existing weakness/reward UI style"
    status: completed
  - id: phase4-wilds-layout
    content: "Phase 4: Wilds layout — dedicated weakness table, body parts, breakables, wounds"
    status: completed
  - id: phase5-materials-tab
    content: "Phase 5: Materials tab with icons, rarity, rank, drop source/rate grouped by LR/HR/MR"
    status: completed
  - id: phase6-image-gallery
    content: "Phase 6: Hero image + thumbnail gallery with lightbox, zoom, responsive layout"
    status: completed
  - id: phase7-search-filters
    content: "Phase 7: Search/filter by game, monster type, weakness element, rank"
    status: completed
  - id: phase8-performance
    content: "Phase 8: Indexing, lazy load, pagination, caching, WebP/AVIF, responsive images"
    status: completed
  - id: phase9-qa
    content: "Phase 9: QA — images, materials, weakness render, tabs, mobile, a11y, duplicates, broken images"
    status: completed
isProject: true
---

# Monster Database Expansion Plan

## Objective

Expand the Monster Hunter monster database and monster detail pages to support multiple games with game-specific data presentation.

The system should support:

- Monster Hunter Rise (Base Game)
- Monster Hunter Rise: Sunbreak
- Monster Hunter Wilds

Each game should have its own monster data, weaknesses, materials, images, and presentation format while sharing a common monster framework.

---

## Phase 1: Database Design

### Create Monster Tables

Design a scalable database structure that supports multiple Monster Hunter games.

#### Core Monster Table

Create a shared `monsters` table containing:

| Field | |
|-------|---|
| id | |
| name | |
| slug | |
| species | |
| description | |
| game | |
| monster_type | |
| threat_level | |
| icon_image | |
| large_render_image | |
| created_at | |
| updated_at | |

#### Game-Specific Monster Data

Create separate tables for game-specific information.

**`monster_rise_data`** — store:

- elemental weaknesses
- ailment weaknesses
- status resistances
- body part weaknesses
- hunt rewards
- capture rewards
- break rewards

**`monster_wilds_data`** — store:

- elemental weaknesses
- body part weakness values
- wound data
- breakable parts
- resistance values
- hunt rewards
- special Wilds-specific mechanics

The Wilds schema should closely match how weakness data is presented in Monster Hunter Wilds.

#### Create Materials Table

**`monster_materials`**

| Field |
|-------|
| id |
| monster_id |
| game |
| material_name |
| rarity |
| drop_source |
| drop_rate |
| rank |
| description |
| icon |

Examples: Scale, Claw, Plate, Gem, Mantle, Hide

#### Create Monster Images Table

**`monster_images`**

| Field |
|-------|
| id |
| monster_id |
| image_url |
| image_type |

Image types: `portrait`, `render`, `icon`, `ecology`, `gallery`

Support multiple images per monster.

---

## Phase 2: Data Population

### Monster Hunter Rise

Import all:

- Base Rise monsters
- Apex monsters
- Event-exclusive monsters

### Monster Hunter Sunbreak

Import all:

- Master Rank monsters
- Variant monsters
- Rare species
- Risen Elder Dragons

Examples: Malzeno, Primordial Malzeno, Risen Crimson Glow Valstrax, Chaotic Gore Magala

### Monster Hunter Wilds

Import all currently available Monster Hunter Wilds monsters.

For each monster include:

- monster information
- elemental weaknesses
- body part weaknesses
- breakable parts
- obtainable materials
- images
- ecology information

---

## Phase 3: Monster Detail Page Redesign

### Create Game Tabs

Within each monster detail page, add tabs:

| Tab | Content |
|-----|---------|
| **Overview** | Shared monster information |
| **Rise** | Rise-specific data |
| **Sunbreak** | Sunbreak-specific data |
| **Wilds** | Wilds-specific data |

Only show tabs for games where data exists.

**Examples:**

- **Rathalos:** Overview · Rise · Sunbreak · Wilds
- **Malzeno:** Overview · Sunbreak

---

## Phase 4: Game-Specific Display Logic

### Rise/Sunbreak Layout

Use the existing monster database layout.

Display:

- elemental weaknesses
- ailment weaknesses
- hunt rewards
- break rewards
- capture rewards

Maintain current UI style.

### Wilds Layout

Create a dedicated Wilds-style presentation.

**Weakness Table** — Fire, Water, Thunder, Ice, Dragon

**Body Part Weakness Table** — Head, Neck, Wings, Forelegs, Back, Tail, Legs

Display separate values for: Slash, Blunt, Ammo, Element

**Breakable Parts Section** — all breakable monster parts

**Wound Information Section** — Wilds-specific wound mechanics if available

---

## Phase 5: Materials Section

Add a dedicated **Materials** tab.

For each material show: icon, name, rarity, rank, drop source, drop rate

Group by: Low Rank · High Rank · Master Rank (where applicable)

---

## Phase 6: Image Gallery

Add a gallery section to every monster page.

- **Hero Image** — large monster render at top
- **Thumbnail Gallery** — portrait, ecology, artwork, in-game screenshots

Features: lightbox viewer, zoom support, responsive layout

---

## Phase 7: Search and Filtering Improvements

Enhance monster search.

| Filter | Options |
|--------|---------|
| **Game** | Rise, Sunbreak, Wilds |
| **Monster Type** | Flying Wyvern, Brute Wyvern, Fanged Beast, Elder Dragon, Leviathan, Temnoceran, etc. |
| **Weakness** | Fire, Water, Thunder, Ice, Dragon |
| **Rank** | Low Rank, High Rank, Master Rank |

---

## Phase 8: Performance Improvements

Implement:

- database indexing on monster name and game
- image lazy loading
- pagination for monster lists
- server-side caching
- optimized image formats (WebP/AVIF)
- responsive image sizing

---

## Phase 9: Quality Assurance

Validate:

- every monster has an image
- every monster has materials
- all weakness data renders correctly
- all game tabs load correctly
- mobile responsiveness
- accessibility (ARIA labels, keyboard navigation)
- no duplicate monsters across databases
- broken image detection
- missing material detection

---

## Expected Result

After completion:

- Full Monster Hunter Rise monster database
- Full Monster Hunter Sunbreak monster database
- Full Monster Hunter Wilds monster database
- Game-specific monster detail pages
- Materials database linked to each monster
- Monster image galleries
- Improved search and filtering
- Optimized performance and responsive UI
- Scalable architecture for future Monster Hunter titles and DLC updates
