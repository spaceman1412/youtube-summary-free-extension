/**
 * React component for the YouTube Summary Widget.
 * Displays a UI card with options for language, model, and summary length,
 * along with action buttons for Summary, Transcript, and Chat features.
 */

import { useEffect, useState, useRef } from "react";
import type { TranscriptSegment, ActiveView, ChatMessage } from "./types";
import { languages, models, lengths, GOOGLE_API_KEY_URL } from "./constants";
import {
  cardStyle,
  sectionStyle,
  pickerRowStyle,
  inputLabelStyle,
  selectStyle,
  actionRowStyle,
  headerStyle,
  brandStyle,
  brandIconStyle,
  headerActionsStyle,
  transcriptSectionStyle,
  summarySectionStyle,
  summaryTextStyle,
  transcriptListStyle,
  transcriptItemStyle,
  transcriptTimestampStyle,
  transcriptMessageStyle,
  transcriptErrorStyle,
  iconButtonStyle,
  secondaryButtonStyle,
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
} from "./styles";
import { formatTimestamp, extractCurrentVideoId } from "./utils";
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const currentVideoIdRef = useRef<string | undefined>(undefined);
  const previousMessageCountRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);

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
        {chatMessages.length === 0 && !isChatLoading && !chatError && (
          <div style={transcriptMessageStyle}>
            Ask questions about this video. The transcript will be used as
            context.
          </div>
        )}
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
          <button
            style={{
              ...secondaryButtonStyle,
              opacity: isChatLoading ? 0.7 : 1,
            }}
            onClick={handleChatClick}
            disabled={isChatLoading}
          >
            <span>💬</span>
            <span>{isChatLoading ? "Loading…" : "Chat"}</span>
          </button>
        </div>
      </div>
      {renderContentPanel()}
    </div>
  );
}
