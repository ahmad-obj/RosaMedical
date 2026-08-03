# Rosa Medical AI Imagery Pilot Design

Date: 2026-08-04
Branch: `preview/non-product-imagery-01`
Status: Approved for implementation planning

## Objective

Produce three premium, realistic, cinematic non-product images for Rosa Medical through a controlled AI-image production pipeline rather than one-shot prompting:

1. Knives family card
2. Chisels family card
3. Homepage hero

The pilot must prove that AI-generated imagery can be both visually luxurious and anatomically/mechanically credible enough for the website.

## Source Grounding

Instrument geometry and category identity are grounded in the supplied Rosa catalogues.

### Knives

The Knives catalogue contains scalpels, scalpel handles, micro-surgery handles, dermal punches, curettes, corneal scarifiers, knives, dissectors, dermatome instruments and spatulas. For the pilot, the category image must unmistakably communicate a surgical knife/scalpel family rather than a generic tray of instruments.

Preferred geometry references:

- catalogue page 2: scalpel handles #3, #4 and #7, long handles and Liston knife;
- catalogue page 9: Joseph, Convers, Cottle and Freer surgical knives;
- catalogue pages 13-15: double-ended and wood-handled knife/spatula forms.

### Chisels

The Chisels catalogue contains chisels, osteotomes and gouges in straight and curved variants, including Hoke, Stille, Smith-Petersen, Codman, Lambotte, Lexer, Cobb, Cushing and Obwegeser forms.

Preferred geometry references:

- catalogue page 2: simple 13.5 cm chisels and osteotomes;
- catalogue page 4: Stille chisel, gouge and osteotome profiles;
- catalogue pages 5-8: Smith-Petersen, Codman, Lambotte and Lexer forms;
- catalogue pages 11-13: Iowa-University, Farabeuf, Cushing and Obwegeser forms.

The generated image must read as a surgical chisel/osteotome scene immediately. It must not rely on a mixed tray where the chisel is incidental.

### Hero

The hero is not tied to one catalogue family, but it must use credible polished surgical-instrument geometry and preserve the current homepage structure:

- headline and buttons on the left;
- instrument scene on the right;
- wide cinematic crop;
- dark, composed, premium tone;
- no gore, active procedure or fake branding.

## Production Model

### Default: Reference-Locked Generation

Use catalogue-derived reference crops to anchor exact instrument silhouettes and proportions. Generate the surrounding environment, lighting, drape, hands and atmosphere around those forms.

### Escalation: Hybrid Reconstruction

If a slot repeatedly fails geometry review, preserve or reconstruct the exact instrument structure from the reference and generate only the surrounding scene, lighting and surface treatment.

## Pilot Slot Dossiers

## 1. Knives Family Card

### Purpose

Communicate the Knives family instantly and clearly within a small homepage category card.

### Composition

- aspect target: 4:3 master, crop-safe for current family card;
- one dominant surgical scalpel or knife occupies 45-65% of frame;
- optional gloved hand or refined preparation surface;
- supporting instruments limited to one or two and kept secondary;
- focal point near centre-right or upper-right depending card text position;
- enough tonal separation for the instrument silhouette to survive mobile crop.

### Visual Direction

A complete cinematic preparation scene: one polished scalpel/knife being placed, inspected or prepared on a dark blue or charcoal surgical drape, with realistic steel reflections and shallow depth of field.

### Forbidden Failures

- knife hidden among unrelated instruments;
- woodworking knife, kitchen knife or craft scalpel appearance;
- malformed blade-handle connection;
- duplicated or floating blades;
- impossible finger anatomy;
- blood, incision or surgery;
- fake labels, logos or text;
- generic product cutout on empty background.

### Pass Gate

A viewer must identify “surgical knives/scalpels” without reading the card label.

## 2. Chisels Family Card

### Purpose

Communicate surgical chisels/osteotomes unmistakably while retaining cinematic atmosphere.

### Composition

- aspect target: 4:3 master;
- one dominant surgical chisel or osteotome occupies 45-65% of frame;
- blade and handle geometry both visible;
- scene may include a surgical mallet only if the chisel remains the clear primary subject;
- supporting objects must not obscure or confuse category identity;
- controlled diagonal or horizontal composition suitable for card crop.

