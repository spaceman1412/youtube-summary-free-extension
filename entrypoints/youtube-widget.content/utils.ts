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
