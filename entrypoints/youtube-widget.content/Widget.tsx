/**
 * React component for the YouTube Summary Widget.
 * Displays a UI card with options for language, model, and summary length,
 * along with action buttons for Summary, Transcript, and Chat features.
 */

import { useEffect, useState, useRef } from "react";
import type {
  TranscriptSegment,
  ActiveView,
  ChatMessage,
  ModelOption,
} from "./types";
import { languages, models, lengths, GOOGLE_API_KEY_URL } from "./constants";
import {
  cardStyle,
  sectionStyle,
  pickerRowStyle,
  inputLabelStyle,
  smallPickerLabelStyle,
  largePickerLabelStyle,
  selectStyle,
  actionRowStyle,
  tabButtonStyle,
  tabButtonActiveStyle,
  transcriptSectionStyle,
  summarySectionStyle,
  summaryTextStyle,
  transcriptListStyle,
  transcriptItemStyle,
  transcriptTimestampStyle,
  transcriptTimestampHoverStyle,
  transcriptMessageStyle,
  transcriptErrorStyle,
  primaryButtonStyle,
  onboardingTitleStyle,
  onboardingDescriptionStyle,
  apiKeyInputStyle,
  gateActionsStyle,
  linkButtonStyle,
  helperTextStyle,
  chatSectionStyle,
  chatMessagesStyle,
  chatMessageUserStyle,
  chatMessageAssistantStyle,
  chatInputContainerStyle,
  chatInputStyle,
  chatSendButtonStyle,
  customSelectContainerStyle,
  customSelectButtonStyle,
  customSelectDropdownStyle,
  customSelectOptionStyle,
  customSelectOptionLabelStyle,
  customSelectOptionDescriptionStyle,
} from "./styles";
import {
  formatTimestamp,
  extractCurrentVideoId,
  seekToTimestamp,
  parseTimestampsFromText,
} from "./utils";
import { fetchTranscriptForVideo } from "./transcriptService";
import { generateSummary, buildSummaryCacheKey } from "./summaryService";
import { generateChatResponse } from "./chatService";
import { getStoredApiKey, saveApiKey, removeApiKey } from "./apiKeyService";

/**
 * Helper function to render a labeled dropdown select.
 */
