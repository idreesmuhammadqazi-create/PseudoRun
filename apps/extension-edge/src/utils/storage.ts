/**
 * LocalStorage utilities for saving and loading code
 */

const STORAGE_KEY = 'igcse_pseudocode_editor_content';

/**
 * Save code to LocalStorage
 */
export function saveCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (error) {
    console.error('Failed to save code to LocalStorage:', error);
  }
}

/**
 * Load code from LocalStorage
 */
export function loadCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to load code from LocalStorage:', error);
    return null;
  }
}

/**
 * Clear saved code from LocalStorage
 */
export function clearSavedCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear code from LocalStorage:', error);
  }
}

/**
 * Check if LocalStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}
