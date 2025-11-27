# YouTube Summary Extension

A completely free, open-source extension powered by Google Gemini (bring your own free AI Studio key) that pops into the YouTube sidebar and delivers instant summaries, transcripts, and chat answers for every video so you can learn faster without leaving the page.

## Features

- **Lives inside the video page** so your summary appears next to the player—no extra tabs, no copy/paste.
- **No login required**—just install the extension and start summarizing instantly.
- **One-click summary button** that instantly recaps the video with clickable timestamps.
- **Powered by the latest Gemini models** (you choose the model) so results feel fast and up-to-date.
- **Use the free Google AI Studio key that comes with every Google account**—paste it once, we keep it safe in your browser, and you stay in control.
- **Transcript button** that pulls captions automatically and lets you jump to the exact moments mentioned.
- **Context-aware chat tab** that remembers the whole conversation and uses the video’s transcript to answer follow-up questions naturally.

## Tech Stack

- [WXT](https://wxt.dev) for browser-extension tooling and Shadow DOM helpers.
- React 19 + TypeScript for UI.
- `@google/genai` for calling Gemini 2.x models.
- `youtube-transcript-plus` to fetch official captions directly from YouTube.
- `react-markdown` for rich summary/chat rendering.

## Project Structure

```
entrypoints/
├─ popup/                      # Support popup (CTA to review/star)
└─ youtube-widget.content/     # Main widget mounted on YouTube watch pages
   ├─ components/              # UI building blocks
   ├─ hooks/                   # State + side-effect logic (API key, summary, transcript, chat)
   ├─ services (api*, chat*, summary*, transcript*)
   ├─ styles.ts                # Inline style objects used by the widget
   └─ Widget.tsx               # Top-level React component
public/icon/                   # Extension icons for each size
wxt.config.ts                  # WXT configuration (modules, dev URLs)
web-ext.config.ts              # WebExtension build config overrides
```

## Prerequisites

- Node.js ≥ 18
- [pnpm](https://pnpm.io/) 9.x (the repo is pinned to `pnpm@9.10.0`)

## Getting Started

```bash
pnpm install            # install dependencies
pnpm dev                # run Chromium-based dev session via WXT
pnpm dev:firefox        # (optional) launch Firefox with the extension loaded
```

When WXT starts it will open a browser pointed at the demo URL defined in `wxt.config.ts`. Make sure YouTube is allowed to load mixed content if you are using custom profiles.

## Contributing

Issues and pull requests are welcome. If you open a PR, please:

- Follow the Clean Code rules noted in this repo.
- Keep new functions/components focused and well-tested.
- Explain how you manually verified the extension (browser + commands used).

---

Enjoy faster learning on YouTube and feel free to leave a review or star the repo if this project helps you!
