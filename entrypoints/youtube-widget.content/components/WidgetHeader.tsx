import { useState } from "react";
import {
  headerContainerStyle,
  headerIconButtonGhostStyle,
  headerIconButtonStyle,
} from "../styles";

type WidgetHeaderProps = {
  isEditingApiKey: boolean;
  showApiKeyGate: boolean;
  onToggleApiKeyEditor: () => void;
  onMinimize: () => void;
};

export function WidgetHeader({
  isEditingApiKey,
  showApiKeyGate,
  onToggleApiKeyEditor,
  onMinimize,
}: WidgetHeaderProps) {
  const [hoveredButton, setHoveredButton] = useState<"edit" | "minimize" | null>(
    null
  );

  const isEditButtonDisabled = !showApiKeyGate && !isEditingApiKey;
  const editButtonBaseStyle =
    isEditingApiKey || showApiKeyGate
      ? headerIconButtonStyle
      : headerIconButtonGhostStyle;
  const editIcon = isEditingApiKey ? "✕" : "🔑";

  const getButtonStyle = (type: "edit" | "minimize") => {
    const style =
      type === "edit" ? editButtonBaseStyle : headerIconButtonStyle;
    const isHovered = hoveredButton === type;
    return {
      ...style,
      opacity: isHovered ? 1 : 0.7,
      transform: isHovered ? "scale(1.05)" : "scale(1)",
    };
  };

  return (
    <div style={headerContainerStyle}>
      <button
        type="button"
        style={getButtonStyle("edit")}
        onClick={onToggleApiKeyEditor}
        disabled={isEditButtonDisabled}
        aria-pressed={isEditingApiKey}
        aria-label={isEditingApiKey ? "Close API key editor" : "Edit API key"}
        title={isEditingApiKey ? "Close API key editor" : "Edit API key"}
        onMouseEnter={() => setHoveredButton("edit")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span aria-hidden="true">{editIcon}</span>
      </button>
      <button
        type="button"
        style={getButtonStyle("minimize")}
        onClick={onMinimize}
        aria-label="Minimize widget"
        title="Minimize widget"
        onMouseEnter={() => setHoveredButton("minimize")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span aria-hidden="true">−</span>
      </button>
    </div>
  );
}

