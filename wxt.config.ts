import { defineConfig } from "wxt";

const geckoSettings: Record<string, unknown> = {
  id: "@youtube-summary-free-extension",
  data_collection_permissions: {
    required: ["none"],
  },
};

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    startUrls: ["https://www.youtube.com/watch?v=4bIDbKzMZHI"],
  },
  manifest: {
    host_permissions: [
      "https://generativelanguage.googleapis.com/*",
      "https://www.youtube.com/*",
    ],
    browser_specific_settings: {
      gecko: geckoSettings,
    },
  },
});
