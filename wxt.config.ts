import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  webExt: {
    startUrls: ["https://www.youtube.com/watch?v=4bIDbKzMZHI"],
  },
  manifest: {
    browser_specific_settings: {
      gecko: {
        id: "@youtube-summary-free-extension",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
});
