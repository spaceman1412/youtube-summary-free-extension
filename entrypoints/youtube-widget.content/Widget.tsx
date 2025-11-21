// src/entrypoints/youtube-widget.content/Widget.tsx
import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  borderRadius: "12px",
  padding: "16px",
  background:
    "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9))",
  color: "#fff",
  boxShadow: "0 12px 30px rgba(15,23,42,0.25)",
  border: "1px solid rgba(255,255,255,0.2)",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
};

const badgeStyle: CSSProperties = {
  padding: "4px 10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.2)",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const buttonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  border: "none",
  borderRadius: "999px",
  padding: "10px 18px",
  fontWeight: 600,
  fontSize: "14px",
  cursor: "pointer",
  background: "#0f172a",
  color: "white",
  boxShadow: "0 8px 18px rgba(15,23,42,0.35)",
};

export default function Widget() {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>AI Summary</h3>
          <p style={{ margin: "4px 0 0", fontSize: "14px", opacity: 0.9 }}>
            Quickly recap this video with highlights, chapters, and key quotes.
          </p>
        </div>
        <span style={badgeStyle}>BETA</span>
      </div>
      <button style={buttonStyle}>
        <span>Generate Summary</span>
        <span style={{ fontSize: "16px" }}>⚡️</span>
      </button>
    </div>
  );
}
