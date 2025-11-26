/**
 * Type definitions for the YouTube Summary Widget
 */

export type TranscriptSegment = {
  offset: number;
  text: string;
};

export type ActiveView = "summary" | "transcript" | "chat" | null;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type LanguageOption = {
  label: string;
  value: string;
};

export type ModelOption = {
  label: string;
  value: string;
  description?: string;
};

export type LengthOption = {
  label: string;
  value: string;
};
