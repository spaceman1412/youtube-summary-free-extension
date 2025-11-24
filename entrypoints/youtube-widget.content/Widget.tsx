// src/entrypoints/youtube-widget.content/Widget.tsx
import { type CSSProperties, useState } from "react";

const cardStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "16px",
  background: "#050505",
  color: "#f5f5f5",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const sectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

const pickerRowStyle: CSSProperties = {
  display: "flex",
  gap: "4px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const inputLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  fontSize: "9px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "rgba(255,255,255,0.7)",
};

const selectStyle: CSSProperties = {
  minWidth: "100px",
  borderRadius: "10px",
  border: "none",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.08)",
  color: "#f5f5f5",
  fontWeight: "500",
  fontSize: "12px",
  appearance: "none",
  outline: "none",
  transition: "background 0.2s ease",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
};

const brandIconStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  color: "#f5f5f5",
};

const headerActionsStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
};

const iconButtonStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "transparent",
  color: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  cursor: "pointer",
};

const buttonBase: CSSProperties = {
  flex: 1,
  minWidth: "85px",
  borderRadius: "999px",
  padding: "10px 14px",
  border: "1px solid rgba(255,255,255,0.2)",
  fontWeight: "600",
  fontSize: "11px",
  cursor: "pointer",
  transition: "background 0.3s ease, color 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "transparent",
  color: "#f5f5f5",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "#f5f5f5",
  color: "#050505",
  borderColor: "transparent",
};

const languages = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "日本語", value: "jp" },
];

const models = [
  { label: "GPT-4o", value: "gpt-4o" },
  { label: "Sonnet 3.5", value: "sonnet-3.5" },
  { label: "Mini", value: "mini" },
];

const lengths = [
  { label: "Concise", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Detailed", value: "long" },
];

export default function Widget() {
  const [language, setLanguage] = useState(languages[0]?.value ?? "en");
  const [model, setModel] = useState(models[0]?.value ?? "gpt-4o");
  const [length, setLength] = useState(lengths[1]?.value ?? "medium");

  const renderSelect = (
    label: string,
    value: string,
    onChange: (next: string) => void,
    options: { label: string; value: string }[]
  ) => (
    <label style={inputLabelStyle}>
      {label}
      <select
        style={selectStyle}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={brandStyle}>
          <div style={brandIconStyle}>◎</div>
          <span>Copilot</span>
        </div>
        <div style={headerActionsStyle}>
          <button style={iconButtonStyle}>⤴︎</button>
          <button style={iconButtonStyle}>⟳</button>
        </div>
      </div>
      <div style={sectionStyle}>
        <div style={pickerRowStyle}>
          {renderSelect("Language", language, setLanguage, languages)}
          {renderSelect("Model", model, setModel, models)}
          {renderSelect("Length", length, setLength, lengths)}
        </div>

        <div style={actionRowStyle}>
          <button style={primaryButtonStyle}>
            <span>✨</span>
            <span>Summary</span>
          </button>
          <button style={secondaryButtonStyle}>
            <span>📄</span>
            <span>Transcript</span>
          </button>
          <button style={secondaryButtonStyle}>
            <span>💬</span>
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
