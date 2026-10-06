# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal profile/portfolio site for Soma Veszelovszki, served at https://soma.veszelovszki.hu (custom domain set via `CNAME`, i.e. static GitHub Pages hosting). Pushing to `master` publishes the site.

There is no build system, package manager, linter, or test suite — it is plain static HTML/CSS/JS with no frameworks. To preview locally, serve the repo root over HTTP (e.g. `python3 -m http.server`) so root-relative directory links like `babocar/` resolve.

## Structure

- `index.html` — the single-page profile: hero, about + skills, experience, projects, contact.
- One directory per project case study (`babocar/`, `micro-utils/`, `mondrian-in-random/`), each with its own `index.html`. `mondrian-in-random/privacy-policy.html` is the app's store privacy policy — its legal text must not be reworded.
- `style.css` and `index.js` at the root are shared by every page; subpages reference them (and `resources/`) via `../` relative paths.
- `resources/img/` holds locally hosted, resized images (don't hotlink GitHub raw files); `resources/SomaVeszelovszki_resume.pdf` is the resume linked from every page.

## Content sources

Experience, dates and skills mirror the resume PDF; project descriptions are drawn from the corresponding GitHub repos (`github.com/somaveszelovszki/*`). Keep claims consistent with those sources.

## Page conventions

- Every page repeats the same `<head>` (Inter + JetBrains Mono from Google Fonts, `style.css`, deferred `index.js`, SVG favicon) and the same sticky `.site-header`. To add a project page, copy an existing subpage (`project-hero`, `.facts`, `.cover`, `.article`, `.next-project`) and add a `.card` to the projects grid in `index.html`.
- The site is light-theme only (matte off-white background, flat surfaces, minimal shadows) by design; don't add a dark mode. Colors and shadows are CSS custom properties on `:root`; use the tokens rather than literal colors. Layout must stay free of horizontal scroll at 390px width.
- Icons are inline SVGs (no icon font).

`index.js` (vanilla JS, no dependencies) wires behavior by data attribute:

- `data-years-since="<date>"` — replaces text with whole years elapsed (used for years of experience; the static fallback text should stay roughly correct).
- `data-current-year` — footer copyright year.
- `data-youtube-id` on a `button.video` — click-to-load YouTube embed (no third-party requests until clicked).
- `data-anagram` — the MONDRIAN → INRANDOM tile animation on the Mondrian page; each `.anagram-tile`'s `data-target` is its index in the rearranged word.
