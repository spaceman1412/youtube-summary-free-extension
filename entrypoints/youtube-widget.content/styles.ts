/**
 * Style definitions for the YouTube Summary Widget
 */

import type { CSSProperties } from "react";

/**
 * Main card container style - dark theme with rounded corners and shadow
 */
export const cardStyle: CSSProperties = {
  borderRadius: "16px",
  padding: "12px",
  background: "#050505",
  color: "#f5f5f5",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

/**
 * Inner section style - nested container for form controls and buttons
 */
export const sectionStyle: CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

/**
 * Row container for the dropdown selectors (Language, Model, Length)
 */
export const pickerRowStyle: CSSProperties = {
  display: "flex",
  gap: "3px",
  flexWrap: "wrap",
  justifyContent: "center",
};

/**
 * Label style for form inputs - small uppercase text with spacing
 */
export const inputLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  fontSize: "8px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "rgba(255,255,255,0.7)",
};

/**
 * Dropdown select input style - dark theme with rounded corners
 */
export const selectStyle: CSSProperties = {
  minWidth: "85px",
  borderRadius: "10px",
  border: "none",
  padding: "8px 10px",
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
export const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: "4px",
  flexWrap: "wrap",
  justifyContent: "center",
};

/**
 * Header section style - contains brand logo and action icons
 */
export const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: "12px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
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
  ...sectionStyle,
  marginTop: "6px",
  maxHeight: "200px",
  overflowY: "auto",
  gap: "8px",
};

export const summarySectionStyle: CSSProperties = {
  ...sectionStyle,
  marginTop: "6px",
  gap: "8px",
};

export const summaryTextStyle: CSSProperties = {
  fontSize: "12px",
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.85)",
  textAlign: "left",
};

export const transcriptListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export const transcriptItemStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "8px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
};

export const transcriptTimestampStyle: CSSProperties = {
  fontSize: "9px",
  color: "rgba(255,255,255,0.6)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
  cursor: "pointer",
  transition: "color 0.2s ease, opacity 0.2s ease",
  userSelect: "none",
};

export const transcriptTimestampHoverStyle: CSSProperties = {
  ...transcriptTimestampStyle,
  color: "rgba(255,255,255,0.9)",
};

export const transcriptMessageStyle: CSSProperties = {
  fontSize: "11px",
  color: "rgba(255,255,255,0.75)",
  textAlign: "center",
};

export const transcriptErrorStyle: CSSProperties = {
  ...transcriptMessageStyle,
  color: "#ff8a8a",
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

/**
 * Base button style - shared styles for all action buttons
 */
const buttonBase: CSSProperties = {
  flex: 1,
  minWidth: "75px",
  borderRadius: "999px",
  padding: "8px 12px",
  border: "1px solid rgba(255,255,255,0.2)",
  fontWeight: "600",
  fontSize: "10px",
  cursor: "pointer",
  transition: "background 0.3s ease, color 0.3s ease",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
};

/**
 * Secondary button style - transparent background (for Transcript, Chat buttons)
 */
export const secondaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "transparent",
  color: "#f5f5f5",
};

export const primaryButtonStyle: CSSProperties = {
  ...buttonBase,
  background: "#f5f5f5",
  color: "#050505",
  borderColor: "transparent",
};

export const onboardingTitleStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  textAlign: "center",
};

export const onboardingDescriptionStyle: CSSProperties = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.75)",
  textAlign: "center",
  lineHeight: 1.5,
};

export const apiKeyInputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "12px",
  background: "rgba(255,255,255,0.05)",
  color: "#f5f5f5",
  fontSize: "12px",
  outline: "none",
};

export const gateActionsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export const linkButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  textDecoration: "none",
  textAlign: "center",
};

export const helperTextStyle: CSSProperties = {
  fontSize: "10px",
  color: "rgba(255,255,255,0.6)",
  textAlign: "center",
};

export const chatSectionStyle: CSSProperties = {
  ...sectionStyle,
  marginTop: "6px",
  maxHeight: "280px",
  gap: "0",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export const chatMessagesStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
  minHeight: "100px",
  maxHeight: "260px",
  overflowY: "auto",
  overflowX: "hidden",
  paddingBottom: "8px",
  paddingRight: "8px",
  paddingLeft: "4px",
};

export const chatMessageStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: "10px",
  fontSize: "12px",
  lineHeight: 1.5,
  maxWidth: "85%",
  wordWrap: "break-word",
};

export const chatMessageUserStyle: CSSProperties = {
  ...chatMessageStyle,
  alignSelf: "flex-end",
  background: "rgba(245,245,245,0.15)",
  color: "#f5f5f5",
  border: "1px solid rgba(255,255,255,0.1)",
};

export const chatMessageAssistantStyle: CSSProperties = {
  ...chatMessageStyle,
  alignSelf: "flex-start",
  background: "rgba(255,255,255,0.03)",
  color: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(255,255,255,0.05)",
};

export const chatInputContainerStyle: CSSProperties = {
  display: "flex",
  gap: "6px",
  marginTop: "8px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  paddingTop: "8px",
  flexShrink: 0,
};

export const chatInputStyle: CSSProperties = {
  flex: 1,
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.05)",
  color: "#f5f5f5",
  fontSize: "12px",
  outline: "none",
  resize: "none",
  fontFamily: "inherit",
};

export const chatSendButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  flex: "unset",
  minWidth: "unset",
  padding: "10px 16px",
  borderRadius: "10px",
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
  minWidth: "85px",
  width: "100%",
  borderRadius: "10px",
  border: "none",
  padding: "8px 10px",
  background: "rgba(255,255,255,0.08)",
  color: "#f5f5f5",
  fontWeight: "500",
  fontSize: "12px",
  appearance: "none",
  outline: "none",
  transition: "background 0.2s ease",
  cursor: "pointer",
  textAlign: "left",
};

export const customSelectDropdownStyle: CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  marginTop: "4px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "#050505",
  boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
  zIndex: 1000,
  maxHeight: "240px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};

export const customSelectOptionStyle: CSSProperties = {
  padding: "5px 10px",
  cursor: "pointer",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  transition: "background 0.2s ease",
};

export const customSelectOptionHoverStyle: CSSProperties = {
  ...customSelectOptionStyle,
  background: "rgba(255,255,255,0.08)",
};

export const customSelectOptionLabelStyle: CSSProperties = {
  fontSize: "8px",
  fontWeight: "500",
  color: "#f5f5f5",
  marginBottom: "1px",
  lineHeight: 1.2,
};

export const customSelectOptionDescriptionStyle: CSSProperties = {
  fontSize: "6px",
  color: "rgba(255,255,255,0.65)",
  lineHeight: 1.3,
  fontWeight: "400",
  textTransform: "none",
};
