# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal profile/portfolio site for Soma Veszelovszki, served at https://soma.veszelovszki.hu (custom domain set via `CNAME`, i.e. static GitHub Pages hosting). Pushing to `master` publishes the site.

There is no build system, package manager, linter, or test suite — it is plain static HTML/CSS/JS with no frameworks. To preview locally, serve the repo root over HTTP (e.g. `python3 -m http.server`) so root-relative directory links like `babocar/` resolve.

## Structure

- `index.html` — the profile: intro + contact links, About, Experience, Projects.
- One directory per project (`babocar/`, `micro-utils/`, `mondrian-in-random/`), each with its own `index.html`. `mondrian-in-random/privacy-policy.html` is the app's store privacy policy — its legal text must not be reworded.
- `style.css` and `index.js` at the root are shared by every page; subpages reference them (and `resources/`) via `../` relative paths.
- `resources/img/` holds locally hosted, resized images (don't hotlink GitHub raw files); `resources/SomaVeszelovszki_resume.pdf` is linked from the home page.

## Content sources

Experience and dates mirror the resume PDF; project descriptions are drawn from the corresponding GitHub repos (`github.com/somaveszelovszki/*`). The About text on the home page is the owner's own wording — don't rewrite it.

## Design conventions

The look is deliberately plain, in the style of hand-built engineer homepages: one narrow text column (`.page`, 680px), system font, underlined text links, date + title rows with hairline dividers (`.rows`), light theme only. Avoid landing-page patterns — cards, shadows, badges, tag pills, stat tiles, CTA buttons, hero headlines — and keep copy short.

To add a project, add a row to the Projects list in `index.html` and, if it needs a page, copy an existing subpage (back link, `h1.project-title`, `.subtitle`, `.links`, short prose, figures).

`index.js` (vanilla JS, no dependencies) wires behavior by data attribute:

- `data-current-year` — footer copyright year.
- `data-youtube-id` on a `button.video` — click-to-load YouTube embed (no third-party requests until clicked).
- `data-anagram` — the MONDRIAN → INRANDOM tile animation on the Mondrian page; each `.anagram-tile`'s `data-target` is its index in the rearranged word.
