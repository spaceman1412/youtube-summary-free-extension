/**
 * React component for the YouTube Summary Widget.
 * Displays a UI card with options for language, model, and summary length,
 * along with action buttons for Summary, Transcript, and Chat features.
 */

import ReactMarkdown from "react-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ActiveView, ChatMessage, ModelOption } from "./types";
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
  floatingLauncherStyle,
  headerContainerStyle,
  headerIconButtonStyle,
  headerIconButtonGhostStyle,
} from "./styles";
import {
  formatTimestamp,
  extractCurrentVideoId,
  seekToTimestamp,
  parseTimestampsFromText,
} from "./utils";
import { generateChatResponse } from "./chatService";
import { useApiKey } from "./hooks/useApiKey";
import { usePreferences } from "./hooks/usePreferences";
import { useSummary } from "./hooks/useSummary";
import { useTranscript } from "./hooks/useTranscript";

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
  const {
    apiKey,
    apiKeyInput,
    apiKeyNotice,
    apiKeyValidationError,
    isValidatingApiKey,
    isEditingApiKey,
    showApiKeyGate,
    handleApiKeyInputChange,
    handleSaveApiKey,
    handleResetApiKey: resetStoredApiKey,
    handleToggleApiKeyEditor,
  } = useApiKey();

  const { language, setLanguage, model, setModel, length, setLength } =
    usePreferences();

  const {
    summary,
    summaryError,
    isSummaryLoading,
    requestSummary,
    clearSummary,
    setSummaryErrorMessage,
  } = useSummary();

  const {
    transcriptSegments,
    transcriptLocale,
    isTranscriptLoading,
    transcriptError,
    loadTranscript,
    ensureTranscript,
    clearTranscript,
    setTranscriptErrorMessage,
  } = useTranscript();

  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredHeaderButton, setHoveredHeaderButton] = useState<
    "edit" | "minimize" | null
  >(null);
  const [hoveredAction, setHoveredAction] = useState<
    "summary" | "transcript" | "chat" | null
  >(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const currentVideoIdRef = useRef<string | undefined>(undefined);
  const previousMessageCountRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);

  const handleResetApiKey = useCallback(() => {
    resetStoredApiKey();
    clearSummary();
    clearTranscript();
    setChatMessages([]);
    setChatInput("");
    setChatError(null);
    setActiveView(null);
  }, [
    resetStoredApiKey,
    clearSummary,
    clearTranscript,
    setChatMessages,
    setChatInput,
    setChatError,
  ]);

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

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  const transcriptMatchesLanguage =
    transcriptSegments.length > 0 && transcriptLocale === language;

  const ensureTranscriptForChat = useCallback(async () => {
    try {
      return await ensureTranscript(language);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch transcript. Please try again.";
      setChatError(message);
      throw error;
    }
  }, [ensureTranscript, language, setChatError]);

  const handleTranscriptClick = async () => {
    if (isTranscriptLoading) return;
    if (!apiKey) {
      setTranscriptErrorMessage(
        "Please add your Google AI Studio API key to continue."
      );
      return;
    }

    setActiveView("transcript");
    setTranscriptErrorMessage(null);

    if (transcriptMatchesLanguage) {
      return;
    }

    try {
      await loadTranscript(language);
    } catch {
      // Errors handled inside useTranscript
    }
  };

  const handleSummaryClick = async () => {
    if (isSummaryLoading) return;
    if (!apiKey) {
      setSummaryErrorMessage(
        "Please add your Google AI Studio API key to continue."
      );
      return;
    }

    setActiveView("summary");
    await requestSummary({
      apiKey,
      language,
      length,
      model,
      ensureTranscript: () => ensureTranscript(language),
    });
  };

  const handleChatClick = async () => {
    if (!apiKey) {
      setChatError("Please add your Google AI Studio API key to continue.");
      return;
    }

    setActiveView("chat");
    setChatError(null);

    if (transcriptMatchesLanguage) {
      return;
    }

    setIsChatLoading(true);
    try {
      await ensureTranscriptForChat();
    } catch {
      // Error already surfaced via setChatError
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput || isChatLoading) return;
    if (!apiKey) {
      setChatError("Please add your Google AI Studio API key to continue.");
      return;
    }

    let transcript = transcriptSegments;
    if (!transcriptMatchesLanguage) {
      setIsChatLoading(true);
      try {
        transcript = await ensureTranscriptForChat();
      } catch {
        setIsChatLoading(false);
        return;
      } finally {
        // ensure the spinner stops even if ensureTranscriptForChat resolves
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

  const renderSummaryPanel = () => {
    let textNodeIndex = 0;

    return (
      <div style={summarySectionStyle}>
        {isSummaryLoading && (
          <div style={transcriptMessageStyle}>Generating summary…</div>
        )}
        {!isSummaryLoading && summaryError && (
          <div style={transcriptErrorStyle}>{summaryError}</div>
        )}
        {!isSummaryLoading && !summaryError && summary && (
          <div style={summaryTextStyle}>
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p
                    style={{
                      margin: 0,
                      marginBottom: "8px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {children}
                  </p>
                ),
                text: ({ children }) => {
                  const textContent =
                    typeof children === "string"
                      ? children
                      : Array.isArray(children)
                      ? children.join("")
                      : "";
                  const currentIndex = textNodeIndex++;
                  return (
                    <>{renderTextWithTimestamps(textContent, currentIndex)}</>
                  );
                },
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

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
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <span style={{ whiteSpace: "pre-wrap" }}>{children}</span>
                  ),
                }}
              >
                {segment.text || "…"}
              </ReactMarkdown>
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
            {message.role === "assistant" ? (
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p style={{ margin: 0, marginBottom: "8px" }}>{children}</p>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              message.content
            )}
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

  const renderHeader = () => {
    const isEditButtonDisabled = !apiKey && !isEditingApiKey;
    const editButtonBaseStyle =
      isEditingApiKey || showApiKeyGate
        ? headerIconButtonStyle
        : headerIconButtonGhostStyle;
    const editIcon = isEditingApiKey ? "✕" : "🔑";
    const isEditHovered = hoveredHeaderButton === "edit";
    const editButtonStyle = {
      ...editButtonBaseStyle,
      opacity: isEditHovered ? 1 : 0.7,
      transform: isEditHovered ? "scale(1.05)" : "scale(1)",
    };
    const isMinimizeHovered = hoveredHeaderButton === "minimize";
    const minimizeButtonStyle = {
      ...headerIconButtonStyle,
      opacity: isMinimizeHovered ? 1 : 0.7,
      transform: isMinimizeHovered ? "scale(1.05)" : "scale(1)",
    };

    return (
      <div style={headerContainerStyle}>
        <button
          type="button"
          style={editButtonStyle}
          onClick={handleToggleApiKeyEditor}
          disabled={isEditButtonDisabled}
          aria-pressed={isEditingApiKey}
          aria-label={isEditingApiKey ? "Close API key editor" : "Edit API key"}
          title={isEditingApiKey ? "Close API key editor" : "Edit API key"}
          onMouseEnter={() => setHoveredHeaderButton("edit")}
          onMouseLeave={() => setHoveredHeaderButton(null)}
        >
          <span aria-hidden="true">{editIcon}</span>
        </button>
        <button
          type="button"
          style={minimizeButtonStyle}
          onClick={handleMinimize}
          aria-label="Minimize widget"
          title="Minimize widget"
          onMouseEnter={() => setHoveredHeaderButton("minimize")}
          onMouseLeave={() => setHoveredHeaderButton(null)}
        >
          <span aria-hidden="true">−</span>
        </button>
      </div>
    );
  };

  const renderApiKeyGate = () => (
    <div style={sectionStyle}>
      <div style={onboardingTitleStyle}>Connect Google AI Studio</div>
      <div style={onboardingDescriptionStyle}>
        You need a Google AI Studio API key to generate summaries. Getting one
        is free and only takes a minute.
      </div>
      <input
        style={apiKeyInputStyle}
        placeholder="Paste your API key"
        type="password"
        value={apiKeyInput}
        onChange={(event) => {
          handleApiKeyInputChange(event.target.value);
        }}
        disabled={isValidatingApiKey}
      />
      <div style={gateActionsStyle}>
        <button
          style={primaryButtonStyle}
          onClick={handleSaveApiKey}
          disabled={isValidatingApiKey}
        >
          {isValidatingApiKey ? "Testing…" : "Save API key"}
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
      {apiKeyValidationError && (
        <div style={transcriptErrorStyle}>{apiKeyValidationError}</div>
      )}
      <div style={helperTextStyle}>
        Stored securely in this browser only (localStorage).
      </div>
      {apiKey && (
        <button
          type="button"
          style={{ ...linkButtonStyle, background: "transparent" }}
          onClick={handleResetApiKey}
        >
          Remove saved key
        </button>
      )}
    </div>
  );

  if (isMinimized) {
    return (
      <button
        type="button"
        style={floatingLauncherStyle}
        onClick={handleRestore}
        aria-label="Open YouTube Summary widget"
      >
        ✨ Summary
      </button>
    );
  }

  return (
    <div style={cardStyle}>
      {renderHeader()}
      {showApiKeyGate ? (
        renderApiKeyGate()
      ) : (
        <>
          <div style={sectionStyle}>
            <div style={pickerRowStyle}>
              {renderSelect("Language", language, setLanguage, languages)}
              {renderModelSelect("Model", model, setModel, models)}
              {renderSelect("Length", length, setLength, lengths)}
            </div>
            <div style={actionRowStyle}>
              <button
                style={{
                  ...((activeView === "summary" || isSummaryLoading
                    ? tabButtonActiveStyle
                    : tabButtonStyle) as typeof tabButtonStyle),
                  opacity:
                    hoveredAction === "summary" && !isSummaryLoading ? 1 : 0.85,
                  transform:
                    hoveredAction === "summary" && !isSummaryLoading
                      ? "translateY(-1px)"
                      : "translateY(0)",
                }}
                onClick={handleSummaryClick}
                disabled={isSummaryLoading}
                onMouseEnter={() => setHoveredAction("summary")}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <span>✨</span>
                <span>{isSummaryLoading ? "…" : "Summary"}</span>
              </button>
              <button
                style={{
                  ...((activeView === "transcript"
                    ? tabButtonActiveStyle
                    : tabButtonStyle) as typeof tabButtonStyle),
                  opacity:
                    hoveredAction === "transcript" && !isTranscriptLoading
                      ? 1
                      : 0.85,
                  transform:
                    hoveredAction === "transcript" && !isTranscriptLoading
                      ? "translateY(-1px)"
                      : "translateY(0)",
                }}
                onClick={handleTranscriptClick}
                disabled={isTranscriptLoading}
                onMouseEnter={() => setHoveredAction("transcript")}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <span>📄</span>
                <span>{isTranscriptLoading ? "…" : "Transcript"}</span>
              </button>
              <button
                style={{
                  ...((activeView === "chat"
                    ? tabButtonActiveStyle
                    : tabButtonStyle) as typeof tabButtonStyle),
                  opacity:
                    hoveredAction === "chat" &&
                    !(isChatLoading && activeView !== "chat")
                      ? 1
                      : 0.85,
                  transform:
                    hoveredAction === "chat" &&
                    !(isChatLoading && activeView !== "chat")
                      ? "translateY(-1px)"
                      : "translateY(0)",
                }}
                onClick={handleChatClick}
                disabled={isChatLoading && activeView !== "chat"}
                onMouseEnter={() => setHoveredAction("chat")}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <span>💬</span>
                <span>Chat</span>
              </button>
            </div>
          </div>
          {renderContentPanel()}
        </>
      )}
    </div>
  );
}
