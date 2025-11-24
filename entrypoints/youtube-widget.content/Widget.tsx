// src/entrypoints/youtube-widget.content/Widget.tsx
import { type CSSProperties, useState } from "react";

const CARD_BG =
  "linear-gradient(135deg, rgba(17,24,39,0.98), rgba(88,28,135,0.95), rgba(59,130,246,0.9))";

const cardStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "12px",
  background: CARD_BG,
  color: "#f8fafc",
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.3), 0 8px 16px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(20px)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "6px",
};

const badgeStyle: CSSProperties = {
  padding: "2px 8px",
  borderRadius: "999px",
  background: "rgba(248,250,252,0.15)",
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 600,
};

const sectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  backdropFilter: "blur(10px)",
  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.1)",
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
  color: "rgba(255,255,255,0.9)",
};

const selectStyle: CSSProperties = {
  minWidth: "80px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "4px 8px",
  background: "rgba(255,255,255,0.1)",
  color: "#ffffff",
  fontWeight: "500",
  fontSize: "11px",
  appearance: "none",
  outline: "none",
  backdropFilter: "blur(10px)",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const buttonBase: CSSProperties = {
  flex: 1,
  minWidth: "85px",
  borderRadius: "20px",
  padding: "6px 12px",
  border: "none",
  fontWeight: "600",
  fontSize: "11px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "rgba(255,255,255,0.15)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.2)",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
  color: "#ffffff",
  boxShadow:
    "0 6px 20px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
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
        </div>
      </div>
    </div>
  );
}
