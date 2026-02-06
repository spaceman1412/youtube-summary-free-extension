/**
 * Service functions for managing API key storage
 * Uses browser.storage.local (extension-private, not accessible to page scripts)
 */

import { API_KEY_STORAGE_KEY } from "./constants";

/**
 * Retrieves the stored API key from extension storage
 */
export async function getStoredApiKey(): Promise<string | null> {
  const result = await browser.storage.local.get(API_KEY_STORAGE_KEY);
  return result[API_KEY_STORAGE_KEY] ?? null;
}

/**
 * Saves the API key to extension storage
 */
export async function saveApiKey(apiKey: string): Promise<void> {
  if (apiKey) {
    await browser.storage.local.set({ [API_KEY_STORAGE_KEY]: apiKey });
  } else {
    await browser.storage.local.remove(API_KEY_STORAGE_KEY);
  }
}

/**
 * Removes the API key from extension storage
 */
export async function removeApiKey(): Promise<void> {
  await browser.storage.local.remove(API_KEY_STORAGE_KEY);
}