### Visual Direction

A premium surgical-instrument preparation or craftsmanship scene featuring a clearly recognizable chisel/osteotome on a refined dark work surface or blue surgical drape. Strong material detail, believable bevel, polished steel, restrained dramatic light.

### Forbidden Failures

- carpentry chisel or woodworking bench as the primary visual language;
- random equipment tray with one small chisel;
- blunt stick-like geometry without a clear blade/bevel;
- malformed handle, duplicated tips or impossible metal joins;
- fake factory claim or branded machinery;
- over-dramatic sparks if they imply unsafe medical manufacturing.

### Pass Gate

A viewer must identify a surgical chisel/osteotome as the main subject before noticing any supporting tools.

## 3. Homepage Hero

### Purpose

Establish premium medical credibility and cinematic luxury while preserving headline readability.

### Composition

- aspect target: 16:9 master, minimum 2400 px wide equivalent;
- left 38-45% reserved as dark, low-detail negative space;
- primary instrument cluster on the right;
- foreground, midground and background depth;
- realistic blue-black or charcoal drape, tray or preparation environment;
- optional partial gloved hand or professional presence, never a visible staged portrait;
- safe central crop for narrower desktop and mobile variants.

### Visual Direction

A real-photography-style surgical preparation scene with several polished instruments, controlled metallic highlights, deep shadows, subtle atmosphere and strong right-side visual weight.

### Forbidden Failures

- active surgery, patient, blood or gore;
- instrument pile with no composition;
- distorted rings, hinges, blades or handles;
- floating tools or physically inconsistent shadows;
- excessive fog, glow or cyberpunk colour;
- fake brands, text or certification marks;
- obvious CGI or catalogue-cutout appearance.

### Pass Gate

The image must support the current left-aligned hero copy without reducing readability and must still feel complete when viewed without text.

## Prompt Architecture

Every generation prompt must contain these sections:

1. exact subject and catalogue-grounded geometry;
2. scene and action;
3. composition for the target slot;
4. camera and lens behaviour;
5. lighting and reflections;
6. materials and surface detail;
7. colour treatment;
8. depth and background;
9. explicit negative constraints;
10. crop and output requirements.

No slot may be generated from a loose one-paragraph prompt.

## Generation Loop

For each slot:

1. prepare the reference pack;
2. write prompt v1;
3. generate a small candidate batch;
4. inspect each candidate at full resolution;
5. score instrument accuracy, realism, composition, brand fit and crop safety;
6. document defects precisely;
7. revise the prompt only in response to observed failures;
8. generate a refined batch;
9. test surviving candidates in desktop and mobile placeholders;
10. select one primary and one fallback.

## Review Rubric

### Instrument Accuracy — minimum 9/10

- correct category identity;
- credible proportions;
- mechanically possible joints, handles, blades and bevels;
- no fused, duplicated or floating parts.

### Photographic Realism — minimum 8/10

- physically consistent lighting;
- believable metal reflections;
- sensible depth of field;
- realistic hands and surfaces;
- no obvious AI artefacts.

### Slot Composition — minimum 9/10

- focal point survives actual card or hero crop;
- required text-safe region remains usable;
- subject remains recognizable on mobile;
- no accidental visual conflict with typography.

### Brand Alignment — minimum 8/10

- premium, composed and restrained;
- professional medical tone;
- compatible with Rosa red, near-black, white and cool steel;
- no retail, gaming, cyberpunk or generic SaaS feel.

## Deliverables Per Slot

- reference pack;
- prompt v1;
- candidate contact sheet;
- detailed critique log;
- revised prompt;
- refined candidate contact sheet;
- desktop placeholder preview;
- mobile placeholder preview;
- selected primary;
- selected fallback;
- final crop and usage notes.

## Scope Boundaries

- This pilot covers only Knives, Chisels and the homepage hero.
- Scissors, Punches, Cutters, procurement, About and catalogue imagery are not regenerated until the pilot method proves reliable.
- Product-detail imagery remains owned by the separate product-image workstream.
- No generated image is merged into `main` without explicit user approval.

## Completion Criteria

The pilot is complete only when all three slots have at least one candidate that passes every minimum score and both desktop and mobile placeholder tests.