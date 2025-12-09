/**
 * Utility functions for the YouTube Summary Widget
 */

import type { TranscriptSegment } from "./types";

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
 * Formats transcript timestamps into mm:ss, or hh:mm:ss when 1 hour or longer.
 */
export const formatTimestamp = (offset: number): string => {
  const totalSeconds = Math.floor(offset);
  const secondsPerMinute = 60;
  const secondsPerHour = 3600;

  if (totalSeconds >= secondsPerHour) {
    const hours = Math.floor(totalSeconds / secondsPerHour)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor(
      (totalSeconds % secondsPerHour) / secondsPerMinute
    )
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % secondsPerMinute)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const minutes = Math.floor(totalSeconds / secondsPerMinute)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % secondsPerMinute).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/**
 * Reduces transcript segments to fit within character limit
 */
export const reduceTranscript = (segments: TranscriptSegment[]): string => {
  const combined = segments
    .map((segment) => {
      const text = segment.text ?? "";
      const timestamp = formatTimestamp(segment.offset);
      return `[${timestamp}] ${text}`;
    })
    .join(" ");
  return combined;
};

/**
 * Seeks the YouTube video player to a specific timestamp.
 * Tries multiple methods to find and control the video player.
 */
export const seekToTimestamp = (offset: number): void => {
  try {
    // Method 1: Try YouTube's internal player API (if available)
    // YouTube stores player instances in various places depending on the page structure
    const ytPlayer = (window as any).ytplayer;
    if (ytPlayer && ytPlayer.getPlayerByElement) {
      const playerElements = document.querySelectorAll("video");
      for (const videoEl of playerElements) {
        try {
          const player = ytPlayer.getPlayerByElement(videoEl);
          if (player && typeof player.seekTo === "function") {
            player.seekTo(offset, true);
            return;
          }
        } catch {
          // Continue to next method
        }
      }
    }

    // Method 2: Try accessing YouTube's global player state
    const ytInitialPlayerResponse = (window as any).ytInitialPlayerResponse;
    if (ytInitialPlayerResponse) {
      // Try to find the player through YouTube's internal structure
      const playerContainer = document.querySelector("#movie_player");
      if (playerContainer) {
        const player = (playerContainer as any).getVideoData?.();
        if (player && typeof (playerContainer as any).seekTo === "function") {
          (playerContainer as any).seekTo(offset, true);
          return;
        }
      }
    }

    // Method 3: Direct HTML5 video element manipulation (fallback)
    const videoElement = document.querySelector("video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = offset;
      return;
    }

    // Method 4: Try to dispatch a custom event that YouTube might listen to
    // Some YouTube extensions use this pattern
    const seekEvent = new CustomEvent("seekTo", { detail: { time: offset } });
    document.dispatchEvent(seekEvent);

    // If all methods fail, log a warning (but don't throw to avoid breaking the UI)
    console.warn("Could not find YouTube player to seek to timestamp:", offset);
  } catch (error) {
    console.error("Error seeking to timestamp:", error);
  }
};

/**
 * Parses a timestamp string (e.g., "5:23", "12:45", "1:23:45") and converts it to seconds.
 * Supports formats: mm:ss, m:ss, hh:mm:ss, h:mm:ss
 */
export const parseTimestampToSeconds = (timestamp: string): number | null => {
  const trimmed = timestamp.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":").map((part) => Number(part));
  if (parts.some((value) => Number.isNaN(value))) return null;

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (minutes < 0 || seconds < 0 || seconds >= 60) return null;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (
      hours < 0 ||
      minutes < 0 ||
      minutes >= 60 ||
      seconds < 0 ||
      seconds >= 60
    ) {
      return null;
    }
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
};

/**
 * Finds all timestamp patterns in text and returns their positions and converted offsets.
 * Returns an array of objects with timestamp string, offset in seconds, and index in text.
 */
export const parseTimestampsFromText = (
  text: string
): Array<{ timestamp: string; offset: number; index: number }> => {
  const results: Array<{ timestamp: string; offset: number; index: number }> =
    [];

  // Regex to match timestamps in various formats
  // Matches: h:mm:ss, hh:mm:ss, m:ss, mm:ss with 1–2 digit seconds
  // Lookbehind and lookahead to ensure we're not matching part of a larger number
  const timestampRegex = /(?<!\d)(\d{1,2}:\d{1,2}(?::\d{1,2})?)(?!\d)/g;

  let match;
  while ((match = timestampRegex.exec(text)) !== null) {
    const timestamp = match[1];
    const offset = parseTimestampToSeconds(timestamp);
    if (offset !== null) {
      results.push({
        timestamp,
        offset,
        index: match.index,
      });
    }
  }

  return results;
};
