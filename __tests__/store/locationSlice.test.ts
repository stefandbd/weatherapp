import locationReducer, {
  setLocation,
  setPermissionStatus,
  setLocationError,
  resetLocation,
  setWeatherData,
  setWeatherError,
  setCityName,
  addRecentSearch,
  clearRecentSearches,
} from '../../app/store/locationSlice';

// Define interfaces to match those in the locationSlice
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

// Mock the storage utility
jest.mock('../../app/utils/storage', () => ({
  getRecentSearches: jest.fn().mockReturnValue([]),
  saveRecentSearches: jest.fn(),
}));

describe('Location Slice', () => {
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
    recentSearches: [],
  };

  it('should return the initial state', () => {
    // Use a valid action type for the test
    const action = {type: 'TEST_ACTION'};
    expect(locationReducer(undefined, action)).toEqual(
      expect.objectContaining({
        latitude: null,
        longitude: null,
        permissionStatus: 'unknown',
        error: null,
      }),
    );
  });

  it('should handle setLocation', () => {
    const coords = {latitude: 40.7128, longitude: -74.006};
    const nextState = locationReducer(initialState, setLocation(coords));

    expect(nextState.latitude).toBe(coords.latitude);
    expect(nextState.longitude).toBe(coords.longitude);
    expect(nextState.error).toBeNull();
  });

  it('should handle setPermissionStatus', () => {
    const status: LocationState['permissionStatus'] = 'granted';
    const nextState = locationReducer(
      initialState,
      setPermissionStatus(status),
    );

    expect(nextState.permissionStatus).toBe(status);
  });

  it('should handle setLocationError', () => {
    const errorMessage = 'Location not available';
    const nextState = locationReducer(
      initialState,
      setLocationError(errorMessage),
    );

    expect(nextState.error).toBe(errorMessage);
  });

  it('should handle resetLocation', () => {
    // First set some location data
    const stateWithLocation = locationReducer(
      initialState,
      setLocation({latitude: 40.7128, longitude: -74.006}),
    );

    // Then reset it
    const nextState = locationReducer(stateWithLocation, resetLocation());

    expect(nextState.latitude).toBeNull();
    expect(nextState.longitude).toBeNull();
    expect(nextState.error).toBeNull();
  });

  it('should handle setWeatherData', () => {
    const weatherData = {
      temperature: 25,
      feelsLike: 27,
      humidity: 60,
      windSpeed: 5,
      description: 'clear sky',
      icon: '01d',
      forecast: [
        {
          date: 1650034800,
          minTemp: 20,
          maxTemp: 28,
          description: 'few clouds',
          icon: '02d',
          humidity: 65,
          windSpeed: 4,
        },
      ],
    };

    const nextState = locationReducer(
      initialState,
      setWeatherData(weatherData),
    );

    expect(nextState.weather).toEqual(weatherData);
    expect(nextState.weatherError).toBeNull();
  });

  it('should handle setWeatherError', () => {
    const errorMessage = 'Failed to fetch weather data';
    const nextState = locationReducer(
      initialState,
      setWeatherError(errorMessage),
    );

    expect(nextState.weatherError).toBe(errorMessage);
  });

  it('should handle setCityName', () => {
    const cityName = 'New York';
    const nextState = locationReducer(initialState, setCityName(cityName));

    expect(nextState.cityName).toBe(cityName);
  });

  it('should handle addRecentSearch', () => {
    const search = {
      cityName: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
    };

    const nextState = locationReducer(initialState, addRecentSearch(search));

    expect(nextState.recentSearches.length).toBe(1);
    expect(nextState.recentSearches[0].cityName).toBe(search.cityName);
    expect(nextState.recentSearches[0].latitude).toBe(search.latitude);
    expect(nextState.recentSearches[0].longitude).toBe(search.longitude);
    expect(nextState.recentSearches[0].timestamp).toBeDefined();
  });

  it('should handle addRecentSearch with duplicate city', () => {
    // First add a search
    const search1 = {
      cityName: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
    };

    const stateWithOneSearch = locationReducer(
      initialState,
      addRecentSearch(search1),
    );

    // Then add the same city with different coordinates
    const search2 = {
      cityName: 'New York',
      latitude: 40.713, // Slightly different coordinates
      longitude: -74.0065,
    };

    const nextState = locationReducer(
      stateWithOneSearch,
      addRecentSearch(search2),
    );

    // Should still have only one search for New York (the latest one)
    expect(nextState.recentSearches.length).toBe(1);
    expect(nextState.recentSearches[0].cityName).toBe(search2.cityName);
    expect(nextState.recentSearches[0].latitude).toBe(search2.latitude);
    expect(nextState.recentSearches[0].longitude).toBe(search2.longitude);
  });

  it('should limit recent searches to 10', () => {
    // Create a state with 10 searches
    let stateWithSearches = initialState;

    for (let i = 0; i < 10; i++) {
      stateWithSearches = locationReducer(
        stateWithSearches,
        addRecentSearch({
          cityName: `City ${i}`,
          latitude: i,
          longitude: i,
        }),
      );
    }

    // Add one more search
    const newSearch = {
      cityName: 'New City',
      latitude: 50,
      longitude: 50,
    };

    const nextState = locationReducer(
      stateWithSearches,
      addRecentSearch(newSearch),
    );

    // Should still have 10 searches
    expect(nextState.recentSearches.length).toBe(10);

    // The newest search should be first
    expect(nextState.recentSearches[0].cityName).toBe(newSearch.cityName);

    // The oldest search should be removed
    expect(
      nextState.recentSearches.find(s => s.cityName === 'City 0'),
    ).toBeUndefined();
  });

  it('should handle clearRecentSearches', () => {
    // First add some searches
    let stateWithSearches = initialState;

    for (let i = 0; i < 3; i++) {
      stateWithSearches = locationReducer(
        stateWithSearches,
        addRecentSearch({
          cityName: `City ${i}`,
          latitude: i,
          longitude: i,
        }),
      );
    }

    // Then clear them
    const nextState = locationReducer(stateWithSearches, clearRecentSearches());

    expect(nextState.recentSearches).toEqual([]);
  });
});