const renderSelect = (
  label: string,
  value: string,
  onChange: (next: string) => void,
  options: { label: string; value: string }[]
) => (
  <label style={smallPickerLabelStyle}>
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

/**
 * Custom dropdown component for models with descriptions
 */
const CustomModelSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: ModelOption[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use 'click' instead of 'mousedown' and add a small delay
      // to ensure option clicks fire before the outside handler
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div style={largePickerLabelStyle}>
      <span>{label}</span>
      <div style={customSelectContainerStyle} ref={containerRef}>
        <button
          type="button"
          style={customSelectButtonStyle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {selectedOption?.label || "Select model"}
        </button>
        {isOpen && (
          <div style={customSelectDropdownStyle}>
            {options.map((option) => {
              const isSelected = option.value === value;
              const isHovered = hoveredOption === option.value;
              return (
                <div
                  key={option.value}
                  style={{
                    ...customSelectOptionStyle,
                    background:
                      isSelected || isHovered
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionClick(option.value);
                  }}
                  onMouseEnter={() => setHoveredOption(option.value)}
                  onMouseLeave={() => setHoveredOption(null)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div style={customSelectOptionLabelStyle}>{option.label}</div>
                  {option.description && (
                    <div style={customSelectOptionDescriptionStyle}>
                      {option.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Helper function to render a labeled dropdown select with description (for models).
 */
const renderModelSelect = (
  label: string,
  value: string,
  onChange: (next: string) => void,
  options: ModelOption[]
) => {
  return (
    <CustomModelSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

/**
 * Main Widget component.
 * Manages user preferences (language, model, length) and renders the UI.
 */
export default function Widget() {
  // State for user-selected options
  const [language, setLanguage] = useState("en");
  const [model, setModel] = useState(
    models[2]?.value ?? "gemini-2.5-flash-lite"
  );
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const currentVideoIdRef = useRef<string | undefined>(undefined);
  const previousMessageCountRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);

  // Load API key from storage on mount
  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyInput(storedKey);
    }
  }, []);

  // Reset chat messages when video changes
  useEffect(() => {
    const checkVideoChange = () => {
      const videoId = extractCurrentVideoId();
      if (videoId !== currentVideoIdRef.current) {
        currentVideoIdRef.current = videoId;
        setChatMessages([]);
        setChatError(null);
        previousMessageCountRef.current = 0;
        if (activeView === "chat") {
          setActiveView(null);
        }
      }
    };

    // Check immediately
    checkVideoChange();

    // Set up interval to check for video changes
    const interval = setInterval(checkVideoChange, 1000);

    return () => clearInterval(interval);
  }, [activeView]);

  // Scroll to bottom of chat messages when new messages are added
  useEffect(() => {
    if (
      activeView === "chat" &&
      chatMessagesEndRef.current &&
      chatMessagesContainerRef.current &&
      chatMessages.length > previousMessageCountRef.current &&
      !isUserScrollingRef.current
    ) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (!isUserScrollingRef.current && chatMessagesContainerRef.current) {
          chatMessagesContainerRef.current.scrollTop =
            chatMessagesContainerRef.current.scrollHeight;
        }
      }, 100);
      previousMessageCountRef.current = chatMessages.length;
    }
  }, [chatMessages.length, activeView]);

  const handleApiKeyInputChange = (value: string) => {
    setApiKeyInput(value);
    setApiKeyNotice(null);
  };

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setApiKeyNotice("Please paste a Google AI Studio API key to continue.");
      return;
    }
    saveApiKey(trimmed);
    setApiKey(trimmed);
    setApiKeyNotice("API key saved. You can update it anytime.");
  };

  const handleResetApiKey = () => {
    removeApiKey();
    setApiKey("");
    setApiKeyInput("");
    setApiKeyNotice(null);
    setSummary(null);
    setSummaryError(null);
    setTranscriptSegments([]);
    setTranscriptLocale(null);
    setActiveView(null);
    setSummaryCache({});
    setChatMessages([]);
    setChatInput("");
    setChatError(null);
  };

  const transcriptMatchesLanguage =
    transcriptSegments.length > 0 && transcriptLocale === language;

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
      const transcript = await fetchTranscriptForVideo(language);
      setTranscriptSegments(transcript);
      setTranscriptLocale(language);
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

    const cacheKey = buildSummaryCacheKey(videoId, language, length, model);
    setActiveView("summary");
    setIsSummaryLoading(true);
    setSummaryError(null);

    if (summaryCache[cacheKey]) {
      setSummary(summaryCache[cacheKey]);
      setIsSummaryLoading(false);
      return;
    }

    try {
      // Ensure we have transcript
      let transcript = transcriptSegments;
      if (!transcriptMatchesLanguage) {
        transcript = await fetchTranscriptForVideo(language);
        setTranscriptSegments(transcript);
        setTranscriptLocale(language);
      }

      const finalSummary = await generateSummary(
        apiKey,
        transcript,
        model,
        language,
        length
      );
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

  const handleChatClick = async () => {
    if (!apiKey) {
      setChatError("Please add your Google AI Studio API key to continue.");
      return;
    }

    const videoId = extractCurrentVideoId();
    if (!videoId) {
      setChatError("Unable to detect the current video.");
      return;
    }

    setActiveView("chat");
    setChatError(null);

    // Ensure we have transcript
    if (!transcriptMatchesLanguage) {
      setIsChatLoading(true);
      try {
        const transcript = await fetchTranscriptForVideo(language);
        setTranscriptSegments(transcript);
        setTranscriptLocale(language);
        if (!transcript.length) {
          setChatError("Transcript was empty for this video.");
        }
      } catch (error) {
        setChatError(
          error instanceof Error
            ? error.message
            : "Failed to fetch transcript. Please try again."
        );
      } finally {
        setIsChatLoading(false);
      }
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput || isChatLoading) return;
    if (!apiKey) {
      setChatError("Please add your Google AI Studio API key to continue.");
      return;
    }

    const videoId = extractCurrentVideoId();
    if (!videoId) {
      setChatError("Unable to detect the current video.");
      return;
    }

    // Ensure we have transcript
    let transcript = transcriptSegments;
    if (!transcriptMatchesLanguage) {
      setIsChatLoading(true);
      try {
        transcript = await fetchTranscriptForVideo(language);
        setTranscriptSegments(transcript);
        setTranscriptLocale(language);
        if (!transcript.length) {
          setChatError("Transcript was empty for this video.");
          setIsChatLoading(false);
          return;
        }
      } catch (error) {
        setChatError(
          error instanceof Error
            ? error.message
            : "Failed to fetch transcript. Please try again."
        );
        setIsChatLoading(false);
        return;
      } finally {
        setIsChatLoading(false);
      }
    }

    // Add user message
    const userMessage: ChatMessage = { role: "user", content: trimmedInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatError(null);
    setIsChatLoading(true);

    try {
      const response = await generateChatResponse(
        apiKey,
        updatedMessages,
        transcript,
        model,
        language
      );
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
      };
      setChatMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "Failed to generate response. Please try again."
      );
      // Remove the user message if there was an error
      setChatMessages(chatMessages);
    } finally {
      setIsChatLoading(false);
    }
  };

  /**
   * Renders a line of text with clickable timestamps
   */
  const renderTextWithTimestamps = (text: string, lineIndex: number) => {
    const timestamps = parseTimestampsFromText(text);

    if (timestamps.length === 0) {
      // No timestamps found, return plain text
      return <span>{text}</span>;
    }

    // Sort timestamps by index to process in order
    const sortedTimestamps = [...timestamps].sort((a, b) => a.index - b.index);

    const elements = [];
    let lastIndex = 0;

    sortedTimestamps.forEach((ts, tsIndex) => {
      // Add text before timestamp
      if (ts.index > lastIndex) {
        elements.push(
          <span key={`text-${lineIndex}-${tsIndex}`}>
            {text.substring(lastIndex, ts.index)}
          </span>
        );
      }

      // Add clickable timestamp
      const timestampOffset = ts.offset;
      elements.push(
        <span
          key={`timestamp-${lineIndex}-${tsIndex}`}
          style={
            hoveredTimestamp === timestampOffset
              ? transcriptTimestampHoverStyle
              : transcriptTimestampStyle
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            seekToTimestamp(timestampOffset);
          }}
          onMouseEnter={() => setHoveredTimestamp(timestampOffset)}
          onMouseLeave={() => setHoveredTimestamp(null)}
          role="button"
          tabIndex={0}
          aria-label={`Seek to ${formatTimestamp(timestampOffset)}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              seekToTimestamp(timestampOffset);
            }
          }}
        >
          {ts.timestamp}
        </span>
      );

      lastIndex = ts.index + ts.timestamp.length;
    });

    // Add remaining text after last timestamp
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lineIndex}-end`}>{text.substring(lastIndex)}</span>
      );
    }

    return <>{elements}</>;
  };

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
                {renderTextWithTimestamps(line, index)}
              </p>
            ))}
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
      {!isTranscriptLoading && !transcriptError && (
        <div style={transcriptListStyle}>
          {transcriptSegments.map((segment, index) => (
            <div key={`${segment.offset}-${index}`} style={transcriptItemStyle}>
              <span
                style={
                  hoveredTimestamp === segment.offset
                    ? transcriptTimestampHoverStyle
                    : transcriptTimestampStyle
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  seekToTimestamp(segment.offset);
                }}
                onMouseEnter={() => setHoveredTimestamp(segment.offset)}
                onMouseLeave={() => setHoveredTimestamp(null)}
                role="button"
                tabIndex={0}
                aria-label={`Seek to ${formatTimestamp(segment.offset)}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    seekToTimestamp(segment.offset);
                  }
                }}
              >
                {formatTimestamp(segment.offset)}
              </span>
              <span>{segment.text || "…"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaceholderPanel = () => null;

  const renderChatPanel = () => (
    <div style={chatSectionStyle}>
      <div
        ref={chatMessagesContainerRef}
        style={chatMessagesStyle}
        onScroll={() => {
          if (chatMessagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
              chatMessagesContainerRef.current;
            // Check if user is near bottom (within 50px)
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
            isUserScrollingRef.current = !isNearBottom;
          }
        }}
      >
        {chatMessages.map((message, index) => (
          <div
            key={index}
            style={
              message.role === "user"
                ? chatMessageUserStyle
                : chatMessageAssistantStyle
            }
          >
            {message.content}
          </div>
        ))}
        {isChatLoading && <div style={transcriptMessageStyle}>Thinking…</div>}
        {chatError && <div style={transcriptErrorStyle}>{chatError}</div>}
        <div ref={chatMessagesEndRef} />
      </div>
      <div style={chatInputContainerStyle}>
        <input
          style={chatInputStyle}
          type="text"
          placeholder="Ask a question..."
          value={chatInput}
          onChange={(event) => setChatInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isChatLoading}
        />
        <button
          style={{
            ...chatSendButtonStyle,
            opacity: isChatLoading || !chatInput.trim() ? 0.5 : 1,
          }}
          onClick={handleSendMessage}
          disabled={isChatLoading || !chatInput.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );

  const renderContentPanel = () => {
    if (activeView === "summary") return renderSummaryPanel();
    if (activeView === "transcript") return renderTranscriptPanel();
    if (activeView === "chat") return renderChatPanel();
    return renderPlaceholderPanel();
  };

  if (!apiKey) {
    return (
      <div style={cardStyle}>
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
              handleApiKeyInputChange(event.target.value);
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
      {/* Main content section */}
      <div style={sectionStyle}>
        {/* Dropdown selectors for configuration */}
        <div style={pickerRowStyle}>
          {renderSelect("Language", language, setLanguage, languages)}
          {renderModelSelect("Model", model, setModel, models)}
          {renderSelect("Length", length, setLength, lengths)}
        </div>

        {/* Tab-like action buttons */}
        <div style={actionRowStyle}>
          <button
            style={
              activeView === "summary" || isSummaryLoading
                ? tabButtonActiveStyle
                : tabButtonStyle
            }
            onClick={handleSummaryClick}
            disabled={isSummaryLoading}
          >
            <span>✨</span>
            <span>{isSummaryLoading ? "…" : "Summary"}</span>
          </button>
          <button
            style={
              activeView === "transcript"
                ? tabButtonActiveStyle
                : tabButtonStyle
            }
            onClick={handleTranscriptClick}
            disabled={isTranscriptLoading}
          >
            <span>📄</span>
            <span>{isTranscriptLoading ? "…" : "Transcript"}</span>
          </button>
          <button
            style={
              activeView === "chat" ? tabButtonActiveStyle : tabButtonStyle
            }
            onClick={handleChatClick}
            disabled={isChatLoading && activeView !== "chat"}
          >
            <span>💬</span>
            <span>Chat</span>
          </button>
        </div>
      </div>
      {renderContentPanel()}
    </div>
  );
}
