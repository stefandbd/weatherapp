import axios, {AxiosError} from 'axios';
import axiosInstance from '../httpclient/index';
import Config from 'react-native-config';
import {
  WeatherErrorType,
  createWeatherError,
} from '../httpclient/queries/weatherQueries';

// Define proper types for weather data
export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: number;
    pop: number;
    rain?: number;
    uvi: number;
  }>;
  hourly?: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
}

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  // If the error is already a WeatherError, just return it
  if (error && typeof error === 'object' && 'type' in error) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Handle network errors
    if (!axiosError.response) {
      return createWeatherError(
        'Network error. Please check your internet connection.',
        WeatherErrorType.NETWORK_ERROR,
        undefined,
        error,
      );
    }

    // Handle API errors with status codes
    const statusCode = axiosError.response.status;
    let errorMessage = 'An error occurred while fetching weather data.';

    if (statusCode === 401) {
      errorMessage = 'API key is invalid or expired.';
    } else if (statusCode === 404) {
      errorMessage = 'Weather data not found for this location.';
    } else if (statusCode === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (statusCode >= 500) {
      errorMessage =
        'Weather service is currently unavailable. Please try again later.';
    }

    return createWeatherError(
      errorMessage,
      WeatherErrorType.API_ERROR,
      statusCode,
      error,
    );
  }

  // Handle other errors
  return createWeatherError(
    'An unexpected error occurred.',
    WeatherErrorType.UNKNOWN_ERROR,
    undefined,
    error,
  );
};

// Fetch weather data with improved error handling
export const fetchWeatherData = async (
  latitude: number,
  longitude: number,
): Promise<WeatherData> => {
  try {
    // Validate coordinates
    if (!latitude || !longitude) {
      throw createWeatherError(
        'Invalid coordinates provided',
        WeatherErrorType.INVALID_COORDINATES,
      );
    }

    // Make API request with timeout
    const response = await axiosInstance.get(
      `${Config.BASE_URL}onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&appid=${Config.API_KEY}`,
      {timeout: 10000}, // 10 second timeout
    );

    // Validate response data
    if (!response.data || !response.data.current || !response.data.daily) {
      throw createWeatherError(
        'Invalid data received from weather service',
        WeatherErrorType.API_ERROR,
      );
    }

    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching weather data:', error);

    // Handle and transform the error
    const transformedError = handleApiError(error);
    throw transformedError;
  }
};
