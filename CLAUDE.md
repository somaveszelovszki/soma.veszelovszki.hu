# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal profile/portfolio site for Soma Veszelovszki, served at https://soma.veszelovszki.hu (custom domain set via `CNAME`, i.e. static GitHub Pages hosting). Pushing to `master` publishes the site.

There is no build system, package manager, linter, or test suite — it is plain static HTML/CSS/JS. To preview locally, serve the repo root over HTTP (e.g. `python3 -m http.server`) rather than opening files directly, since `data-markdown-src` loads content via AJAX.

## Structure

- `index.html` — the main profile page (bio, skills, project cards, resume link).
- One directory per project page (`babocar/`, `micro-utils/`, `mondrian-in-random/`, `python-snake/`), each with its own `index.html`. `mondrian-in-random/privacy-policy.html` is the app's store privacy policy.
- `style.css` and `index.js` at the root are shared by every page; subpages reference them (and `resources/`) via `../` relative paths.
- `resources/` — images, button graphics (`.xcf` files are GIMP sources for the corresponding `.png`), the resume PDF (`SomaVeszelovszki_resume.pdf`), and downloadable binaries.

## Page conventions

Every page duplicates the same `<head>` block of CDN dependencies: jQuery 3.6.4, jQuery UI 1.12.1, Bootstrap 4.6.2 (CSS + bundle JS), and Showdown 2.1.0. Layout uses Bootstrap 4 grid/cards. When adding a new project page, copy an existing subpage as the template so the head, top bar (back-to-profile + resume buttons), and relative paths stay consistent, then add a card linking to it from `index.html`.

Behavior is declarative: `index.js` runs on document ready and wires up elements by data attribute/class, so new pages generally need markup only, no new JS:

- `data-link` / `data-link-new` — make any element (typically image `<button>`s) navigate in the same / a new tab.
- `.animated-width` / `.animated-height` with `data-target-width` / `data-target-height` — CSS-transitioned skill bars that grow from 0 on load.
- `data-calculate-years-since="<date>"` — replaces text with the number of whole years elapsed.
- `data-markdown-src="<url>"` — fetches Markdown and renders it into the element with Showdown.
- `.joke` (with `.setup` / `.delivery` children) — filled from JokeAPI.
- `.draggable` — jQuery UI draggable; the `.letter-tile` / `#letter-tile-*` logic is a puzzle specific to `mondrian-in-random/index.html` (the tiles spell "MONDRIAN"; dragging them into "INRANDOM" order triggers an animation).
