# CLAUDE.md: BAGH, Chahar Bagh layered garden website

## Project
BAGH is a **fictional** luxury fragrance house. Its debut fragrance is *Chahar Bagh*, named after the four-quadrant Persian garden. This is a cinematic scroll experience for a portfolio case study.

- The footer and story section must state that BAGH is a fictional concept and that visuals are AI-generated.
- Tagline: **A garden in a drop.**
- Idea: *Paradise was once a walled garden* (Old Persian *pairidaeza*). *We kept it in a drop.*

## Core idea
The film is the trailer; this site is the place. It must NOT replay the film as scrubbed video frames.
1. **Depth:** the garden is built from separate transparent layers (2.5D) that move at different speeds as the visitor scrolls, so scrolling feels like moving through space.
2. **Time:** scrolling also moves the garden from dawn to gold to amber dusk, so scroll reads as a day passing.
3. **Touch:** the visitor's cursor is a golden drop. It sends ripples across dark water, and petals bloom where it passes. This is the only signature interaction. Keep it subtle.

## Experience, in scroll order

| Scene | Content | Behavior |
|---|---|---|
| 1. Hero | Dark water, golden drop, BAGH mark and wordmark | Cursor ripples on the water; drop trembles very slightly |
| 2. Into the drop | The drop grows to fill the screen; the garden appears inside | Layers scale up and pass the camera, foreground first |
| 3. Dawn, top notes | Cypress rows, water channel, mist, pink light | Layers drift at different speeds; short copy fades in once the scene settles |
| 4. Noon, heart notes | Roses, jasmine, glazed tile | Petals drift; tile turns to petals under the cursor (tap on mobile) |
| 5. Dusk, base notes | Amber light, fountain, the golden bead gathers | Warm tint deepens; bead descends as the user scrolls |
| 6. The bottle | Bottle on dark stone, one drop on the glass | Layers settle and go still; tagline and "Discover" button appear |
| 7. Story and footer | The *pairidaeza* idea, fictional-concept note | Calm, mostly static |

Copy per scene is a few words only. Never paragraphs over the scene.

## Layer system
- Each scene has 4-6 transparent WebP layers: background, mid, foreground, mist, particles (petals, gold dust).
- Files live in `assets/layers/scene-N/` named by depth, for example `01-bg.webp`, `02-mid.webp`, `03-fg.webp`, `04-mist.webp`.
- Use GSAP ScrollTrigger to map scroll progress to each layer's translateY and scale. Deeper layers move slower; foreground layers move faster and scale more.
- Add a very small mouse-parallax offset (a few pixels) on desktop only.
- Use CSS transforms with `will-change: transform` on layers. Do not use heavy WebGL or 3D libraries.
- Between scenes, cross-fade through mist or gold dust. No hard cuts.

## Time of day
- One full-screen overlay of color, using `mix-blend-mode`, driven by scroll: dawn pink (about `#E8A5A0`), then saffron gold (`#C9A24B`), then amber dusk (`#B8651F`).
- Keep the effect soft (low opacity) so the layers' own colors still read.
- Define the three tints as CSS variables.

## Cursor drop and ripples
- Replace the cursor on desktop with a small golden drop. Keep a normal cursor over buttons and links.
- Hero ripples: a small 2D canvas draws expanding, fading concentric rings where the cursor moves, throttled so it stays light. Ring color is faint turquoise and gold.
- Heart scene: hovering a region reveals petals drifting up from the tile (CSS or canvas particles).
- Touch devices: tap triggers a ripple; no custom cursor.
- Everything is disabled under `prefers-reduced-motion`.

## Design system

**Colors:** warm black `#14100C`, gold `#C9A24B`, muted gold `#A88A42`, turquoise `#2BB5B0`, cream `#F4EDE0`, muted text `#8F8269`. Define as CSS variables. Do not add colors without asking.

**Typography:** high-contrast serif for headings and wordmark (Cormorant Garamond or similar), light weight, wide letterspacing on the wordmark (about 0.4em). Clean sans (Inter or similar) for body and UI. Persian text (باغ) in a proper Persian typeface such as Vazirmatn, with `lang="fa"`. Sentence case everywhere except the BAGH wordmark.

**Logo:** gold teardrop containing a stylized Persian-miniature flowering tree with curling branches and round blossoms, rising from two turquoise water lines. Use the SVG in `assets/logo/`. Never redraw or recolor it. Below 24px use the simplified version.

**Composition:** keep the left side of scenes calm and dark for text; subjects sit right of center on desktop. Lots of negative space. Slow, quiet, luxurious. No drop shadows or glow on text.

**Copy tone:** short, sensual, restrained. Avoid orientalist clichés: no lanterns, camels, genies, "Arabian nights", belly-dance imagery. Do not use "exotic" or "mystical".

## Tech stack
- Plain HTML, CSS and JavaScript with **Vite**.
- **GSAP + ScrollTrigger** and **Lenis**.
- 2D canvas for ripples and particles only.
- No React, Next.js, Three.js or WebGL unless I ask. Tell me before adding any dependency.

## Performance
- Total mobile payload under **8 MB**; layers as WebP, sized to their displayed width, with smaller versions under 768px.
- Lazy-load scenes below the fold; preload scenes 1 and 2.
- Show a simple loading screen with the drop mark.
- Aim for 90+ Lighthouse mobile for performance and accessibility.
- Test on a real phone.

## Accessibility
- `prefers-reduced-motion`: no parallax, ripples or custom cursor; show each scene as a still composite with the same copy.
- Sufficient text contrast (add a soft dark gradient behind text where layers are bright); visible focus states; semantic HTML.
- Alt text for key images; decorative layers use empty alt and `aria-hidden`.
- Sound: optional ambient loop behind a toggle. **Muted by default. Never autoplay.**

## Mobile
- Design mobile as its own composition (vertical), not a shrunken desktop.
- Text in the bottom third over a soft dark gradient; tap targets at least 44px.
- Fewer layers and no mouse parallax on mobile.

## Working rules for Claude Code
1. Work in phases. Stop after each so I can review in the browser.
2. Describe your plan briefly before large edits.
3. Ask before adding dependencies, renaming files or changing the design system.
4. Never modify anything in `assets/`. Reference it only.
5. Commit with git after each phase with a clear message.
6. Keep code simple, with short comments on non-obvious scroll logic.
7. After each phase, tell me what changed, how to view it and what you are unsure about.
8. If something looks wrong, say so and propose a fix.
9. Use placeholder rectangles in the right size and position if a layer file is missing.

## Phases
1. Skeleton: scenes, colors, fonts, responsive layout, placeholder layers and copy.
2. Layer parallax for scenes 1-2 (hero and into the drop).
3. Scenes 3-5 with the time-of-day tint and note copy.
4. Cursor drop, hero ripples and the petal reveal.
5. Scene 6 and 7, loading screen, sound toggle, reduced-motion fallback.
6. Performance and accessibility audit, then deployment prep.

## Draft copy (editable)
- Hero: **BAGH**, *A garden in a drop.*
- Dawn, top notes: "Open." plus one line on fresh, green notes.
- Noon, heart notes: "Bloom." plus one line on rose and jasmine.
- Dusk, base notes: "Linger." plus one line on amber and warm musk.
- Footer: "BAGH is a fictional brand created as a creative direction exercise. Imagery and film were generated with AI."
