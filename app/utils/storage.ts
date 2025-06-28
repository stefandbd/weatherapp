import {MMKV} from 'react-native-mmkv';

// Create the storage instance
export const storage = new MMKV({
  id: 'weather-app-storage',
  encryptionKey: 'weather-app-encryption-key',
});

// Keys for storage
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'recent_searches',
};

// Helper functions
export const getRecentSearches = () => {
  const searches = storage.getString(STORAGE_KEYS.RECENT_SEARCHES);
  if (searches) {
    try {
      return JSON.parse(searches);
    } catch (error) {
      console.error('Error parsing recent searches:', error);
      return [];
    }
  }
  return [];
};

export const saveRecentSearches = (searches: any[]) => {
  storage.set(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
};
