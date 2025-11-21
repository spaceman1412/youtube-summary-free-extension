// src/entrypoints/youtube-widget.content/index.tsx
import { createRoot } from "react-dom/client";
import Widget from "./Widget";

export default defineContentScript({
  matches: ["*://*.youtube.com/watch?v=*"],
  cssInjectionMode: "ui", // ensures your CSS (if imported) is injected correctly for Shadow UI
  async main(ctx) {
    console.log("[wxt] youtube-widget (Shadow UI) on", location.href);

    const ui = await createShadowRootUi(ctx, {
      name: "youtube-widget",
      // Shadow root config
      mode: "open", // 'open' lets you inspect in DevTools; 'closed' hides it
      isolateEvents: true, // prevents page from catching your UI events

      // Where/how to place UI in the page
      position: "overlay", // overlay keeps it visible regardless of page layout
      anchor: "body",
      append: "last",

      onMount(container) {
        // Make the overlay clearly visible
        Object.assign(container.style, {
          position: "fixed",
          right: "16px",
          bottom: "16px",
          zIndex: "2147483647",
          width: "320px",
          minHeight: "120px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,.2)",
          padding: "12px",
          boxSizing: "border-box",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        });

        // Mount React inside the shadow container
        const mount = document.createElement("div");
        container.append(mount);

        const root = createRoot(mount);
        root.render(<Widget />);

        return { root, mount };
      },

      onRemove(inst) {
        inst?.root?.unmount();
        inst?.mount?.remove();
      },
    });

    // Insert UI now
    ui.mount();

    // Keep it present across YouTube SPA navigations
    const remount = () => ui.mount(); // idempotent; safe to call again
    document.addEventListener("yt-navigate-finish", remount);

    // Optional: clean up if WXT tears down the context
    ctx.onInvalidated(() => {
      document.removeEventListener("yt-navigate-finish", remount);
      ui.remove();
    });
  },
});
