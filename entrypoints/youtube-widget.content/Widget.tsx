// src/entrypoints/youtube-widget.content/Widget.tsx
/**
 * React component for the YouTube Summary Widget.
 * Displays a UI card with options for language, model, and summary length,
 * along with action buttons for Summary, Transcript, and Chat features.
 */

import { type CSSProperties, useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { fetchTranscript } from "youtube-transcript-plus";

type TranscriptSegment = {
  offset: number;
  text: string;
};

type ActiveView = "summary" | "transcript" | null;

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

const transcriptSectionStyle: CSSProperties = {
  ...sectionStyle,
  marginTop: "8px",
  maxHeight: "220px",
  overflowY: "auto",
  gap: "10px",
};

const summarySectionStyle: CSSProperties = {
  ...sectionStyle,
  marginTop: "8px",
  gap: "10px",
};

const summaryTextStyle: CSSProperties = {
  fontSize: "13px",
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.85)",
  textAlign: "left",
};

const transcriptListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const transcriptItemStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const transcriptTimestampStyle: CSSProperties = {
  fontSize: "10px",
  color: "rgba(255,255,255,0.6)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "4px",
};

const transcriptMessageStyle: CSSProperties = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.75)",
  textAlign: "center",
};

const transcriptErrorStyle: CSSProperties = {
  ...transcriptMessageStyle,
  color: "#ff8a8a",
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

const onboardingTitleStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  textAlign: "center",
};

const onboardingDescriptionStyle: CSSProperties = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.75)",
  textAlign: "center",
  lineHeight: 1.5,
};

const apiKeyInputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  padding: "12px",
  background: "rgba(255,255,255,0.05)",
  color: "#f5f5f5",
  fontSize: "12px",
  outline: "none",
};

const gateActionsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const linkButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  textDecoration: "none",
  textAlign: "center",
};

