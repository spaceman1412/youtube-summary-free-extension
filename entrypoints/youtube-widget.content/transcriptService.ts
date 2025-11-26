/**
 * Service functions for handling YouTube transcript operations
 */

import { fetchTranscript } from "youtube-transcript-plus";
import type { TranscriptSegment } from "./types";
import { extractCurrentVideoId } from "./utils";

/**
 * Fetches transcript for the current video
 */
export async function fetchTranscriptForVideo(
  language: string
): Promise<TranscriptSegment[]> {
  const videoId = extractCurrentVideoId();
  if (!videoId) {
    throw new Error("Unable to detect the current video.");
  }
  return fetchTranscript(videoId, { lang: language });
}

