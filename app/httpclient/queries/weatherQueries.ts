import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {fetchWeatherData} from '../../services/weatherService';
import {useAppDispatch} from '../../store/hooks';
import {
  setCityName,
  addRecentSearch,
  setWeatherData,
  setWeatherError,
} from '../../store/locationSlice';

// Define error types for better error handling
export enum WeatherErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  INVALID_COORDINATES = 'INVALID_COORDINATES',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface WeatherError extends Error {
  type: WeatherErrorType;
  statusCode?: number;
  originalError?: any;
}

// Create a custom error factory
export const createWeatherError = (
  message: string,
  type: WeatherErrorType,
  statusCode?: number,
  originalError?: any,
): WeatherError => {
  const error = new Error(message) as WeatherError;
  error.type = type;
  error.statusCode = statusCode;
  error.originalError = originalError;
  return error;
};

// Query keys
export const weatherKeys = {
  all: ['weather'] as const,
  byCoordinates: (lat: number, lon: number) =>
    [...weatherKeys.all, 'coordinates', lat, lon] as const,
};

// Define proper types for weather data
export interface DailyForecast {
  date: number;
  minTemp: number;
  maxTemp: number;
  description: string | null;
  icon: string | null;
  humidity: number;
  windSpeed: number;
}

export interface ProcessedWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string | null;
  icon: string | null;
  forecast: DailyForecast[];
}

// Define more specific types for raw weather data
interface RawWeatherData {
  current?: {
    temp?: number;
    feels_like?: number;
    humidity?: number;
    wind_speed?: number;
    weather?: Array<{
      description?: string;
      icon?: string;
    }>;
  };
  daily?: Array<{
    dt?: number;
    temp?: {
      min?: number;
      max?: number;
    };
    weather?: Array<{
      description?: string;
      icon?: string;
    }>;
    humidity?: number;
    wind_speed?: number;
  }>;
}

// Process weather data function with proper typing
const processWeatherData = (
  weatherData: RawWeatherData,
): ProcessedWeatherData => {
  try {
    // Validate required fields
    if (!weatherData.current || !weatherData.daily) {
      throw createWeatherError(
        'Invalid weather data format',
        WeatherErrorType.API_ERROR,
      );
    }

    // Process daily forecast data with safety checks
    const forecastData = weatherData.daily.slice(1, 6).map(
      (day): DailyForecast => ({
        date: day.dt || 0,
        minTemp: day.temp?.min ?? 0,
        maxTemp: day.temp?.max ?? 0,
        description: day.weather?.[0]?.description || null,
        icon: day.weather?.[0]?.icon || null,
        humidity: day.humidity ?? 0,
        windSpeed: day.wind_speed ?? 0,
      }),
    );

    return {
      temperature: weatherData.current.temp ?? 0,
      feelsLike: weatherData.current.feels_like ?? 0,
      humidity: weatherData.current.humidity ?? 0,
      windSpeed: weatherData.current.wind_speed ?? 0,
      description: weatherData.current.weather?.[0]?.description || null,
      icon: weatherData.current.weather?.[0]?.icon || null,
      forecast: forecastData,
    };
  } catch (error) {
    console.error('Error processing weather data:', error);
    throw createWeatherError(
      'Failed to process weather data',
      WeatherErrorType.UNKNOWN_ERROR,
      undefined,
      error,
    );
  }
};

// Helper function to get user-friendly error message
const getErrorMessage = (error: unknown): string => {
  // Check if it's our custom WeatherError type
  if (error && typeof error === 'object' && 'type' in error) {
    const weatherError = error as WeatherError;

    if (weatherError.type === WeatherErrorType.NETWORK_ERROR) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (weatherError.type === WeatherErrorType.API_ERROR) {
      return `Weather service error${
        weatherError.statusCode ? ` (${weatherError.statusCode})` : ''
      }. Please try again later.`;
    } else if (weatherError.type === WeatherErrorType.INVALID_COORDINATES) {
      return 'Invalid location coordinates. Please try a different location.';
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error type
  return 'An unexpected error occurred. Please try again.';
};

// Simplified hook for fetching weather data by coordinates
export const useWeatherByCoordinates = (
  lat: number | null,
  lon: number | null,
  enabled = true,
) => {
  const dispatch = useAppDispatch();

  // The main query for fetching weather data
  const query = useQuery({
    queryKey: weatherKeys.byCoordinates(lat ?? 0, lon ?? 0),
    queryFn: async () => {
      try {
        if (lat === null || lon === null) {
          throw createWeatherError(
            'Latitude and longitude are required',
            WeatherErrorType.INVALID_COORDINATES,
          );
        }

        const data = await fetchWeatherData(lat, lon);
        const processedData = processWeatherData(data);

        return processedData;
      } catch (error) {
        // Format and rethrow the error
        const formattedError =
          error instanceof Error ? error : new Error('Unknown error');
        console.error('Error in weather query:', formattedError);

        throw error;
      }
    },
    enabled: enabled && lat !== null && lon !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes - align with query client default
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - align with query client default
  });

  // Update Redux store when query data changes
  useEffect(() => {
    if (query.data) {
      dispatch(setWeatherData(query.data));
    }
  }, [query.data, dispatch]);

  // Update Redux store when query error changes
  useEffect(() => {
    if (query.error) {
      dispatch(setWeatherError(getErrorMessage(query.error)));
    } else if (!query.isLoading) {
      // Clear error when query succeeds or is not loading
      dispatch(setWeatherError(''));
    }
  }, [query.error, query.isLoading, dispatch]);

  return query;
};

// Helper function to update city name and add to recent searches
export const updateCityAndAddToRecentSearches = (
  dispatch: ReturnType<typeof useAppDispatch>,
  cityName: string,
  latitude: number,
  longitude: number,
) => {
  dispatch(setCityName(cityName));
  dispatch(
    addRecentSearch({
      cityName,
      latitude,
      longitude,
    }),
  );
};
