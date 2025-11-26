/**
 * Service functions for managing API key storage
 */

import { API_KEY_STORAGE_KEY } from "./constants";

/**
 * Retrieves the stored API key from localStorage
 */
export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(API_KEY_STORAGE_KEY);
}

/**
 * Saves the API key to localStorage
 */
export function saveApiKey(apiKey: string): void {
  if (typeof window === "undefined") return;
  if (apiKey) {
    window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } else {
    window.localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Removes the API key from localStorage
 */
export function removeApiKey(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(API_KEY_STORAGE_KEY);
}
