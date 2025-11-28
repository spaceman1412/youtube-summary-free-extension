/**
 * Style definitions for the YouTube Summary Widget
 * Organized by component/feature for better maintainability
 */

import type { CSSProperties } from "react";

// Base styles that are reused
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

const inputLabelBase: CSSProperties = {
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
 * Grouped style exports organized by component/feature
 */
export const styles = {
  // Layout & Container
  layout: {
    card: {
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
    } as CSSProperties,

    section: {
      background: "rgba(255,255,255,0.02)",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    } as CSSProperties,
  },

  // Picker/Select styles
  picker: {
    row: {
      display: "flex",
      gap: "6px",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      alignItems: "flex-start",
    } as CSSProperties,

    label: {
      base: inputLabelBase,
      small: { ...inputLabelBase, flex: 0.7 } as CSSProperties,
      large: { ...inputLabelBase, flex: 1.6 } as CSSProperties,
    },

    select: {
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
    } as CSSProperties,
  },

  // Custom Select (Model dropdown)
  customSelect: {
    container: {
      position: "relative",
      width: "100%",
    } as CSSProperties,

    button: {
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
    } as CSSProperties,

    dropdown: {
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
    } as CSSProperties,

    option: {
      base: {
        padding: "8px 10px",
        cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s ease",
      } as CSSProperties,

      hover: {
        padding: "8px 10px",
        cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s ease",
        background: "rgba(255,255,255,0.08)",
      } as CSSProperties,

      label: {
        fontSize: "11px",
        fontWeight: "500",
        color: "#f5f5f5",
        marginBottom: "2px",
        lineHeight: 1.3,
        textTransform: "none",
        letterSpacing: "0",
      } as CSSProperties,

      description: {
        fontSize: "9px",
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.4,
        fontWeight: "400",
        textTransform: "none",
        letterSpacing: "0",
      } as CSSProperties,
    },
  },

  // Tab/Action buttons
  tabs: {
    row: {
      display: "flex",
      gap: "2px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: "10px",
      padding: "3px",
    } as CSSProperties,

    button: {
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
    } as CSSProperties,

    buttonActive: {
      flex: 1,
      borderRadius: "8px",
      padding: "8px 10px",
      border: "none",
      background: "rgba(255,255,255,0.1)",
      color: "#f5f5f5",
      fontWeight: "500",
      fontSize: "11px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    } as CSSProperties,
  },

  // Header
  header: {
    container: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "4px",
    } as CSSProperties,

    iconButton: {
      ...headerIconButtonBase,
    } as CSSProperties,

    iconButtonGhost: {
      ...headerIconButtonBase,
      color: "rgba(255,255,255,0.85)",
    } as CSSProperties,
  },

  // Buttons
  button: {
    primary: {
      ...buttonBase,
      background: "#f5f5f5",
      color: "#0a0a0a",
    } as CSSProperties,

    secondary: {
      ...buttonBase,
      background: "rgba(255,255,255,0.08)",
      color: "#f5f5f5",
    } as CSSProperties,

    link: {
      ...buttonBase,
      background: "rgba(255,255,255,0.08)",
      color: "#f5f5f5",
      textDecoration: "none",
      textAlign: "center",
    } as CSSProperties,
  },

  // Transcript
  transcript: {
    section: {
      background: "transparent",
      borderRadius: "8px",
      border: "none",
      padding: "0",
      maxHeight: "300px",
      overflowY: "auto",
    } as CSSProperties,

    list: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      padding: "4px 0",
    } as CSSProperties,

    item: {
      display: "flex",
      flexDirection: "column",
      padding: "6px 8px",
      borderRadius: "6px",
      background: "transparent",
      border: "none",
      transition: "background 0.15s ease",
    } as CSSProperties,

    timestamp: {
      base: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.4)",
        fontFamily: "monospace",
        letterSpacing: "0.02em",
        marginBottom: "2px",
        cursor: "pointer",
        transition: "color 0.15s ease",
        userSelect: "none",
      } as CSSProperties,

      hover: {
        fontSize: "10px",
        color: "#f5f5f5",
        fontFamily: "monospace",
        letterSpacing: "0.02em",
        marginBottom: "2px",
        cursor: "pointer",
        transition: "color 0.15s ease",
        userSelect: "none",
      } as CSSProperties,
    },
  },

  // Summary
  summary: {
    section: {
      background: "transparent",
      borderRadius: "8px",
      border: "none",
      padding: "0",
      maxHeight: "320px",
      overflowY: "auto",
    } as CSSProperties,

    text: {
      fontSize: "14px",
      lineHeight: 1.8,
      color: "rgba(255,255,255,0.92)",
      textAlign: "left",
      padding: "12px 6px",
      letterSpacing: "0.01em",
      wordBreak: "break-word",
    } as CSSProperties,
  },

  // Chat
  chat: {
    section: {
      background: "transparent",
      borderRadius: "8px",
      border: "none",
      padding: "0",
      maxHeight: "300px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    } as CSSProperties,

    messages: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: 1,
      minHeight: "80px",
      overflowY: "auto",
      overflowX: "hidden",
      padding: "8px 4px",
    } as CSSProperties,

    message: {
      base: {
        padding: "8px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        lineHeight: 1.5,
        maxWidth: "88%",
        wordWrap: "break-word",
      } as CSSProperties,

      user: {
        padding: "8px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        lineHeight: 1.5,
        maxWidth: "88%",
        wordWrap: "break-word",
        alignSelf: "flex-end",
        background: "rgba(255,255,255,0.1)",
        color: "#f5f5f5",
        border: "none",
      } as CSSProperties,

      assistant: {
        padding: "8px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        lineHeight: 1.5,
        maxWidth: "88%",
        wordWrap: "break-word",
        alignSelf: "flex-start",
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.85)",
        border: "none",
      } as CSSProperties,
    },

    input: {
      container: {
        display: "flex",
        gap: "6px",
        marginTop: "6px",
        paddingTop: "8px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      } as CSSProperties,

      field: {
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
      } as CSSProperties,
    },

    sendButton: {
      borderRadius: "8px",
      padding: "8px 14px",
      border: "none",
      background: "rgba(255,255,255,0.1)",
      color: "#f5f5f5",
      fontWeight: "500",
      fontSize: "11px",
      cursor: "pointer",
      transition: "background 0.15s ease",
    } as CSSProperties,
  },

  // Onboarding/API Key Gate
  onboarding: {
    title: {
      fontSize: "14px",
      fontWeight: 600,
      textAlign: "center",
      color: "#f5f5f5",
    } as CSSProperties,

    description: {
      fontSize: "11px",
      color: "rgba(255,255,255,0.6)",
      textAlign: "center",
      lineHeight: 1.5,
    } as CSSProperties,

    input: {
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
    } as CSSProperties,

    actions: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    } as CSSProperties,

    helperText: {
      fontSize: "9px",
      color: "rgba(255,255,255,0.4)",
      textAlign: "center",
    } as CSSProperties,
  },

  // Common message/error styles
  common: {
    message: {
      fontSize: "11px",
      color: "rgba(255,255,255,0.5)",
      textAlign: "center",
      padding: "16px 8px",
    } as CSSProperties,

    error: {
      fontSize: "11px",
      color: "#ff6b6b",
      textAlign: "center",
      padding: "16px 8px",
    } as CSSProperties,
  },

  // Floating launcher (minimized state)
  floating: {
    launcher: {
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
    } as CSSProperties,
  },
} as const;
