# YouTube Summary Free Extension

A completely free, open-source extension powered by Google Gemini (bring your own free AI Studio key) that pops into the YouTube sidebar and delivers instant summaries, transcripts, and chat answers for every video so you can learn faster without leaving the page.

## Demo

https://github.com/user-attachments/assets/a3f7da07-c7a7-4697-b423-27a065e639a1

## Features

- **Built right into the YouTube page** — your summary appears beside the video player. No extra tabs, no copy-paste.
- **No login, no setup hassle** — install the extension and start summarizing immediately.
- **Instant one-click summaries** — get a clean recap with clickable timestamps that jump to key moments.
- **Powered by the latest Gemini models** — choose the model you prefer, and get fast, accurate, up-to-date results.
- **Uses your free Google AI Studio key** — every Google account has one. Add it once, it stays securely in your browser, and you stay fully in control.
- **Smart transcript viewer** — pulls captions automatically and lets you jump directly to the moments mentioned.
- **Context-aware chat** — ask follow-up questions and get answers based on the full transcript and your ongoing conversation.

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
