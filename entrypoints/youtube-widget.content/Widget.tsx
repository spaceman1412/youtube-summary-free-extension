/**
 * React component for the YouTube Summary Widget.
 * Displays a UI card with options for language, model, and summary length,
 * along with action buttons for Summary, Transcript, and Chat features.
 */

import ReactMarkdown from "react-markdown";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ActiveView, ChatMessage, ModelOption } from "./types";
import { languages, models, lengths, GOOGLE_API_KEY_URL } from "./constants";
import { styles } from "./styles";
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
  <label style={styles.picker.label.small}>
    {label}
    <select
      style={styles.picker.select}
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
    <div style={styles.picker.label.large}>
      <span>{label}</span>
      <div style={styles.customSelect.container} ref={containerRef}>
        <button
          type="button"
          style={styles.customSelect.button}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {selectedOption?.label || "Select model"}
        </button>
        {isOpen && (
          <div style={styles.customSelect.dropdown}>
            {options.map((option) => {
              const isSelected = option.value === value;
              const isHovered = hoveredOption === option.value;
              return (
                <div
                  key={option.value}
                  style={{
                    ...styles.customSelect.option.base,
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
                  <div style={styles.customSelect.option.label}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div style={styles.customSelect.option.description}>
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
  const [isCopied, setIsCopied] = useState(false);

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
              ? styles.transcript.timestamp.hover
              : styles.transcript.timestamp.base
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
    const renderContentWithTimestamps = (
      nodeChildren: ReactNode
    ): ReactNode => {
      return Children.map(nodeChildren, (child) => {
        if (child === null || child === undefined) {
          return child;
        }
        if (typeof child === "string" || typeof child === "number") {
          const currentIndex = textNodeIndex++;
          return renderTextWithTimestamps(String(child), currentIndex);
        }
        if (
          isValidElement<{ children?: ReactNode }>(child) &&
          child.props.children
        ) {
          return cloneElement(child, {
            ...child.props,
            children: renderContentWithTimestamps(child.props.children),
          });
        }
        return child;
      });
    };

    return (
      <div style={styles.summary.section}>
        {isSummaryLoading && (
          <div style={styles.common.message}>Generating summary…</div>
        )}
        {!isSummaryLoading && summaryError && (
          <div style={styles.common.error}>{summaryError}</div>
        )}
        {!isSummaryLoading && !summaryError && summary && (
          <div style={styles.summary.text}>
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
                    {renderContentWithTimestamps(children)}
                  </p>
                ),
                li: ({ children }) => (
                  <li>{renderContentWithTimestamps(children)}</li>
                ),
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  const handleCopyTranscript = async () => {
    if (transcriptSegments.length === 0) return;

    try {
      // Format transcript with timestamps
      const formattedText = transcriptSegments
        .map((segment) => {
          const timestamp = formatTimestamp(segment.offset);
          const text = segment.text || "";
          return `[${timestamp}] ${text}`;
        })
        .join("\n");

      await navigator.clipboard.writeText(formattedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy transcript:", error);
    }
  };

  const renderTranscriptPanel = () => (
    <div style={styles.transcript.section}>
      {isTranscriptLoading && (
        <div style={styles.common.message}>Fetching transcript…</div>
      )}
      {!isTranscriptLoading && transcriptError && (
        <div style={styles.common.error}>{transcriptError}</div>
      )}
      {!isTranscriptLoading &&
        !transcriptError &&
        transcriptSegments.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "8px",
            }}
          >
            <button
              type="button"
              onClick={handleCopyTranscript}
              style={{
                ...styles.button.secondary,
                padding: "6px 12px",
                fontSize: "10px",
                flex: "none",
                opacity: isCopied ? 0.7 : 1,
              }}
              disabled={isCopied}
            >
              {isCopied ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        )}
      {!isTranscriptLoading && !transcriptError && (
        <div style={styles.transcript.list}>
          {transcriptSegments.map((segment, index) => (
            <div
              key={`${segment.offset}-${index}`}
              style={styles.transcript.item}
            >
              <span
                style={
                  hoveredTimestamp === segment.offset
                    ? styles.transcript.timestamp.hover
                    : styles.transcript.timestamp.base
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
              <span style={{ whiteSpace: "pre-wrap" }}>
                {segment.text || "…"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaceholderPanel = () => null;

  const renderChatPanel = () => (
    <div style={styles.chat.section}>
      <div
        ref={chatMessagesContainerRef}
        style={styles.chat.messages}
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
                ? styles.chat.message.user
                : styles.chat.message.assistant
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
        {isChatLoading && <div style={styles.common.message}>Thinking…</div>}
        {chatError && <div style={styles.common.error}>{chatError}</div>}
        <div ref={chatMessagesEndRef} />
      </div>
      <div style={styles.chat.input.container}>
        <input
          style={styles.chat.input.field}
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
            ...styles.chat.sendButton,
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
        ? styles.header.iconButton
        : styles.header.iconButtonGhost;
    const editIcon = isEditingApiKey ? "✕" : "🔑";
    const isEditHovered = hoveredHeaderButton === "edit";
    const editButtonStyle = {
      ...editButtonBaseStyle,
      opacity: isEditHovered ? 1 : 0.7,
      transform: isEditHovered ? "scale(1.05)" : "scale(1)",
    };
    const isMinimizeHovered = hoveredHeaderButton === "minimize";
    const minimizeButtonStyle = {
      ...styles.header.iconButton,
      opacity: isMinimizeHovered ? 1 : 0.7,
      transform: isMinimizeHovered ? "scale(1.05)" : "scale(1)",
    };

    return (
      <div style={styles.header.container}>
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
    <div style={styles.layout.section}>
      <div style={styles.onboarding.title}>Connect Google AI Studio</div>
      <div style={styles.onboarding.description}>
        You need a Google AI Studio API key to generate summaries. Getting one
        is free and only takes a minute.
      </div>
      <input
        style={styles.onboarding.input}
        placeholder="Paste your API key"
        type="password"
        value={apiKeyInput}
        onChange={(event) => {
          handleApiKeyInputChange(event.target.value);
        }}
        disabled={isValidatingApiKey}
      />
      <div style={styles.onboarding.actions}>
        <button
          style={styles.button.primary}
          onClick={handleSaveApiKey}
          disabled={isValidatingApiKey}
        >
          {isValidatingApiKey ? "Testing…" : "Save API key"}
        </button>
        <a
          href={GOOGLE_API_KEY_URL}
          style={styles.button.link}
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
              ? styles.common.error
              : styles.common.message
          }
        >
          {apiKeyNotice}
        </div>
      )}
      {apiKeyValidationError && (
        <div style={styles.common.error}>{apiKeyValidationError}</div>
      )}
      <div style={styles.onboarding.helperText}>
        Stored securely in this browser only (localStorage).
      </div>
      {apiKey && (
        <button
          type="button"
          style={{ ...styles.button.link, background: "transparent" }}
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
        style={styles.floating.launcher}
        onClick={handleRestore}
        aria-label="Open YouTube Summary widget"
      >
        ✨ Summary
      </button>
    );
  }

  return (
    <div style={styles.layout.card}>
      {renderHeader()}
      {showApiKeyGate ? (
        renderApiKeyGate()
      ) : (
        <>
          <div style={styles.layout.section}>
            <div style={styles.picker.row}>
              {renderSelect("Language", language, setLanguage, languages)}
              {renderModelSelect("Model", model, setModel, models)}
              {renderSelect("Length", length, setLength, lengths)}
            </div>
            <div style={styles.tabs.row}>
              <button
                style={{
                  ...((activeView === "summary" || isSummaryLoading
                    ? styles.tabs.buttonActive
                    : styles.tabs.button) as typeof styles.tabs.button),
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
                    ? styles.tabs.buttonActive
                    : styles.tabs.button) as typeof styles.tabs.button),
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
                    ? styles.tabs.buttonActive
                    : styles.tabs.button) as typeof styles.tabs.button),
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
