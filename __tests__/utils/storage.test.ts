import {
  storage,
  getRecentSearches,
  saveRecentSearches,
  STORAGE_KEYS,
} from '../../app/utils/storage';

// Mock the MMKV storage
jest.mock('react-native-mmkv', () => {
  const mockMMKV = {
    getString: jest.fn(),
    set: jest.fn(),
  };

  return {
    MMKV: jest.fn().mockImplementation(() => mockMMKV),
  };
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecentSearches', () => {
    it('should return parsed searches when storage has data', () => {
      const mockSearches = [
        {
          cityName: 'New York',
          latitude: 40.7128,
          longitude: -74.006,
          timestamp: 1650034800000,
        },
        {
          cityName: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          timestamp: 1650034700000,
        },
      ];

      // Mock the storage.getString to return JSON string
      storage.getString = jest
        .fn()
        .mockReturnValue(JSON.stringify(mockSearches));

      const result = getRecentSearches();

      expect(storage.getString).toHaveBeenCalledWith(
        STORAGE_KEYS.RECENT_SEARCHES,
      );
      expect(result).toEqual(mockSearches);
    });

    it('should return empty array when storage is empty', () => {
      // Mock the storage.getString to return null
      storage.getString = jest.fn().mockReturnValue(null);

      const result = getRecentSearches();

      expect(storage.getString).toHaveBeenCalledWith(
        STORAGE_KEYS.RECENT_SEARCHES,
      );
      expect(result).toEqual([]);
    });

    it('should handle invalid JSON and return empty array', () => {
      // Mock the storage.getString to return invalid JSON
      storage.getString = jest.fn().mockReturnValue('invalid json');

      // Mock console.error to avoid polluting test output
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const result = getRecentSearches();

      expect(storage.getString).toHaveBeenCalledWith(
        STORAGE_KEYS.RECENT_SEARCHES,
      );
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();

      // Restore console.error
      console.error = originalConsoleError;
    });
  });

  describe('saveRecentSearches', () => {
    it('should save searches to storage', () => {
      const mockSearches = [
        {
          cityName: 'New York',
          latitude: 40.7128,
          longitude: -74.006,
          timestamp: 1650034800000,
        },
      ];

      saveRecentSearches(mockSearches);

      expect(storage.set).toHaveBeenCalledWith(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(mockSearches),
      );
    });

    it('should save empty array to storage', () => {
      saveRecentSearches([]);

      expect(storage.set).toHaveBeenCalledWith(
        STORAGE_KEYS.RECENT_SEARCHES,
        '[]',
      );
    });
  });
});
