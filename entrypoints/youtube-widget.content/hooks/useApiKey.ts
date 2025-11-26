import { useCallback, useEffect, useState } from "react";
import { getStoredApiKey, saveApiKey, removeApiKey } from "../apiKeyService";
import { validateApiKey } from "../apiValidationService";

export function useApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setInputValue(storedKey);
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setNotice(null);
    setValidationError(null);
  }, []);

  const save = useCallback(async () => {
    if (isValidating) {
      return;
    }
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setNotice("Please paste a Google AI Studio API key to continue.");
      return;
    }
    setNotice("Testing API key…");
    setValidationError(null);
    setIsValidating(true);
    try {
      await validateApiKey(trimmed);
      saveApiKey(trimmed);
      setApiKey(trimmed);
      setNotice("API key validated and saved. You can update it anytime.");
      setIsEditing(false);
    } catch (error) {
      setNotice(null);
      setValidationError(
        error instanceof Error
          ? error.message
          : "Failed to validate API key. Please try again."
      );
    } finally {
      setIsValidating(false);
    }
  }, [inputValue, isValidating]);

  const reset = useCallback(() => {
    removeApiKey();
    setApiKey("");
    setInputValue("");
    setNotice(null);
    setValidationError(null);
    setIsEditing(false);
    setIsValidating(false);
  }, []);

  const toggleEditor = useCallback(() => {
    if (!apiKey && !isEditing) {
      return;
    }
    setIsEditing((previous) => {
      const next = !previous;
      if (next) {
        setInputValue(apiKey);
      }
      return next;
    });
    setNotice(null);
  }, [apiKey, isEditing]);

  const showGate = !apiKey || isEditing;

  return {
    apiKey,
    apiKeyInput: inputValue,
    apiKeyNotice: notice,
    apiKeyValidationError: validationError,
    isValidatingApiKey: isValidating,
    isEditingApiKey: isEditing,
    showApiKeyGate: showGate,
    handleApiKeyInputChange: handleInputChange,
    handleSaveApiKey: save,
    handleResetApiKey: reset,
    handleToggleApiKeyEditor: toggleEditor,
  };
}
