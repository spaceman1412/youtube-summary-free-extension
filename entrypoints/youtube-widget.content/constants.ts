/**
 * Configuration constants for the YouTube Summary Widget
 */

import type { LanguageOption, ModelOption, LengthOption } from "./types";

/**
 * Available languages for summary generation
 */
export const languages: LanguageOption[] = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "日本語", value: "jp" },
];

/**
 * Available AI models for summary generation
 */
export const models: ModelOption[] = [
  {
    label: "Gemini 2.5 Pro",
    value: "gemini-2.5-pro",
    description: "Complex reasoning model.",
  },
  {
    label: "Gemini 2.5 Flash",
    value: "gemini-2.5-flash",
    description: "Balance of price and performance.",
  },
  {
    label: "Gemini 2.5 Flash-Lite",
    value: "gemini-2.5-flash-lite",
    description: "Cost-effective for high-throughput tasks.",
  },
  {
    label: "Gemini 2.0 Flash",
    value: "gemini-2.0-flash",
    description: "Well-rounded with price-performance focus.",
  },
  {
    label: "Gemini 2.0 Flash-Lite",
    value: "gemini-2.0-flash-lite",
    description: "Cost-efficient and low latency.",
  },
];

/**
 * Available summary length options
 */
export const lengths: LengthOption[] = [
  { label: "Concise", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Detailed", value: "long" },
];

export const GEMINI_MODEL_MAP: Record<string, string> = {
  "gemini-2.5-pro": "gemini-2.5-pro",
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
  "gemini-2.0-flash": "gemini-2.0-flash",
  "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
};

export const SUMMARY_STYLE_COPY: Record<string, string> = {
  short:
    "Provide a concise summary (2-3 sentences) highlighting the top insights.",
  medium:
    "Provide a medium-length summary (3-5 bullet sentences) covering the main sections and key takeaways.",
  long: "Provide a detailed summary (6+ sentences) including context, supporting points, and any action items discussed.",
};

export const MAX_TRANSCRIPT_CHARACTERS = 6000;

export const API_KEY_STORAGE_KEY = "googleAIStudioApiKey";
export const GOOGLE_API_KEY_URL = "https://aistudio.google.com/app/apikey";
