// src/entrypoints/youtube-widget.content/Widget.tsx
/**
 * React component for the YouTube Summary Widget.
 * Displays a UI card with options for language, model, and summary length,
 * along with action buttons for Summary, Transcript, and Chat features.
 */

import { type CSSProperties, useState } from "react";

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

/**
 * Main card container style - dark theme with rounded corners and shadow
 */
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

/**
 * Inner section style - nested container for form controls and buttons
 */
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

/**
 * Row container for the dropdown selectors (Language, Model, Length)
 */
const pickerRowStyle: CSSProperties = {
  display: "flex",
  gap: "4px",
  flexWrap: "wrap",
  justifyContent: "center",
};

/**
 * Label style for form inputs - small uppercase text with spacing
 */
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

/**
 * Dropdown select input style - dark theme with rounded corners
 */
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

/**
 * Row container for action buttons (Summary, Transcript, Chat)
 */
const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  justifyContent: "center",
};

/**
 * Header section style - contains brand logo and action icons
 */
const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

/**
 * Brand/logo container style - displays "Copilot" branding
 */
const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
};

/**
 * Brand icon container style - circular icon box
 */
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

/**
 * Container for header action buttons (expand, refresh icons)
 */
const headerActionsStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
};

/**
 * Small icon button style - used for header actions (circular buttons)
 */
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

/**
 * Base button style - shared styles for all action buttons
 */
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

/**
 * Secondary button style - transparent background (for Transcript, Chat buttons)
 */
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

// ============================================================================
// DATA CONFIGURATIONS
// ============================================================================

/**
 * Available languages for summary generation
 */
const languages = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "日本語", value: "jp" },
];

/**
 * Available AI models for summary generation
 */
const models = [
  { label: "GPT-4o", value: "gpt-4o" },
  { label: "Sonnet 3.5", value: "sonnet-3.5" },
  { label: "Mini", value: "mini" },
];

/**
 * Available summary length options
 */
const lengths = [
  { label: "Concise", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Detailed", value: "long" },
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Main Widget component.
 * Manages user preferences (language, model, length) and renders the UI.
 */
export default function Widget() {
  // State for user-selected options
  const [language, setLanguage] = useState(languages[0]?.value ?? "en");
  const [model, setModel] = useState(models[0]?.value ?? "gpt-4o");
  const [length, setLength] = useState(lengths[1]?.value ?? "medium");

  /**
   * Helper function to render a labeled dropdown select.
   * 
   * @param label - Display label for the select
   * @param value - Current selected value
   * @param onChange - Callback when selection changes
   * @param options - Array of {label, value} options
   * @returns JSX for a labeled select element
   */
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
      {/* Header section with branding and action icons */}
      <div style={headerStyle}>
        <div style={brandStyle}>
          <div style={brandIconStyle}>◎</div>
          <span>Copilot</span>
        </div>
        <div style={headerActionsStyle}>
          {/* Expand/collapse button (not yet implemented) */}
          <button style={iconButtonStyle}>⤴︎</button>
          {/* Refresh button (not yet implemented) */}
          <button style={iconButtonStyle}>⟳</button>
        </div>
      </div>

      {/* Main content section */}
      <div style={sectionStyle}>
        {/* Dropdown selectors for configuration */}
        <div style={pickerRowStyle}>
          {renderSelect("Language", language, setLanguage, languages)}
          {renderSelect("Model", model, setModel, models)}
          {renderSelect("Length", length, setLength, lengths)}
        </div>

        {/* Action buttons */}
        <div style={actionRowStyle}>
          {/* Primary action: Generate summary */}
          <button style={primaryButtonStyle}>
            <span>✨</span>
            <span>Summary</span>
          </button>
          {/* Secondary action: View transcript */}
          <button style={secondaryButtonStyle}>
            <span>📄</span>
            <span>Transcript</span>
          </button>
          {/* Secondary action: Open chat */}
          <button style={secondaryButtonStyle}>
            <span>💬</span>
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
