# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal profile/portfolio site for Soma Veszelovszki, served at https://soma.veszelovszki.hu (custom domain set via `CNAME`, i.e. static GitHub Pages hosting). Pushing to `master` publishes the site.

There is no build system, package manager, linter, or test suite — it is plain static HTML/CSS/JS with no frameworks. To preview locally, serve the repo root over HTTP (e.g. `python3 -m http.server`) so root-relative directory links like `babocar/` resolve.

## Structure

- `index.html` — the single-page profile: hero, about + skills, experience, projects, contact.
- One directory per project case study (`babocar/`, `micro-utils/`, `mondrian-in-random/`), each with its own `index.html`. Internal links point at `…/index.html` explicitly (not bare folders) so the site also works when opened straight from disk.
- `style.css` and `index.js` at the root are shared by every page; subpages reference them (and `resources/`) via `../` relative paths.
- `resources/img/` holds locally hosted, resized images (don't hotlink GitHub raw files); `resources/SomaVeszelovszki_resume.pdf` is the resume linked from every page.

## Content sources

Experience, dates and skills mirror the resume PDF; project descriptions are drawn from the corresponding GitHub repos (`github.com/somaveszelovszki/*`). Keep claims consistent with those sources.

## Page conventions

- Every page repeats the same `<head>` (Inter + JetBrains Mono from Google Fonts, `style.css`, deferred `index.js`, SVG favicon) and the same sticky `.site-header`. To add a project page, copy an existing subpage (`project-hero`, `.facts`, `.cover`, `.article`) and add a `.card` to the projects grid in `index.html`.
- The site is light-theme only (matte off-white background, flat surfaces, minimal shadows) by design; don't add a dark mode. Colors and shadows are CSS custom properties on `:root`; use the tokens rather than literal colors. Layout must stay free of horizontal scroll at 390px width.
- Icons are inline SVGs (no icon font).

`index.js` (vanilla JS, no dependencies) wires behavior by data attribute:

- `data-current-year` — footer copyright year.
- `data-youtube-id` on a `button.video` — click-to-load YouTube embed (no third-party requests until clicked).
- `data-anagram="WORD"` — the letter puzzle on the Mondrian page: tiles can be dragged or tapped two-at-a-time to swap, and the page detects when they spell `WORD`. Tile colors are classes (`red`, `yellow`, `blue`), not positional, so they follow the tile.
- Header nav links to `#section` anchors get an `.active` class for the section currently in view.
