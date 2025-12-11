<div align="center">

# 🎬 YouTube Summary Free Extension

**A completely free, open-source extension powered by Google Gemini that delivers instant summaries, transcripts, and chat answers for every YouTube video.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-141e24.svg?&style=for-the-badge&logo=google-chrome&logoColor=white)](#-installation)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-141e24.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/vi/firefox/addon/youtube-summary-free/)

[Features](#-features) • [Installation](#-installation) • [Getting Started](#-getting-started) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Demo](#-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)

---

## 🎥 Demo

<div align="center">

https://github.com/user-attachments/assets/e8bdf24d-ec27-46d7-8906-da2c8ad873cf

</div>

---

## ✨ Features

| Feature                        | Description                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| **🎯 Built-in Integration**    | Summary appears beside the video player. No extra tabs, no copy-paste.                              |
| **⚡ Zero Setup**              | Install the extension and start summarizing immediately. No login required.                         |
| **🚀 One-Click Summaries**     | Get a clean recap with clickable timestamps that jump to key moments.                               |
| **🤖 Latest Gemini Models**    | Choose the model you prefer, and get fast, accurate, up-to-date results.                            |
| **🔑 Your Own API Key**        | Uses your free Google AI Studio key. Add it once, it stays securely in your browser.                |
| **📝 Smart Transcript Viewer** | Pulls captions automatically and lets you jump directly to the moments mentioned.                   |
| **💬 Context-Aware Chat**      | Ask follow-up questions and get answers based on the full transcript and your ongoing conversation. |

---

## 🛠 Tech Stack

<div align="center">

| Category                | Technology                                                                |
| ----------------------- | ------------------------------------------------------------------------- |
| **Extension Framework** | [WXT](https://wxt.dev) - Browser-extension tooling and Shadow DOM helpers |
| **UI Framework**        | React 19 + TypeScript                                                     |
| **AI Integration**      | `@google/genai` - Calling Gemini 2.x models                               |
| **Transcript Service**  | `youtube-transcript-plus` - Fetch official captions directly from YouTube |
| **Markdown Rendering**  | `react-markdown` - Rich summary/chat rendering                            |

</div>

---

## 📁 Project Structure

```
youtube-summary-extension/
│
├── entrypoints/
│   ├── popup/                      # Support popup (CTA to review/star)
│   └── youtube-widget.content/     # Main widget mounted on YouTube watch pages
│       ├── components/             # UI building blocks
│       ├── hooks/                  # State + side-effect logic
│       │   ├── useApiKey.ts
│       │   ├── useChat.ts
│       │   ├── usePreferences.ts
│       │   ├── useSummary.ts
│       │   └── useTranscript.ts
│       ├── services/               # Business logic services
│       │   ├── apiKeyService.ts
│       │   ├── apiValidationService.ts
│       │   ├── chatService.ts
│       │   ├── summaryService.ts
│       │   └── transcriptService.ts
│       ├── styles.ts               # Inline style objects
│       └── Widget.tsx              # Top-level React component
│
├── public/
│   └── icon/                       # Extension icons for each size
│
├── wxt.config.ts                   # WXT configuration (modules, dev URLs)
└── web-ext.config.ts               # WebExtension build config overrides
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18
- **pnpm** 9.x (the repo is pinned to `pnpm@9.10.0`)

> 💡 Don't have pnpm? Install it with: `npm install -g pnpm@9.10.0`

---

## 📥 Installation

### Option 1: Install from Zip File

Download the latest packaged zip file from the [GitHub Releases page](https://github.com/spaceman1412/youtube-summary-extension/releases).

#### 🌐 For Chrome/Chromium-based browsers (Chrome, Edge, Brave, etc.)

1. Download and extract the zip file to a folder on your computer
2. Open Chrome and navigate to `chrome://extensions/` (or `edge://extensions/` for Edge)
3. Enable **Developer mode** by toggling the switch in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder containing the extension files
6. The extension should now be installed and ready to use! 🎉

#### 🦊 For Firefox

1. Download and extract the zip file to a folder on your computer
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Navigate to the extracted folder and select the `manifest.json` file
5. The extension should now be installed and ready to use! 🎉

> ⚠️ **Note:** For Firefox, the extension will be temporary and will need to be reloaded after each browser restart. For a permanent installation, use the [Firefox Add-ons store](https://addons.mozilla.org/vi/firefox/addon/youtube-summary-free/).

### Option 2: Install from Store

- **Firefox**: [Install from Firefox Add-ons](https://addons.mozilla.org/vi/firefox/addon/youtube-summary-free/)

---

## 🚀 Getting Started

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/spaceman1412/youtube-summary-extension.git
   cd youtube-summary-extension
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   # For Chromium-based browsers
   pnpm dev

   # For Firefox (optional)
   pnpm dev:firefox
   ```

When WXT starts, it will open a browser pointed at the demo URL defined in `wxt.config.ts`.

> 💡 **Tip:** Make sure YouTube is allowed to load mixed content if you are using custom profiles.

---

## 🤝 Contributing

We welcome contributions! If you'd like to contribute, please follow these guidelines:

### Before Submitting a PR

- ✅ Follow the [Clean Code rules](https://github.com/spaceman1412/youtube-summary-extension) noted in this repo
- ✅ Keep new functions/components focused and well-tested
- ✅ Explain how you manually verified the extension (browser + commands used)
- ✅ Ensure your code follows the existing code style

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Enjoy faster learning on YouTube!** 🎓

If this project helps you, please consider leaving a ⭐ star or a review!

Made with ❤️ by the community

</div>
