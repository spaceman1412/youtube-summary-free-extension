// src/entrypoints/youtube-widget.content/index.tsx
/**
 * Content script that injects a YouTube summary widget into the video page.
 * This script mounts a React widget in the YouTube sidebar (#secondary) using Shadow DOM
 * to isolate styles and prevent conflicts with YouTube's CSS.
 */

import { createRoot } from "react-dom/client";
import Widget from "./Widget";
import { fetchTranscript } from "youtube-transcript-plus";

// CSS selector for YouTube's secondary sidebar (where video recommendations appear)
const TARGET_SELECTOR = "#secondary";
// Maximum time to wait for the target element to appear (10 seconds)
const TARGET_TIMEOUT = 10000;
// Custom attribute to identify our widget container in the DOM
const HOST_ATTR = "data-youtube-summary-widget";

/**
 * Waits for a DOM element to appear on the page.
 * Uses MutationObserver to watch for DOM changes and resolves when the element is found.
 *
 * @param selector - CSS selector for the element to wait for
 * @param timeout - Maximum time to wait in milliseconds (default: 10000ms)
 * @returns Promise that resolves with the found HTMLElement or rejects on timeout
 */
async function waitForElement(selector: string, timeout = TARGET_TIMEOUT) {
  // Check if element already exists (no need to wait)
  const existing = document.querySelector(selector);
  if (existing) return existing as HTMLElement;

  // Set up a promise that will resolve when the element appears or timeout
  return new Promise<HTMLElement>((resolve, reject) => {
    // Set up timeout to reject if element doesn't appear in time
    const timer = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);

    // Watch for DOM changes to detect when the target element is added
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        // Element found! Clean up and resolve
        window.clearTimeout(timer);
        observer.disconnect();
        resolve(found as HTMLElement);
      }
    });

    // Start observing the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

/**
 * Content script definition using WXT framework.
 * This script runs on YouTube watch pages and injects our widget into the sidebar.
 */
export default defineContentScript({
  // Only run on YouTube video watch pages (URLs matching /watch?v=*)
  matches: ["*://*.youtube.com/watch?v=*"],
  // Ensures CSS is injected correctly for Shadow DOM UI
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("[wxt] youtube-widget (Shadow UI) on", location.href);

    /**
     * Create a Shadow DOM UI instance.
     * Shadow DOM isolates our widget's styles and prevents conflicts with YouTube's CSS.
     */
    const ui = await createShadowRootUi(ctx, {
      name: "youtube-widget",
      mode: "open", // Shadow DOM mode: "open" allows external access (for debugging)
      isolateEvents: true, // Prevents events from bubbling to YouTube's page
      position: "inline", // Insert as a regular DOM element (not fixed/overlay)
      anchor: TARGET_SELECTOR, // Target element to attach to (#secondary sidebar)
      append: "first", // Insert at the beginning of the target element

      /**
       * Called when the Shadow DOM container is mounted.
       * Sets up the container styles and renders the React Widget component.
       */
      onMount(container) {
        // Apply base styles to the container
        Object.assign(container.style, {
          display: "block",
          width: "100%",
          marginBottom: "16px",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        });
        // Mark this container with our custom attribute for easy identification
        container.setAttribute(HOST_ATTR, "true");

        // Create a div inside the Shadow DOM to mount React
        const mount = document.createElement("div");
        container.append(mount);

        console.log(fetchTranscript("dQw4w9WgXcQ"));

        // Create React root and render the Widget component
        const root = createRoot(mount);
        root.render(<Widget />);

        // Return instance data for cleanup later
        return { root, mount };
      },

      /**
       * Called when the Shadow DOM container is removed.
       * Properly unmounts React and cleans up DOM elements.
       */
      onRemove(inst) {
        // Unmount React to prevent memory leaks
        inst?.root?.unmount();
        // Remove the mount element from DOM
        inst?.mount?.remove();
      },
    });

    // Track whether the widget is currently mounted
    let isMounted = false;

    /**
     * Removes any existing widget containers from the DOM.
     * This prevents duplicate widgets if the script runs multiple times.
     */
    const removeExistingHost = () => {
      document
        .querySelectorAll<HTMLElement>(`[${HOST_ATTR}]`)
        .forEach((host) => host.remove());
    };

    /**
     * Unmounts the current widget instance.
     * Called when navigating away or when remounting is needed.
     */
    const unmountCurrent = () => {
      if (!isMounted) return;
      ui.remove(); // Remove the Shadow DOM UI
      removeExistingHost(); // Clean up any orphaned containers
      isMounted = false;
    };

    /**
     * Mounts the widget into the #secondary sidebar.
     * Waits for the target element to appear, then mounts the UI.
     */
    const mountInSecondary = async () => {
      if (isMounted) return; // Prevent duplicate mounts
      try {
        // Wait for YouTube's sidebar to load (it may not exist immediately)
        const target = await waitForElement(TARGET_SELECTOR);
        // Clean up any existing widgets first
        removeExistingHost();

        // Mount the Shadow DOM UI
        ui.mount();
        isMounted = true;

        // Ensure the widget is in the correct location
        // Sometimes the UI might mount in the wrong place, so we fix it here
        const mountedHost = document.querySelector<HTMLElement>(
          `[${HOST_ATTR}]`
        );
        if (mountedHost && mountedHost.parentElement !== target) {
          // Move widget to the beginning of the sidebar if it's elsewhere
          target.prepend(mountedHost);
        }
      } catch (error) {
        console.warn("[wxt] youtube-widget failed to mount:", error);
      }
    };

    // Initial mount when the page loads
    await mountInSecondary();

    /**
     * Remounts the widget after YouTube navigation.
     * YouTube uses SPA navigation, so we need to remount when the page changes.
     */
    const remount = () => {
      unmountCurrent();
      mountInSecondary();
    };
    // Listen for YouTube's navigation event (fires when navigating between videos)
    document.addEventListener("yt-navigate-finish", remount);

    /**
     * Cleanup when the content script is invalidated (e.g., extension disabled).
     * Removes event listeners and unmounts the widget.
     */
    ctx.onInvalidated(() => {
      document.removeEventListener("yt-navigate-finish", remount);
      unmountCurrent();
    });
  },
});
