// src/entrypoints/youtube-widget.content/index.tsx
import { createRoot } from "react-dom/client";
import Widget from "./Widget";

const TARGET_SELECTOR = "#secondary";
const TARGET_TIMEOUT = 10000;

async function waitForElement(selector: string, timeout = TARGET_TIMEOUT) {
  const existing = document.querySelector(selector);
  if (existing) return existing as HTMLElement;

  return new Promise<HTMLElement>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        window.clearTimeout(timer);
        observer.disconnect();
        resolve(found as HTMLElement);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export default defineContentScript({
  matches: ["*://*.youtube.com/watch?v=*"],
  cssInjectionMode: "ui", // ensures your CSS (if imported) is injected correctly for Shadow UI
  async main(ctx) {
    console.log("[wxt] youtube-widget (Shadow UI) on", location.href);

    const ui = await createShadowRootUi(ctx, {
      name: "youtube-widget",
      mode: "open",
      isolateEvents: true,
      position: "inline",
      anchor: TARGET_SELECTOR,
      append: "first",

      onMount(container) {
        Object.assign(container.style, {
          display: "block",
          width: "100%",
          marginBottom: "16px",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        });

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

    const mountInSecondary = async () => {
      try {
        await waitForElement(TARGET_SELECTOR);
        ui.mount();
      } catch (error) {
        console.warn("[wxt] youtube-widget failed to mount:", error);
      }
    };

    await mountInSecondary();

    const remount = () => {
      mountInSecondary();
    };
    document.addEventListener("yt-navigate-finish", remount);

    ctx.onInvalidated(() => {
      document.removeEventListener("yt-navigate-finish", remount);
      ui.remove();
    });
  },
});