const helperTextStyle: CSSProperties = {
  fontSize: "10px",
  color: "rgba(255,255,255,0.6)",
  textAlign: "center",
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

const GEMINI_MODEL_MAP: Record<string, string> = {
  "gpt-4o": "gemini-2.0-flash",
  "sonnet-3.5": "gemini-1.5-pro",
  mini: "gemini-1.5-flash",
};

const SUMMARY_STYLE_COPY: Record<string, string> = {
  short:
    "Provide a concise summary (2-3 sentences) highlighting the top insights.",
  medium:
    "Provide a medium-length summary (3-5 bullet sentences) covering the main sections and key takeaways.",
  long: "Provide a detailed summary (6+ sentences) including context, supporting points, and any action items discussed.",
};

const MAX_TRANSCRIPT_CHARACTERS = 6000;

const API_KEY_STORAGE_KEY = "googleAIStudioApiKey";
const GOOGLE_API_KEY_URL = "https://aistudio.google.com/app/apikey";

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
  const [transcriptSegments, setTranscriptSegments] = useState<
    TranscriptSegment[]
  >([]);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);
  const [transcriptLocale, setTranscriptLocale] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [summaryCache, setSummaryCache] = useState<Record<string, string>>({});

  const getModelId = () =>
    GEMINI_MODEL_MAP[model] ?? GEMINI_MODEL_MAP["gpt-4o"];

  const getLanguageLabel = () =>
    languages.find((entry) => entry.value === language)?.label ?? "English";

  const buildSummaryPrompt = (transcriptText: string) => {
    const lengthInstruction =
      SUMMARY_STYLE_COPY[length] ?? SUMMARY_STYLE_COPY.medium;
    return [
      `You are summarizing a YouTube video transcript in ${getLanguageLabel()}.`,
      lengthInstruction,
      "Focus on the main narrative arc, important data points, and any explicit recommendations.",
      "Transcript:",
      `"""${transcriptText}"""`,
    ].join("\n\n");
  };

  const reduceTranscript = (segments: TranscriptSegment[]) => {
    const combined = segments.map((segment) => segment.text ?? "").join(" ");
    if (combined.length <= MAX_TRANSCRIPT_CHARACTERS) return combined;
    return combined.slice(-MAX_TRANSCRIPT_CHARACTERS);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedKey = window.localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyInput(storedKey);
    }
  }, []);

  const persistApiKey = (value: string) => {
    if (typeof window === "undefined") return;
    if (value) {
      window.localStorage.setItem(API_KEY_STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setApiKeyNotice("Please paste a Google AI Studio API key to continue.");
      return;
    }
    persistApiKey(trimmed);
    setApiKey(trimmed);
    setApiKeyNotice("API key saved. You can update it anytime.");
  };

  const handleResetApiKey = () => {
    persistApiKey("");
    setApiKey("");
    setApiKeyInput("");
    setApiKeyNotice(null);
    setSummary(null);
    setSummaryError(null);
    setTranscriptSegments([]);
    setTranscriptLocale(null);
    setActiveView(null);
    setSummaryCache({});
  };

  /**
   * Extracts a video ID from the current URL.
   * Handles both standard watch URLs and youtu.be short links.
   */
  const extractCurrentVideoId = () => {
    try {
      const url = new URL(window.location.href);
      const paramId = url.searchParams.get("v");
      if (paramId) return paramId;
    } catch {
      // Ignore URL parsing failures and fall back to regex.
    }
    const match = window.location.href.match(
      /(?:v=|\/|v\/|embed\/|watch\?.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1];
  };

  /**
   * Formats transcript timestamps into mm:ss for readability.
   */
  const formatTimestamp = (offset: number) => {
    const totalSeconds = Math.floor(offset);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const fetchTranscriptForVideo = async (): Promise<TranscriptSegment[]> => {
    const videoId = extractCurrentVideoId();
    if (!videoId) {
      throw new Error("Unable to detect the current video.");
    }
    return fetchTranscript(videoId, { lang: language });
  };

  const refreshTranscriptState = async () => {
    const transcript = await fetchTranscriptForVideo();
    setTranscriptSegments(transcript);
    setTranscriptLocale(language);
    return transcript;
  };

  const transcriptMatchesLanguage =
    transcriptSegments.length > 0 && transcriptLocale === language;

  const buildSummaryCacheKey = (videoId: string) =>
    [videoId, language, length, model].join("|");

  const ensureTranscriptForSummary = async () => {
    if (transcriptMatchesLanguage) {
      return transcriptSegments;
    }
    return refreshTranscriptState();
  };

  /**
   * Handles click on the Transcript button by fetching and storing transcript data.
   */
  const handleTranscriptClick = async () => {
    if (isTranscriptLoading) return;
    if (!apiKey) {
      setTranscriptError(
        "Please add your Google AI Studio API key to continue."
      );
      return;
    }

    setActiveView("transcript");
    setTranscriptError(null);

    if (transcriptMatchesLanguage) {
      return;
    }

    const videoId = extractCurrentVideoId();
    if (!videoId) {
      setTranscriptError("Unable to detect the current video.");
      setTranscriptSegments([]);
      setTranscriptLocale(null);
      return;
    }

    setIsTranscriptLoading(true);

    try {
      const transcript = await refreshTranscriptState();
      if (!transcript.length) {
        setTranscriptError("Transcript was empty for this video.");
      }
    } catch (error) {
      setTranscriptSegments([]);
      setTranscriptLocale(null);
      setTranscriptError(
        error instanceof Error
          ? error.message
          : "Failed to fetch transcript. Please try again."
      );
    } finally {
      setIsTranscriptLoading(false);
    }
  };

  const handleSummaryClick = async () => {
    if (isSummaryLoading) return;
    if (!apiKey) {
      setSummaryError("Please add your Google AI Studio API key to continue.");
      return;
    }

    const videoId = extractCurrentVideoId();
    if (!videoId) {
      setSummaryError("Unable to detect the current video.");
      setSummary(null);
      return;
    }

    const cacheKey = buildSummaryCacheKey(videoId);
    setActiveView("summary");
    setIsSummaryLoading(true);
    setSummaryError(null);

    if (summaryCache[cacheKey]) {
      setSummary(summaryCache[cacheKey]);
      setIsSummaryLoading(false);
      return;
    }

    try {
      const transcript = await ensureTranscriptForSummary();
      if (!transcript.length) {
        setSummary(null);
        setSummaryError("Transcript is empty. Try fetching captions first.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildSummaryPrompt(reduceTranscript(transcript));
      const response = await ai.models.generateContent({
        model: getModelId(),
        contents: prompt,
        config: {
          maxOutputTokens: length === "long" ? 1024 : 512,
          temperature: 0.7,
        },
      });

      const inlineText = response.text?.trim();
      const fallbackText =
        response.candidates?.[0]?.content?.parts
          ?.map((part) =>
            typeof part === "object" &&
            part !== null &&
            "text" in part &&
            typeof (part as { text?: unknown }).text === "string"
              ? ((part as { text?: string }).text as string)
              : ""
          )
          .join(" ")
          .trim() ?? "";

      const finalSummary = inlineText || fallbackText;
      if (!finalSummary) {
        throw new Error("Gemini returned an empty response.");
      }
      setSummary(finalSummary);
      setSummaryCache((previous) => ({
        ...previous,
        [cacheKey]: finalSummary,
      }));
    } catch (error) {
      setSummary(null);
      setSummaryError(
        error instanceof Error
          ? error.message
          : "Failed to generate summary. Please try again."
      );
    } finally {
      setIsSummaryLoading(false);
    }
  };

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

  const renderSummaryPanel = () => (
    <div style={summarySectionStyle}>
      {isSummaryLoading && (
        <div style={transcriptMessageStyle}>Generating summary…</div>
      )}
      {!isSummaryLoading && summaryError && (
        <div style={transcriptErrorStyle}>{summaryError}</div>
      )}
      {!isSummaryLoading && !summaryError && summary && (
        <div style={summaryTextStyle}>
          {summary
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map((line, index) => (
              <p
                key={`${line}-${index}`}
                style={{
                  margin: 0,
                  marginBottom: "8px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {line}
              </p>
            ))}
        </div>
      )}
      {!isSummaryLoading && !summaryError && !summary && (
        <div style={transcriptMessageStyle}>
          Click Summary to generate Google AI insights for this video.
        </div>
      )}
    </div>
  );

  const renderTranscriptPanel = () => (
    <div style={transcriptSectionStyle}>
      {isTranscriptLoading && (
        <div style={transcriptMessageStyle}>Fetching transcript…</div>
      )}
      {!isTranscriptLoading && transcriptError && (
        <div style={transcriptErrorStyle}>{transcriptError}</div>
      )}
      {!isTranscriptLoading &&
        !transcriptError &&
        transcriptSegments.length === 0 && (
          <div style={transcriptMessageStyle}>
            Click Transcript to load the captions for this video.
          </div>
        )}
      {!isTranscriptLoading && !transcriptError && (
        <div style={transcriptListStyle}>
          {transcriptSegments.map((segment, index) => (
            <div key={`${segment.offset}-${index}`} style={transcriptItemStyle}>
              <span style={transcriptTimestampStyle}>
                {formatTimestamp(segment.offset)}
              </span>
              <span>{segment.text || "…"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaceholderPanel = () => (
    <div style={summarySectionStyle}>
      <div style={transcriptMessageStyle}>
        Run Summary or Transcript to preview insights here.
      </div>
    </div>
  );

  const renderContentPanel = () => {
    if (activeView === "summary") return renderSummaryPanel();
    if (activeView === "transcript") return renderTranscriptPanel();
    return renderPlaceholderPanel();
  };

  const renderHeader = () => (
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
  );

  if (!apiKey) {
    return (
      <div style={cardStyle}>
        {renderHeader()}
        <div style={sectionStyle}>
          <div style={onboardingTitleStyle}>Connect Google AI Studio</div>
          <div style={onboardingDescriptionStyle}>
            You need a Google AI Studio API key to generate summaries. Getting
            one is free and only takes a minute.
          </div>
          <input
            style={apiKeyInputStyle}
            placeholder="Paste your API key"
            type="password"
            value={apiKeyInput}
            onChange={(event) => {
              setApiKeyInput(event.target.value);
              setApiKeyNotice(null);
            }}
          />
          <div style={gateActionsStyle}>
            <button style={primaryButtonStyle} onClick={handleSaveApiKey}>
              Save API key
            </button>
            <a
              href={GOOGLE_API_KEY_URL}
              style={linkButtonStyle}
              target="_blank"
              rel="noreferrer"
            >
              Get free API key ↗
            </a>
          </div>
          {apiKeyNotice && (
            <div
              style={
                apiKeyNotice.includes("Please")
                  ? transcriptErrorStyle
                  : transcriptMessageStyle
              }
            >
              {apiKeyNotice}
            </div>
          )}
          <div style={helperTextStyle}>
            Stored securely in this browser only (localStorage).
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {renderHeader()}

      {/* Main content section */}
      <div style={sectionStyle}>
        <div
          style={{
            ...helperTextStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            textAlign: "left",
          }}
        >
          <span>Connected to Google AI Studio (stored locally).</span>
          <button
            style={{
              ...secondaryButtonStyle,
              flex: "unset",
              padding: "6px 10px",
              fontSize: "10px",
            }}
            onClick={handleResetApiKey}
          >
            Update key
          </button>
        </div>
        {/* Dropdown selectors for configuration */}
        <div style={pickerRowStyle}>
          {renderSelect("Language", language, setLanguage, languages)}
          {renderSelect("Model", model, setModel, models)}
          {renderSelect("Length", length, setLength, lengths)}
        </div>

        {/* Action buttons */}
        <div style={actionRowStyle}>
          {/* Primary action: Generate summary */}
          <button
            style={{
              ...primaryButtonStyle,
              opacity: isSummaryLoading ? 0.8 : 1,
            }}
            onClick={handleSummaryClick}
            disabled={isSummaryLoading}
          >
            <span>✨</span>
            <span>{isSummaryLoading ? "Summarizing…" : "Summary"}</span>
          </button>
          {/* Secondary action: View transcript */}
          <button
            style={{
              ...secondaryButtonStyle,
              opacity: isTranscriptLoading ? 0.7 : 1,
            }}
            onClick={handleTranscriptClick}
            disabled={isTranscriptLoading}
          >
            <span>📄</span>
            <span>{isTranscriptLoading ? "Loading…" : "Transcript"}</span>
          </button>
          {/* Secondary action: Open chat */}
          <button style={secondaryButtonStyle}>
            <span>💬</span>
            <span>Chat</span>
          </button>
        </div>
      </div>
      {renderContentPanel()}
    </div>
  );
}
