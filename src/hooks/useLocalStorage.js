import { useState, useEffect } from 'react';

/**
 * Custom hook for synchronizing state with browser LocalStorage.
 * Wrapped in try/catch to safely handle private browsing / restricted access.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`useLocalStorage: Failed to read key "${key}" from localStorage:`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`useLocalStorage: Failed to set key "${key}" in localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
