/**
 * Style definitions for the YouTube Summary Widget
 */

import type { CSSProperties } from "react";

/**
 * Main card container style - dark theme with rounded corners and shadow
 */
export const cardStyle: CSSProperties = {
  borderRadius: "14px",
  padding: "10px",
  background: "#0a0a0a",
  color: "#f5f5f5",
  boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  position: "relative",
};

/**
 * Inner section style - nested container for form controls and buttons
 */
export const sectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

/**
 * Row container for the dropdown selectors (Language, Model, Length)
 */
export const pickerRowStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

/**
 * Label style for form inputs - small uppercase text with spacing
 */
export const inputLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  fontSize: "9px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.5)",
  flex: 1,
  minWidth: 0,
};

/**
 * Label style for small pickers (Language, Length) - narrower width
 */
export const smallPickerLabelStyle: CSSProperties = {
  ...inputLabelStyle,
  flex: 0.7,
};

/**
 * Label style for large picker (Model) - wider width
 */
export const largePickerLabelStyle: CSSProperties = {
  ...inputLabelStyle,
  flex: 1.6,
};

/**
 * Dropdown select input style - dark theme with rounded corners
 */
export const selectStyle: CSSProperties = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "6px 8px",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f5f5",
  fontWeight: "500",
  fontSize: "11px",
  appearance: "none",
  outline: "none",
  transition: "background 0.2s ease, border-color 0.2s ease",
  cursor: "pointer",
};

/**
 * Row container for action buttons (Summary, Transcript, Chat) - tab strip style
 */
export const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: "2px",
  background: "rgba(255,255,255,0.03)",
  borderRadius: "10px",
  padding: "3px",
};

/**
 * Tab button base style
 */
export const tabButtonStyle: CSSProperties = {
  flex: 1,
  borderRadius: "8px",
  padding: "8px 10px",
  border: "none",
  background: "transparent",
  color: "rgba(255,255,255,0.6)",
  fontWeight: "500",
  fontSize: "11px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
};

/**
 * Active tab button style
 */
export const tabButtonActiveStyle: CSSProperties = {
  ...tabButtonStyle,
  background: "rgba(255,255,255,0.1)",
  color: "#f5f5f5",
};

/**
 * Header section style - contains brand logo and action icons
 */
export const headerContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "4px",
};

const headerIconButtonBase: CSSProperties = {
  width: "22px",
  height: "22px",
  border: "none",
  background: "transparent",
  color: "#f5f5f5",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  padding: 0,
  transition: "opacity 0.15s ease, color 0.15s ease",
};

export const headerIconButtonStyle: CSSProperties = {
  ...headerIconButtonBase,
};

export const headerIconButtonGhostStyle: CSSProperties = {
  ...headerIconButtonBase,
  color: "rgba(255,255,255,0.85)",
};

/**
 * Brand/logo container style - displays "Copilot" branding
 */
export const brandStyle: CSSProperties = {
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
export const brandIconStyle: CSSProperties = {
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
export const headerActionsStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
};

export const transcriptSectionStyle: CSSProperties = {
  background: "transparent",
  borderRadius: "8px",
  border: "none",
  padding: "0",
  maxHeight: "300px",
  overflowY: "auto",
};

export const summarySectionStyle: CSSProperties = {
  background: "transparent",
  borderRadius: "8px",
  border: "none",
  padding: "0",
  maxHeight: "280px",
  overflowY: "auto",
};

export const summaryTextStyle: CSSProperties = {
  fontSize: "12px",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.8)",
  textAlign: "left",
  padding: "8px 4px",
};

export const transcriptListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: "4px 0",
};

export const transcriptItemStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "6px 8px",
  borderRadius: "6px",
  background: "transparent",
  border: "none",
  transition: "background 0.15s ease",
};

export const transcriptTimestampStyle: CSSProperties = {
  fontSize: "10px",
  color: "rgba(255,255,255,0.4)",
  fontFamily: "monospace",
  letterSpacing: "0.02em",
  marginBottom: "2px",
  cursor: "pointer",
  transition: "color 0.15s ease",
  userSelect: "none",
};

export const transcriptTimestampHoverStyle: CSSProperties = {
  ...transcriptTimestampStyle,
  color: "#f5f5f5",
};

export const transcriptMessageStyle: CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.5)",
  textAlign: "center",
  padding: "16px 8px",
};

export const transcriptErrorStyle: CSSProperties = {
  fontSize: "11px",
  color: "#ff6b6b",
  textAlign: "center",
  padding: "16px 8px",
};

/**
 * Small icon button style - used for header actions (circular buttons)
 */
