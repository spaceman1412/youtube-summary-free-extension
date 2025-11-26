import { GoogleGenAI } from "@google/genai";

const VALIDATION_MODEL = "gemini-2.5-flash";
const VALIDATION_TIMEOUT_MS = 8000;

const GENERIC_ERROR_MESSAGE =
  "Could not verify the API key. Please double-check it and try again.";

/**
 * Verifies that a Google AI Studio API key is usable by performing
 * a lightweight metadata request against the Gemini API.
 */
export async function validateApiKey(candidateKey: string): Promise<void> {
  const trimmedKey = candidateKey.trim();
  if (!trimmedKey) {
    throw new Error("Please paste a Google AI Studio API key to continue.");
  }

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId =
    controller !== null
      ? setTimeout(() => controller.abort(), VALIDATION_TIMEOUT_MS)
      : null;

  try {
    const ai = new GoogleGenAI({ apiKey: trimmedKey });
    await ai.models.get({
      model: VALIDATION_MODEL,
      config: controller ? { abortSignal: controller.signal } : undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : GENERIC_ERROR_MESSAGE;
    throw new Error(
      message.includes("abort")
        ? "API key validation timed out. Please try again."
        : message
    );
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

