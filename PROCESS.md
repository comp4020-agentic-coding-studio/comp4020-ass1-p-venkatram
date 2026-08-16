# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

An interactive site that explains how the heart works, across three pages. The
landing page shows an animated heart beating at 60bpm, positioned between the
lungs and above the stomach and tilted slightly left; clicking it leads to the
heart explorer. That page's first section dissects the heart layer by layer,
concluding with a figure of blood flow, then a second section highlights the
heart's parts — chambers, valves, veins — each clickable for more detail. The
third page uses scrollytelling: scrolling through the middle section drives an
animated diagram of blood being pumped, while a flowchart down the side tracks
the same journey as single-word stages, so a reader can follow the mechanism
in the diagram and hold the overall sequence in their head at the same time.

## The moments that mattered

1. **Getting the diagram's anatomy actually right.** The first pass at the
   blood-flow diagram
   ([`123ce1a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/commit/123ce1a))
   had valves opening the wrong way and flow paths that didn't match the
   text next to them — a diagram that only looks right until someone follows
   it stage by stage. Instead of accepting a diagram that merely looked
   plausible, I went through it valve by valve and path by path against the
   caption text: valve stacking, flow routing, and duct cohesion
   ([`1d13278`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/commit/1d132789fdf9f3d0256a5b7c3c245f2fae44503e)),
   then the pulmonary and aortic valves specifically, which were opening
   inward instead of outward
   ([`456ca8a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/commit/456ca8a327f8ba38bc1aba6dc1519c47e48ce6cc)).
   I checked each fix by reading the stage caption in `main.ts` and tracing
   the corresponding path by eye, stage by stage, rather than trusting that
   a diagram which rendered without errors was a diagram that was correct
   ([`123ce1a...456ca8a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/compare/123ce1a...456ca8a)).
2. **Making the whole site actually responsive.** The site was originally
   built desktop-first, and making every page hold together at both marking
   viewports — not just resize without breaking, but read well at both —
   took far more iteration than the initial build did: the heart pages'
   mobile layout, the scrollytelling page's stage detection, and the landing
   page's speech bubble all needed separate rounds of viewport-specific
   fixes, each checked against both breakpoints so a mobile fix couldn't
   quietly break desktop or vice versa
   ([`9e3db01...b77922b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/compare/9e3db01...b77922b)).
3. **Directing the build from reference images.** Rather than describing the
   heart's anatomy and layout in words, I gave Claude screenshots and
   reference images directly and had it match the diagram and page layout to
   what was actually pictured — first for the cross-section explorer's
   anatomy
   ([`d5360d6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/commit/d5360d6732567c23b446b8370381ab507ca408a1)),
   then again to swap the landing page's placeholder art for the real body
   and heart images
   ([`62c9308`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/commit/62c93082df1add9193bc68e213d5eec8e4ee74b4)).
   That turned "is this anatomically believable" into "does this match the
   reference," a much sharper check than describing a heart in prose and
   hoping the geometry came out right.
4. **Verifying against a rendered browser, not just the class list.** A run of
   small post-ship reports — Comic Sans silently substituting to a generic
   cursive font on non-Windows/Apple devices, a page-3 heading that wasn't
   fading in like its siblings, and pages reachable only by a direct link
   having no way back — kept turning out wrong when I reasoned about the CSS
   statically. Switching to driving a headless Chrome instance and reading
   its actual computed styles, `document.fonts` status, and click/tap
   behaviour found the real cause each time, instead of a plausible-looking
   guess: the font fix meant self-hosting Comic Neue rather than trusting a
   font-stack fallback, and the heading fix meant noticing the animation was
   wired to an element that was `sr-only` at that viewport, not missing
   outright
   ([`352d8ea...df2e459`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-p-venkatram/compare/352d8ea...df2e459)).

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
