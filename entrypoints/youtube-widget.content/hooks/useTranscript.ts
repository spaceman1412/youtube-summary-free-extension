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
        // fetchTranscriptForVideo now handles fallback internally:
        // tries language-specific first, then falls back to default transcript
        const transcript = await fetchTranscriptForVideo(language);

        // Validate that we got a non-empty transcript
        if (!transcript || transcript.length === 0) {
          const message = "Transcript was empty for this video.";
          setTranscriptErrorMessage(message);
          throw new Error(message);
        }

        // Set segments and locale (locale is set to requested language,
        // even if the actual transcript content is from the default language)
        setSegments(transcript);
        setLocale(language);

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
