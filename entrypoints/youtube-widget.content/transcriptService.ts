/**
 * Service functions for handling YouTube transcript operations
 */

import { fetchTranscript } from "youtube-transcript-plus";
import type { TranscriptSegment } from "./types";
import { extractCurrentVideoId } from "./utils";
import { decode } from "html-entities";

/**
 * Fetches transcript for the current video
 * Tries the user-selected language first, then falls back to the video's default transcript
 */
export async function fetchTranscriptForVideo(
  language: string
): Promise<TranscriptSegment[]> {
  const videoId = extractCurrentVideoId();
  if (!videoId) {
    throw new Error("Unable to detect the current video.");
  }

  try {
    // Try fetching transcript with the user-selected language first
    const transcript = await fetchTranscript(videoId, { lang: language });

    // If we got a non-empty transcript, return it
    if (transcript && transcript.length > 0) {
      // Youtube transcript have changed to encoded with HTML entities, so we need to decode it
      const decodedTranscript = transcript.map((segment) => ({
        ...segment,
        text: decode(decode(segment.text.trim())).trim(),
      }));

      return decodedTranscript;
    }
  } catch (error) {
    // If language-specific transcript fails, we'll try the default below
    // Don't throw yet - try the fallback first
  }

  // Fallback: try fetching the video's default/original transcript
  try {
    const defaultTranscript = await fetchTranscript(videoId);

    // If we got a non-empty transcript, return it
    if (defaultTranscript && defaultTranscript.length > 0) {
      return defaultTranscript;
    }
  } catch (error) {
    // If default transcript also fails, throw with a clear message
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch transcript. Please try again."
    );
  }

  // If both attempts returned empty transcripts, throw
  throw new Error("Transcript was empty for this video.");
}
