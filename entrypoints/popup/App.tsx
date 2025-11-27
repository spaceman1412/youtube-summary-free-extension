import "./App.css";

const REVIEW_URL =
  "https://chromewebstore.google.com/detail/youtube-summary-extension";
const GITHUB_URL = "https://github.com/chaileasevn/youtube-summary-extension";

const openExternalLink = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

function App() {
  return (
    <div className="popup-root">
      <div className="popup-card">
        <div className="popup-header">
          <div className="popup-icon">✨</div>
          <div className="popup-heading">
            <span className="popup-eyebrow">Support the mission</span>
            <h1 className="popup-title">Love the extension?</h1>
          </div>
        </div>

        <p className="popup-description">
          The project is free and open source—if you can leave a quick review
          and star the GitHub repo it will help me a lot while I keep improving
          this YouTube Summary experience.
        </p>

        <div className="popup-actions">
          <button
            className="popup-button popup-button--primary"
            onClick={() => openExternalLink(REVIEW_URL)}
          >
            Leave a Review
          </button>
          <button
            className="popup-button popup-button--ghost"
            onClick={() => openExternalLink(GITHUB_URL)}
          >
            Star on GitHub
          </button>
        </div>

        <p className="popup-helper">
          Thanks for keeping the project alive—your support fuels every update.
        </p>
      </div>
    </div>
  );
}

export default App;
