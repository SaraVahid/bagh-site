# CLAUDE.md: BAGH, Chahar Bagh scroll website

## Project
BAGH is a **fictional** luxury fragrance house. Its debut fragrance is *Chahar Bagh*, named after the four-quadrant Persian garden. This project is a cinematic, scroll-driven website for a portfolio case study.

- The site must state clearly, in the footer and on the story section, that BAGH is a fictional concept and that visuals are AI-generated.
- Tagline: **A garden in a drop.**
- Concept: *Paradise was once a walled garden.* The word comes from the Old Persian *pairidaeza*, "walled garden". *We kept it in a drop.*

## Core idea
**Scroll is the camera.** The visitor descends into a golden drop, through a Persian garden, and pulls back out to the bottle. There are no hard cuts, only continuous movement driven by scroll position.

## Experience, in scroll order

| Scroll | Section | Behavior |
|---|---|---|
| 0% | Hero | Dark screen, golden drop, BAGH mark and wordmark, subtle ambient loop |
| 10-30% | The drop | Scroll pushes into the drop; the garden resolves inside it |
| 30-55% | Top notes | Descent into the garden; short copy over the scene |
| 55-75% | Heart notes | Tile turns into petals; short copy |
| 75-90% | Base notes | Dusk light, the golden bead falls; short copy |
| 90-100% | The bottle | Pull-back to the packshot, tagline, "Discover" button |
| After | Story and footer | The *pairidaeza* idea, a short brand note, the fictional-concept line |

The three notes sections mirror the film's structure: top notes (fresh), heart (floral), base (warm).

## Design system

**Colors**
- Warm black `#14100C` (main background)
- Gold `#C9A24B` (mark, headings, accents)
- Muted gold `#A88A42` (secondary text accents)
- Turquoise `#2BB5B0` (water, small accents only)
- Cream `#F4EDE0` (light surfaces, body text on dark at reduced opacity)
- Muted text `#8F8269`
- Define all colors as CSS variables. Do not introduce new colors without asking.

**Typography**
- Headings and wordmark: a high-contrast serif (Cormorant Garamond or similar from Google Fonts), light weight, wide letterspacing on the wordmark (about 0.4em).
- Body and UI: a clean sans (Inter or similar), small and quiet.
- Persian text (باغ): a proper Persian typeface such as Vazirmatn. Never rely on a fallback font for Persian script.
- Sentence case for body and UI; the wordmark BAGH is the only all-caps element.

**Logo**
- Mark: a gold teardrop outline containing a stylized Persian-miniature flowering tree with curling branches and round blossoms, rising from two turquoise water lines.
- Files are in `assets/logo/`. Use the SVG; never redraw or recolor it.
- Keep generous clear space around the mark. Below 24px, use a simplified version (drop and tree only).

**Composition**
- Keep the left side of scene frames calm and dark for text. Subjects sit right of center on desktop.
- Lots of negative space. Slow, quiet, luxurious. Nothing flashy.
- No gradients that fight the film frames, no drop shadows, no glow effects on text.

**Tone of copy**
- Short, sensual, restrained. A few words per section, never paragraphs over the scene.
- Persian identity should feel precise and respectful. **Avoid orientalist clichés:** no lanterns, camels, genies, "Arabian nights", belly-dance imagery, or "mystical Orient" language.
- Do not use the words "exotic" or "mystical".

## Tech stack
- Plain HTML, CSS and JavaScript, bundled with **Vite** if a build step is needed.
- **GSAP + ScrollTrigger** for scroll-driven animation.
- **Lenis** for smooth scrolling.
- No heavy frameworks (no React or Next.js) unless I ask.
- Keep dependencies minimal and tell me before adding any.

## The scroll-scrubbed film
- Frames live in `assets/frames/` (desktop, about 1280px wide) and `assets/frames-mobile/` (smaller, about 720px wide), named `frame_0001.webp`, `frame_0002.webp`, and so on.
- Render them on a full-screen `<canvas>` and map scroll progress to the frame index.
- Preload progressively: load the first frames immediately, the rest in the background.
- Show the still hero image (`assets/stills/hero.webp`) as the placeholder until the frames are ready.
- Use the mobile frame set under 768px width.
- Cover-fit the canvas (like `object-fit: cover`) while keeping the subject visible on both desktop and mobile.

## Text and UI
- All text is **real HTML** layered over the canvas. Never bake text into images.
- Text fades in and out at its scroll range; it must be readable on every frame (add a soft dark gradient behind text if needed).
- Header: small BAGH mark on the left, minimal navigation on the right.
- Include a "Discover" button at the end of the bottle section.
- Sound: an optional ambient loop (water, soft santur) behind a toggle. **Muted by default. Never autoplay audio.**

## Performance
- Total mobile payload for the scroll sequence under **10 MB**.
- Compress images as WebP; lazy-load everything below the fold except the frame sequence.
- Aim for 90+ on Lighthouse mobile performance and accessibility.
- Test scroll smoothness on a real phone, not just desktop emulation.

## Accessibility
- Respect `prefers-reduced-motion`: show static stills for each section instead of the scrubbed sequence.
- Sufficient contrast for all text; visible focus states; semantic HTML (header, main, section, footer).
- Meaningful alt text for the stills; the canvas has an accessible label describing the experience.
- Persian text uses `lang="fa"` and `dir="rtl"` where it appears on its own.

## Mobile
- Design the mobile layout as its own composition (vertical), not a shrunken desktop page.
- Text sits at the bottom third over a soft dark gradient.
- Minimum tap targets of 44px.

## Working rules for Claude Code
1. **Work in phases** and stop after each one so I can review in the browser. Do not build the whole site in one pass.
2. **Plan first for big changes.** Briefly describe your approach before making large edits.
3. **Ask before** adding dependencies, renaming files, or changing the design system.
4. **Never modify** anything in `assets/` (frames, stills, logo) unless I ask. Reference them only.
5. **Commit with git** after each completed phase with a clear message.
6. Keep code simple and readable, with short comments on non-obvious scroll logic.
7. After each phase, tell me what changed, how to view it, and anything you are unsure about.
8. If something looks wrong visually, say so and propose a fix rather than hiding it.

## Phases
1. Skeleton: structure, sections, colors, fonts, responsive grid, placeholder copy.
2. Scroll-scrubbed canvas with progressive loading and placeholder.
3. Section copy overlays timed to scroll ranges.
4. Polish: header, loading screen, sound toggle, Discover button, reduced-motion fallback.
5. Performance and accessibility audit.
6. Deployment prep (Vercel or Netlify).

## Copy (draft, editable)
- Hero: **BAGH**, *A garden in a drop.*
- Top notes: "Open." with a one-line note on fresh, green, bright notes.
- Heart notes: "Bloom." with a one-line note on rose and jasmine.
- Base notes: "Linger." with a one-line note on amber and warm musk.
- Story: the *pairidaeza* idea in two or three sentences.
- Footer: "BAGH is a fictional brand created as a creative direction exercise. Imagery and film were generated with AI."