export const iconButtonStyle: CSSProperties = {
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

export const floatingLauncherStyle: CSSProperties = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(10,10,10,0.9)",
  color: "#f5f5f5",
  padding: "10px 18px",
  fontSize: "12px",
  fontWeight: 600,
  boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  zIndex: 2147483647,
  transition: "transform 0.2s ease, background 0.2s ease",
};

/**
 * Base button style - shared styles for all action buttons
 */
const buttonBase: CSSProperties = {
  flex: 1,
  borderRadius: "8px",
  padding: "10px 14px",
  border: "none",
  fontWeight: "500",
  fontSize: "11px",
  cursor: "pointer",
  transition: "background 0.15s ease, opacity 0.15s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
};

/**
 * Secondary button style - transparent background (for Transcript, Chat buttons)
 */
export const secondaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "rgba(255,255,255,0.08)",
  color: "#f5f5f5",
};

export const primaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "#f5f5f5",
  color: "#0a0a0a",
};

export const onboardingTitleStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  textAlign: "center",
  color: "#f5f5f5",
};

export const onboardingDescriptionStyle: CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.6)",
  textAlign: "center",
  lineHeight: 1.5,
};

export const apiKeyInputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f5f5",
  fontSize: "12px",
  outline: "none",
  transition: "border-color 0.15s ease",
};

export const gateActionsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

export const linkButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  textDecoration: "none",
  textAlign: "center",
};

export const helperTextStyle: CSSProperties = {
  fontSize: "9px",
  color: "rgba(255,255,255,0.4)",
  textAlign: "center",
};

export const chatSectionStyle: CSSProperties = {
  background: "transparent",
  borderRadius: "8px",
  border: "none",
  padding: "0",
  maxHeight: "300px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export const chatMessagesStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  flex: 1,
  minHeight: "80px",
  maxHeight: "220px",
  overflowY: "auto",
  overflowX: "hidden",
  padding: "8px 4px",
};

export const chatMessageStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  lineHeight: 1.5,
  maxWidth: "88%",
  wordWrap: "break-word",
};

export const chatMessageUserStyle: CSSProperties = {
  ...chatMessageStyle,
  alignSelf: "flex-end",
  background: "rgba(255,255,255,0.1)",
  color: "#f5f5f5",
  border: "none",
};

export const chatMessageAssistantStyle: CSSProperties = {
  ...chatMessageStyle,
  alignSelf: "flex-start",
  background: "rgba(255,255,255,0.04)",
  color: "rgba(255,255,255,0.85)",
  border: "none",
};

export const chatInputContainerStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
  marginTop: "6px",
  paddingTop: "8px",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  flexShrink: 0,
};

export const chatInputStyle: CSSProperties = {
  flex: 1,
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "8px 10px",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f5f5",
  fontSize: "12px",
  outline: "none",
  resize: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease",
};

export const chatSendButtonStyle: CSSProperties = {
  borderRadius: "8px",
  padding: "8px 14px",
  border: "none",
  background: "rgba(255,255,255,0.1)",
  color: "#f5f5f5",
  fontWeight: "500",
  fontSize: "11px",
  cursor: "pointer",
  transition: "background 0.15s ease",
};

export const modelDescriptionStyle: CSSProperties = {
  fontSize: "9px",
  color: "rgba(255,255,255,0.5)",
  marginTop: "2px",
  lineHeight: 1.3,
  fontStyle: "italic",
};

export const customSelectContainerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
};

export const customSelectButtonStyle: CSSProperties = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "6px 8px",
  background: "rgba(255,255,255,0.04)",
  color: "#f5f5f5",
  fontWeight: "500",
  fontSize: "11px",
  appearance: "none",
  outline: "none",
  transition: "background 0.15s ease, border-color 0.15s ease",
  cursor: "pointer",
  textAlign: "left",
};

export const customSelectDropdownStyle: CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  marginTop: "4px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#0a0a0a",
  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  zIndex: 1000,
  maxHeight: "200px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

export const customSelectOptionStyle: CSSProperties = {
  padding: "8px 10px",
  cursor: "pointer",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  transition: "background 0.15s ease",
};

export const customSelectOptionHoverStyle: CSSProperties = {
  ...customSelectOptionStyle,
  background: "rgba(255,255,255,0.08)",
};

export const customSelectOptionLabelStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: "500",
  color: "#f5f5f5",
  marginBottom: "2px",
  lineHeight: 1.3,
  textTransform: "none",
  letterSpacing: "0",
};

export const customSelectOptionDescriptionStyle: CSSProperties = {
  fontSize: "9px",
  color: "rgba(255,255,255,0.5)",
  lineHeight: 1.4,
  fontWeight: "400",
  textTransform: "none",
  letterSpacing: "0",
};
