/**
 * Utility functions for the YouTube Summary Widget
 */

import type { TranscriptSegment } from "./types";
import { MAX_TRANSCRIPT_CHARACTERS } from "./constants";

/**
 * Extracts a video ID from the current URL.
 * Handles both standard watch URLs and youtu.be short links.
 */
export const extractCurrentVideoId = (): string | undefined => {
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
export const formatTimestamp = (offset: number): string => {
  const totalSeconds = Math.floor(offset);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/**
 * Reduces transcript segments to fit within character limit
 */
export const reduceTranscript = (segments: TranscriptSegment[]): string => {
  const combined = segments.map((segment) => segment.text ?? "").join(" ");
  if (combined.length <= MAX_TRANSCRIPT_CHARACTERS) return combined;
  return combined.slice(-MAX_TRANSCRIPT_CHARACTERS);
};
