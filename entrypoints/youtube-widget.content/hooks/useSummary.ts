import { useCallback, useState } from "react";
import type { TranscriptSegment } from "../types";
import { buildSummaryCacheKey, generateSummary } from "../summaryService";
import { extractCurrentVideoId } from "../utils";

type EnsureTranscriptFn = () => Promise<TranscriptSegment[]>;

type SummaryRequest = {
  apiKey: string;
  language: string;
  length: string;
  model: string;
  ensureTranscript: EnsureTranscriptFn;
};

export function useSummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryCache, setSummaryCache] = useState<Record<string, string>>({});

  const clearSummary = useCallback(() => {
    setSummary(null);
    setError(null);
    setIsLoading(false);
    setSummaryCache({});
  }, []);

  const requestSummary = useCallback(
    async ({
      apiKey,
      language,
      length,
      model,
      ensureTranscript,
    }: SummaryRequest) => {
      const videoId = extractCurrentVideoId();
      if (!videoId) {
        setSummary(null);
        setError("Unable to detect the current video.");
        return;
      }

      const cacheKey = buildSummaryCacheKey(videoId, language, length, model);
      if (summaryCache[cacheKey]) {
        setSummary(summaryCache[cacheKey]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const transcript = await ensureTranscript();
        const finalSummary = await generateSummary(
          apiKey,
          transcript,
          model,
          language,
          length
        );
        setSummary(finalSummary);
        setSummaryCache((previous) => ({
          ...previous,
          [cacheKey]: finalSummary,
        }));
      } catch (error) {
        setSummary(null);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate summary. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [summaryCache]
  );

  const setSummaryErrorMessage = useCallback((message: string | null) => {
    setSummary(null);
    setError(message);
  }, []);

  return {
    summary,
    summaryError: error,
    isSummaryLoading: isLoading,
    requestSummary,
    clearSummary,
    setSummaryErrorMessage,
  };
}
