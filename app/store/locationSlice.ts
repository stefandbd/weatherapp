import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {getRecentSearches, saveRecentSearches} from '../utils/storage';

interface DailyForecast {
  date: number;
  minTemp: number;
  maxTemp: number;
  description: string | null;
  icon: string | null;
  humidity: number;
  windSpeed: number;
}

interface WeatherData {
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  windSpeed: number | null;
  description: string | null;
  icon: string | null;
  forecast: DailyForecast[];
}

interface SearchItem {
  cityName: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  permissionStatus:
    | 'granted'
    | 'denied'
    | 'unavailable'
    | 'requesting'
    | 'unknown';
  error: string | null;
  weather: WeatherData;
  weatherError: string | null;
  cityName: string | null;
  recentSearches: SearchItem[];
}

// Async thunks for storage operations
export const addRecentSearchAsync = createAsyncThunk(
  'location/addRecentSearchAsync',
  async (payload: {cityName: string; latitude: number; longitude: number}) => {
    const {cityName, latitude, longitude} = payload;

    // Get current searches from storage
    const currentSearches = getRecentSearches() || [];

    // Check if this search already exists
    const existingSearchIndex = currentSearches.findIndex(
      (search: SearchItem) => search.cityName === cityName,
    );

    // If it exists, remove it (we'll add it back at the top)
    if (existingSearchIndex !== -1) {
      currentSearches.splice(existingSearchIndex, 1);
    }

    // Add the new search to the beginning of the array
    const newSearches = [
      {
        cityName,
        latitude,
        longitude,
        timestamp: Date.now(),
      },
      ...currentSearches,
    ];

    // Limit to 10 recent searches
    const limitedSearches = newSearches.slice(0, 10);

    // Save to persistent storage
    await saveRecentSearches(limitedSearches);

    return limitedSearches;
  },
);

export const clearRecentSearchesAsync = createAsyncThunk(
  'location/clearRecentSearchesAsync',
  async () => {
    // Clear from persistent storage asynchronously
    await saveRecentSearches([]);
    return [];
  },
);

// Load initial recent searches from storage
const savedSearches = getRecentSearches();

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  permissionStatus: 'unknown',
  error: null,
  weather: {
    temperature: null,
    feelsLike: null,
    humidity: null,
    windSpeed: null,
    description: null,
    icon: null,
    forecast: [],
  },
  weatherError: null,
  cityName: null,
  recentSearches: savedSearches || [],
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{latitude: number; longitude: number}>,
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.error = null;
    },
    setPermissionStatus: (
      state,
      action: PayloadAction<LocationState['permissionStatus']>,
    ) => {
      state.permissionStatus = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetLocation: state => {
      state.latitude = null;
      state.longitude = null;
      state.error = null;
    },
    setWeatherData: (state, action: PayloadAction<WeatherData>) => {
      state.weather = action.payload;
      state.weatherError = null;
    },
    setWeatherError: (state, action: PayloadAction<string>) => {
      state.weatherError = action.payload;
    },
    setCityName: (state, action: PayloadAction<string>) => {
      state.cityName = action.payload;
    },
    // Keep synchronous version for immediate updates
    addRecentSearch: (
      state,
      action: PayloadAction<{
        cityName: string;
        latitude: number;
        longitude: number;
      }>,
    ) => {
      const {cityName, latitude, longitude} = action.payload;

      // Check if this search already exists
      const existingSearchIndex = state.recentSearches.findIndex(
        search => search.cityName === cityName,
      );

      // If it exists, remove it (we'll add it back at the top)
      if (existingSearchIndex !== -1) {
        state.recentSearches.splice(existingSearchIndex, 1);
      }

      // Add the new search to the beginning of the array
      state.recentSearches.unshift({
        cityName,
        latitude,
        longitude,
        timestamp: Date.now(),
      });

      // Limit to 10 recent searches
      if (state.recentSearches.length > 10) {
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    clearRecentSearches: state => {
      state.recentSearches = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addRecentSearchAsync.fulfilled, (state, action) => {
        // action.payload is the array of searches returned from the thunk
        state.recentSearches = action.payload;
      })
      .addCase(clearRecentSearchesAsync.fulfilled, state => {
        state.recentSearches = [];
      });
  },
});

export const {
  setLocation,
  setPermissionStatus,
  setLocationError,
  resetLocation,
  setWeatherData,
  setWeatherError,
  setCityName,
  addRecentSearch,
  clearRecentSearches,
} = locationSlice.actions;

// Selectors
import {RootState} from './index';
import {createSelector} from '@reduxjs/toolkit';

// Simple selectors for primitive values
export const selectLatitude = (state: RootState) => state.location.latitude;
export const selectLongitude = (state: RootState) => state.location.longitude;
export const selectCityName = (state: RootState) => state.location.cityName;
export const selectLocationError = (state: RootState) => state.location.error;
export const selectWeatherError = (state: RootState) =>
  state.location.weatherError;

// Simple selectors for objects (no need for memoization if we're just returning the state)
export const selectWeatherData = (state: RootState) => state.location.weather;
export const selectRecentSearches = (state: RootState) =>
  state.location.recentSearches;

// Memoized selector with actual transformation
export const selectLocationStatus = createSelector(
  [selectLatitude, selectLongitude, selectCityName, selectLocationError],
  (latitude, longitude, cityName, error) => {
    // Return a new object with transformed data
    return {
      latitude,
      longitude,
      cityName: cityName || 'Unknown Location', // Provide default value
      error: error || null,
      // Add a derived property
      hasValidCoordinates: latitude !== null && longitude !== null,
    };
  },
);

export default locationSlice.reducer;
