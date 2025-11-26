import type { ActiveView } from "../types";
import { tabButtonActiveStyle, tabButtonStyle, actionRowStyle } from "../styles";

type ActionButtonsProps = {
  activeView: ActiveView;
  isSummaryLoading: boolean;
  isTranscriptLoading: boolean;
  isChatLoading: boolean;
  onSummaryClick: () => void;
  onTranscriptClick: () => void;
  onChatClick: () => void;
};

export function ActionButtons({
  activeView,
  isSummaryLoading,
  isTranscriptLoading,
  isChatLoading,
  onSummaryClick,
  onTranscriptClick,
  onChatClick,
}: ActionButtonsProps) {
  const getTabStyle = (view: ActiveView, isDisabled: boolean) => ({
    ...((activeView === view ? tabButtonActiveStyle : tabButtonStyle) as typeof tabButtonStyle),
    opacity: isDisabled ? 0.5 : 0.85,
  });

  return (
    <div style={actionRowStyle}>
      <button
        style={getTabStyle("summary", isSummaryLoading)}
        onClick={onSummaryClick}
        disabled={isSummaryLoading}
      >
        <span>✨</span>
        <span>{isSummaryLoading ? "…" : "Summary"}</span>
      </button>
      <button
        style={getTabStyle("transcript", isTranscriptLoading)}
        onClick={onTranscriptClick}
        disabled={isTranscriptLoading}
      >
        <span>📄</span>
        <span>{isTranscriptLoading ? "…" : "Transcript"}</span>
      </button>
      <button
        style={getTabStyle("chat", isChatLoading && activeView !== "chat")}
        onClick={onChatClick}
        disabled={isChatLoading && activeView !== "chat"}
      >
        <span>💬</span>
        <span>Chat</span>
      </button>
    </div>
  );
}

