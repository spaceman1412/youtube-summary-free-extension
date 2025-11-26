/**
 * Service functions for chat functionality with video transcript context
 */

import { GoogleGenAI } from "@google/genai";
import type { TranscriptSegment, ChatMessage } from "./types";
import { GEMINI_MODEL_MAP } from "./constants";
import { reduceTranscript } from "./utils";
import { getLanguageLabel } from "./summaryService";

/**
 * Gets the Gemini model ID from the user-selected model
 */
function getModelId(model: string): string {
  return GEMINI_MODEL_MAP[model] ?? GEMINI_MODEL_MAP["gemini-2.5-flash"];
}

/**
 * Builds the system prompt with transcript context
 */
function buildChatSystemPrompt(
  transcriptText: string,
  language: string
): string {
  const languageLabel = getLanguageLabel(language);
  return [
    `You are a helpful assistant answering questions about a YouTube video.`,
    `You have access to the video transcript in ${languageLabel}.`,
    `Use the transcript to provide accurate, contextual answers.`,
    `If the question cannot be answered from the transcript, say so.`,
    `Keep responses concise and relevant.`,
    ``,
    `Video Transcript:`,
    `"""${transcriptText}"""`,
  ].join("\n");
}

/**
 * Builds the full chat prompt including system context and conversation history
 */
function buildChatPrompt(
  transcriptText: string,
  language: string,
  messages: ChatMessage[]
): string {
  const systemPrompt = buildChatSystemPrompt(transcriptText, language);
  
  // Build conversation history as text
  const conversationText = messages
    .map((msg) => {
      const roleLabel = msg.role === "user" ? "User" : "Assistant";
      return `${roleLabel}: ${msg.content}`;
    })
    .join("\n\n");

  return `${systemPrompt}\n\nConversation History:\n${conversationText}\n\nAssistant:`;
}

/**
 * Generates a chat response using Google Gemini AI
 */
export async function generateChatResponse(
  apiKey: string,
  messages: ChatMessage[],
  transcript: TranscriptSegment[],
  model: string,
  language: string
): Promise<string> {
  if (!transcript.length) {
    throw new Error("Transcript is empty. Please fetch the transcript first.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const transcriptText = reduceTranscript(transcript);
  const prompt = buildChatPrompt(transcriptText, language, messages);

  const response = await ai.models.generateContent({
    model: getModelId(model),
    contents: prompt,
    config: {
      maxOutputTokens: 1024,
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

  const finalResponse = inlineText || fallbackText;
  if (!finalResponse) {
    throw new Error("Gemini returned an empty response.");
  }

  return finalResponse;
}

