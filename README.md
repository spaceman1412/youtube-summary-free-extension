# YouTube Summary Free Extension

A completely free, open-source extension powered by Google Gemini (bring your own free AI Studio key) that pops into the YouTube sidebar and delivers instant summaries, transcripts, and chat answers for every video so you can learn faster without leaving the page.

<p align="center"><a rel="noreferrer noopener" href="#installation"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome-141e24.svg?&style=for-the-badge&logo=google-chrome&logoColor=white"></a>  <a rel="noreferrer noopener" href="https://addons.mozilla.org/vi/firefox/addon/youtube-summary-free/"><img alt="Firefox Add-ons" src="https://img.shields.io/badge/Firefox-141e24.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white"></a>

## Demo

https://github.com/user-attachments/assets/e8bdf24d-ec27-46d7-8906-da2c8ad873cf

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

## Installation

### Install from Zip File

You can download the latest packaged zip file from the [GitHub Releases page](https://github.com/spaceman1412/youtube-summary-extension/releases). Once you have the zip file, follow these steps:

#### For Chrome/Chromium-based browsers (Chrome, Edge, Brave, etc.)

1. Download and extract the zip file to a folder on your computer.
2. Open Chrome and navigate to `chrome://extensions/` (or `edge://extensions/` for Edge).
3. Enable **Developer mode** by toggling the switch in the top-right corner.
4. Click **Load unpacked**.
5. Select the extracted folder containing the extension files.
6. The extension should now be installed and ready to use!

#### For Firefox

1. Download and extract the zip file to a folder on your computer.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Navigate to the extracted folder and select the `manifest.json` file.
5. The extension should now be installed and ready to use!

> **Note:** For Firefox, the extension will be temporary and will need to be reloaded after each browser restart. For a permanent installation, use the [Firefox Add-ons store](https://addons.mozilla.org/vi/firefox/addon/youtube-summary-free/).

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
