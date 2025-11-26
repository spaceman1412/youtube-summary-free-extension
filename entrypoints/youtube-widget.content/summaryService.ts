/**
 * Service functions for generating video summaries
 */

import { GoogleGenAI } from "@google/genai";
import type { TranscriptSegment } from "./types";
import {
  GEMINI_MODEL_MAP,
  SUMMARY_STYLE_COPY,
} from "./constants";
import { reduceTranscript } from "./utils";
import { languages } from "./constants";

/**
 * Gets the Gemini model ID from the user-selected model
 */
export function getModelId(model: string): string {
  return GEMINI_MODEL_MAP[model] ?? GEMINI_MODEL_MAP["gpt-4o"];
}

/**
 * Gets the language label from the language value
 */
export function getLanguageLabel(language: string): string {
  return languages.find((entry) => entry.value === language)?.label ?? "English";
}

/**
 * Builds the prompt for summary generation
 */
export function buildSummaryPrompt(
  transcriptText: string,
  language: string,
  length: string
): string {
  const lengthInstruction =
    SUMMARY_STYLE_COPY[length] ?? SUMMARY_STYLE_COPY.medium;
  const languageLabel = getLanguageLabel(language);
  return [
    `You are summarizing a YouTube video transcript in ${languageLabel}.`,
    lengthInstruction,
    "Focus on the main narrative arc, important data points, and any explicit recommendations.",
    "Include timestamps at key points in the summary using the format mm:ss or hh:mm:ss (e.g., '5:23', '12:45', '1:23:45'). Place timestamps inline where they are most relevant to help readers navigate to specific moments in the video.",
    "Transcript:",
    `"""${transcriptText}"""`,
  ].join("\n\n");
}

/**
 * Generates a summary using Google Gemini AI
 */
export async function generateSummary(
  apiKey: string,
  transcript: TranscriptSegment[],
  model: string,
  language: string,
  length: string
): Promise<string> {
  if (!transcript.length) {
    throw new Error("Transcript is empty. Try fetching captions first.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildSummaryPrompt(reduceTranscript(transcript), language, length);
  const response = await ai.models.generateContent({
    model: getModelId(model),
    contents: prompt,
    config: {
      maxOutputTokens: length === "long" ? 1024 : 512,
      temperature: 0.7,
    },
  });

  const inlineText = response.text?.trim();
  const fallbackText =
    response.candidates?.[0]?.content?.parts
      ?.map((part) =>
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
          ? ((part as { text?: string }).text as string)
          : ""
      )
      .join(" ")
      .trim() ?? "";

  const finalSummary = inlineText || fallbackText;
  if (!finalSummary) {
    throw new Error("Gemini returned an empty response.");
  }

  return finalSummary;
}

/**
 * Builds a cache key for summary caching
 */
export function buildSummaryCacheKey(
  videoId: string,
  language: string,
  length: string,
  model: string
): string {
  return [videoId, language, length, model].join("|");
}

