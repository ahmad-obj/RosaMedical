# Cinematic Web Sourcing Reset

**Date:** 2026-08-03
**Branch:** `preview/non-product-imagery-01`

## Status

The first catalogue-derived candidate batch and all locally generated replacement images are rejected. They are not approved, must not be integrated, and must not be treated as implementation-ready assets.

## Root Cause

The sourcing task was incorrectly substituted with image generation and catalogue-composite work. That violated the explicit requirement to find real existing imagery on the web and produced visually weak, non-cinematic results.

## Corrected Rule

From this point forward:

- source real existing photographs from web and stock-photo sources only;
- do not call image-generation tools for this task;
- do not use catalogue cutouts as substitutes for environmental photography;
- prioritize full believable scenes, environmental context, depth, tactile surfaces, realistic lighting and clear subjects;
- retain one primary and one fallback per confirmed slot;
- record source URL, creator, rights position, dimensions when available, orientation, focal point and crop guidance;
- use reference-only restricted images when necessary to meet the visual bar, but label them honestly;
- preserve product-image and button-animation agent boundaries;
- do not merge this preview branch without explicit approval.

## Visual Bar

Accepted imagery should resemble premium editorial photography:

- dark or controlled cinematic lighting;
- real instruments, hands, drapes, trays, workshops, catalogues or inspection environments;
- strong scene composition rather than isolated object placement;
- believable metallic reflections and materials;
- no obvious AI artifacts;
- no graphic surgery, blood, visible third-party branding, embedded promotional text or fake certification claims.

## Required Next Deliverable

A new web-sourced shortlist and in-layout review package must replace the rejected first batch before any implementation work resumes.
