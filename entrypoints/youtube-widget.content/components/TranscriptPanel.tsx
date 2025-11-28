import { useState } from "react";
import type { TranscriptSegment } from "../types";
import { styles } from "../styles";
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
    <div style={styles.transcript.section}>
      {isLoading && (
        <div style={styles.common.message}>Fetching transcript…</div>
      )}
      {!isLoading && error && <div style={styles.common.error}>{error}</div>}
      {!isLoading && !error && (
        <div style={styles.transcript.list}>
          {segments.map((segment, index) => (
            <div key={`${segment.offset}-${index}`} style={styles.transcript.item}>
              <span
                style={
                  hoveredTimestamp === segment.offset
                    ? styles.transcript.timestamp.hover
                    : styles.transcript.timestamp.base
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

