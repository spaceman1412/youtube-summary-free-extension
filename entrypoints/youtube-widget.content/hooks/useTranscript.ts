import { useCallback, useState } from "react";
import type { TranscriptSegment } from "../types";
import { fetchTranscriptForVideo } from "../transcriptService";
import { extractCurrentVideoId } from "../utils";

export function useTranscript() {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [locale, setLocale] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setTranscriptErrorMessage = useCallback((message: string | null) => {
    setError(message);
    if (message) {
      setSegments([]);
      setLocale(null);
    }
  }, []);

  const fetchTranscript = useCallback(
    async (language: string): Promise<TranscriptSegment[]> => {
      const videoId = extractCurrentVideoId();
      if (!videoId) {
        const message = "Unable to detect the current video.";
        setTranscriptErrorMessage(message);
        throw new Error(message);
      }

      setIsLoading(true);
      setTranscriptErrorMessage(null);

      try {
        const transcript = await fetchTranscriptForVideo(language);
        setSegments(transcript);
        setLocale(language);

        if (!transcript.length) {
          const message = "Transcript was empty for this video.";
          setTranscriptErrorMessage(message);
          throw new Error(message);
        }

        return transcript;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch transcript. Please try again.";
        setTranscriptErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [setTranscriptErrorMessage]
  );

  const ensureTranscript = useCallback(
    (language: string) => {
      if (segments.length > 0 && locale === language) {
        return Promise.resolve(segments);
      }
      return fetchTranscript(language);
    },
    [segments, locale, fetchTranscript]
  );

  const clearTranscript = useCallback(() => {
    setSegments([]);
    setLocale(null);
    setTranscriptErrorMessage(null);
    setIsLoading(false);
  }, [setTranscriptErrorMessage]);

  return {
    transcriptSegments: segments,
    transcriptLocale: locale,
    isTranscriptLoading: isLoading,
    transcriptError: error,
    loadTranscript: fetchTranscript,
    ensureTranscript,
    clearTranscript,
    setTranscriptErrorMessage,
  };
}
