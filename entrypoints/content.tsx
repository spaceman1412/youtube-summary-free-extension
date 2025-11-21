import { createRoot } from 'react-dom/client';

const HELLO_CONTAINER_ID = 'wxt-hello-panel';

function HelloPanel() {
  return (
    <div
      style={{
        padding: '12px',
        border: '1px solid #0f9d58',
        borderRadius: '8px',
        background: '#f0fff4',
        fontFamily: 'Arial, sans-serif',
        marginBottom: '12px',
      }}
    >
      Hello
    </div>
  );
}

function tryMountHelloPanel() {
  const secondary = document.querySelector<HTMLDivElement>('#secondary');
  if (!secondary) {
    return false;
  }

  if (secondary.querySelector(`#${HELLO_CONTAINER_ID}`)) {
    return true;
  }

  const container = document.createElement('div');
  container.id = HELLO_CONTAINER_ID;
  secondary.prepend(container);

  const root = createRoot(container);
  root.render(<HelloPanel />);

  return true;
}

function mountHelloPanelWithObserver() {
  if (tryMountHelloPanel()) {
    return;
  }

  const observer = new MutationObserver(() => {
    if (tryMountHelloPanel()) {
      observer.disconnect();
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Ensure we eventually stop observing even if the target never appears.
  setTimeout(() => observer.disconnect(), 15000);
}

export default defineContentScript({
  matches: ['*://*.youtube.com/watch?v=*'],
  main() {
    mountHelloPanelWithObserver();
    document.addEventListener('yt-navigate-finish', () => {
      mountHelloPanelWithObserver();
    });
  },
});
