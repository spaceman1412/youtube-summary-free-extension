import { useMemo, useState } from "react";
import { styles } from "../styles";
import { formatTimestamp, parseTimestampsFromText, seekToTimestamp } from "../utils";

type SummaryPanelProps = {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
};

const renderTextWithTimestamps = (
  text: string,
  hoveredTimestamp: number | null,
  setHoveredTimestamp: (value: number | null) => void
) => {
  const timestamps = parseTimestampsFromText(text);
  if (timestamps.length === 0) {
    return <span>{text}</span>;
  }

  const sortedTimestamps = [...timestamps].sort((a, b) => a.index - b.index);
  const elements: JSX.Element[] = [];
  let lastIndex = 0;

  sortedTimestamps.forEach((timestamp, index) => {
    if (timestamp.index > lastIndex) {
      elements.push(
        <span key={`text-${index}`}>
          {text.substring(lastIndex, timestamp.index)}
        </span>
      );
    }

    const timestampOffset = timestamp.offset;
    elements.push(
      <span
        key={`timestamp-${index}`}
        style={
          hoveredTimestamp === timestampOffset
            ? styles.transcript.timestamp.hover
            : styles.transcript.timestamp.base
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          seekToTimestamp(timestampOffset);
        }}
        onMouseEnter={() => setHoveredTimestamp(timestampOffset)}
        onMouseLeave={() => setHoveredTimestamp(null)}
        role="button"
        tabIndex={0}
        aria-label={`Seek to ${formatTimestamp(timestampOffset)}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            seekToTimestamp(timestampOffset);
          }
        }}
      >
        {timestamp.timestamp}
      </span>
    );

    lastIndex = timestamp.index + timestamp.timestamp.length;
  });

  if (lastIndex < text.length) {
    elements.push(
      <span key="summary-text-end">{text.substring(lastIndex)}</span>
    );
  }

  return <>{elements}</>;
};

export function SummaryPanel({ summary, isLoading, error }: SummaryPanelProps) {
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);

  const summaryLines = useMemo(() => {
    if (!summary) {
      return [];
    }
    return summary
      .split("\n")
      .filter((line) => line.trim().length > 0);
  }, [summary]);

  return (
    <div style={styles.summary.section}>
      {isLoading && (
        <div style={styles.common.message}>Generating summary…</div>
      )}
      {!isLoading && error && <div style={styles.common.error}>{error}</div>}
      {!isLoading && !error && summaryLines.length > 0 && (
        <div style={styles.summary.text}>
          {summaryLines.map((line, index) => (
            <p
              key={`${line}-${index}`}
              style={{
                margin: 0,
                marginBottom: "8px",
                whiteSpace: "pre-wrap",
              }}
            >
              {renderTextWithTimestamps(
                line,
                hoveredTimestamp,
                setHoveredTimestamp
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

