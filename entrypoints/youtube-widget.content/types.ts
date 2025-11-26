/**
 * Type definitions for the YouTube Summary Widget
 */

export type TranscriptSegment = {
  offset: number;
  text: string;
};

export type ActiveView = "summary" | "transcript" | null;

export type LanguageOption = {
  label: string;
  value: string;
};

export type ModelOption = {
  label: string;
  value: string;
};

export type LengthOption = {
  label: string;
  value: string;
};
