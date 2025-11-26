import { useCallback, useRef, useState } from "react";
import type { ChatMessage, TranscriptSegment } from "../types";
import { generateChatResponse } from "../chatService";

type EnsureTranscriptFn = () => Promise<TranscriptSegment[]>;

type ChatSendRequest = {
  apiKey: string;
  language: string;
  model: string;
  ensureTranscript: EnsureTranscriptFn;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  const syncMessages = useCallback((next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const resetChat = useCallback(() => {
    syncMessages([]);
    setInputValue("");
    setError(null);
    setIsLoading(false);
  }, [syncMessages]);

  const prepareChat = useCallback(
    async (ensureTranscript: EnsureTranscriptFn) => {
      setError(null);
      setIsLoading(true);
      try {
        const transcript = await ensureTranscript();
        if (!transcript.length) {
          setError("Transcript was empty for this video.");
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch transcript. Please try again.";
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const sendMessage = useCallback(
    async ({ apiKey, language, model, ensureTranscript }: ChatSendRequest) => {
      const trimmedInput = inputValue.trim();
      if (!trimmedInput || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      let transcript: TranscriptSegment[];
      try {
        transcript = await ensureTranscript();
        if (!transcript.length) {
          setError("Transcript was empty for this video.");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch transcript. Please try again.";
        setError(message);
        setIsLoading(false);
        return;
      }

      const userMessage: ChatMessage = { role: "user", content: trimmedInput };
      const previousMessages = messagesRef.current;
      const optimisticMessages = [...previousMessages, userMessage];

      syncMessages(optimisticMessages);
      setInputValue("");

      try {
        const response = await generateChatResponse(
          apiKey,
          optimisticMessages,
          transcript,
          model,
          language
        );
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response,
        };
        syncMessages([...optimisticMessages, assistantMessage]);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to generate response. Please try again.";
        setError(message);
        syncMessages(previousMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, syncMessages]
  );

  return {
    chatMessages: messages,
    chatInput: inputValue,
    chatError: error,
    isChatLoading: isLoading,
    setChatInput: setInputValue,
    prepareChat,
    sendMessage,
    resetChat,
  };
}

