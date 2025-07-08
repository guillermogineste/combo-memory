import { useState, useEffect } from 'react';

/**
 * Custom hook for managing local storage with type safety
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * const [user, setUser, removeUser] = useLocalStorage<User>('user', null);
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  console.log('useLocalStorage initialized for key:', key);

  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      console.log('Retrieved from localStorage:', { key, item });
      
      if (item === null) {
        console.log('No value found, using initial value:', initialValue);
        return initialValue;
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      console.log('Setting localStorage value:', { key, value: valueToStore });
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      console.log('Successfully saved to localStorage');
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  };

  // Remove from localStorage
  const removeValue = () => {
    try {
      console.log('Removing localStorage key:', key);
      
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      console.log('Successfully removed from localStorage');
    } catch (error) {
      console.error('Error removing localStorage key:', key, error);
    }
  };

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        console.log('localStorage changed from external source:', { key, newValue: e.newValue });
        
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing localStorage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}; 