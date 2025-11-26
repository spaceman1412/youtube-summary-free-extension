import { useState } from "react";
import type { TranscriptSegment } from "../types";
import {
  transcriptErrorStyle,
  transcriptItemStyle,
  transcriptListStyle,
  transcriptMessageStyle,
  transcriptSectionStyle,
  transcriptTimestampHoverStyle,
  transcriptTimestampStyle,
} from "../styles";
import { formatTimestamp, seekToTimestamp } from "../utils";

type TranscriptPanelProps = {
  segments: TranscriptSegment[];
  isLoading: boolean;
  error: string | null;
};

export function TranscriptPanel({
  segments,
  isLoading,
  error,
}: TranscriptPanelProps) {
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);

  return (
    <div style={transcriptSectionStyle}>
      {isLoading && (
        <div style={transcriptMessageStyle}>Fetching transcript…</div>
      )}
      {!isLoading && error && <div style={transcriptErrorStyle}>{error}</div>}
      {!isLoading && !error && (
        <div style={transcriptListStyle}>
          {segments.map((segment, index) => (
            <div key={`${segment.offset}-${index}`} style={transcriptItemStyle}>
              <span
                style={
                  hoveredTimestamp === segment.offset
                    ? transcriptTimestampHoverStyle
                    : transcriptTimestampStyle
                }
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  seekToTimestamp(segment.offset);
                }}
                onMouseEnter={() => setHoveredTimestamp(segment.offset)}
                onMouseLeave={() => setHoveredTimestamp(null)}
                role="button"
                tabIndex={0}
                aria-label={`Seek to ${formatTimestamp(segment.offset)}`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
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
}

