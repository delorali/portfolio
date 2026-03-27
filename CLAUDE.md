# Design Portfolio

## Overview
Personal design portfolio website for Delora Li, showcasing work, projects, and case studies.

## Design System
- **Figma Source:** https://www.figma.com/design/3OLAT12j44O2wGMAhaOL89/Portfolio-Design-system?node-id=25-7&t=nPrc7ieO1Czb85Au-1
- **Base:** Delora Design System v1.0 (March 2026) — built on iOS + shadcn patterns
- **Themes:** Light & Dark mode support
- Always reference the Figma design system for colors, typography, spacing, and component specs before implementing UI.
- Use the `figma-implement-design` skill to pull design context and screenshots when building components from the Figma file.

### Typography
- **Font Family:** Inter
- **Weights:** Regular (400), Medium (500), Semi Bold (600)
- **Large Title:** 54px / 56px line-height, Semi Bold, letter-spacing -1.1px
- **Body/Labels:** 13px Medium (buttons), 20px Regular (subtitles)

### Color Tokens (CSS Variables)
- `--primary`: #18181b (zinc-900)
- `--primary-foreground`: #fafafa
- `--secondary`: #f4f4f5 (zinc-100)
- `--border`: #e4e4e7 (zinc-200)
- `--zinc/950`: #09090b (darkest backgrounds)
- `--white`: #ffffff

### Radius Tokens
- `--radius/xl`: 16px (cards)
- Buttons: 10px (sm)

### Components (from Figma)
- **Button:** Sizes (sm, md, lg) x Variants (default, secondary, destructive, outline, ghost) x States (default, pressed, disabled). Also icon-only variants for each.
- **Card:** Secondary background, 1px border, rounded-xl (16px)

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Motion (Framer Motion) — smooth scroll-triggered animations, page transitions, and spring physics in the style of Apple/Framer websites
- **Language:** TypeScript

## Project Structure
- TBD

## Development
- TBD
